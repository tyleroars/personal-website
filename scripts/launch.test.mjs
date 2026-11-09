import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'../dist');
const config=JSON.parse(fs.readFileSync(path.resolve(root,'../launch-data.json'),'utf8'));
const physicalWalk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?physicalWalk(path.join(d,e.name)):[path.join(d,e.name)]);
const documents=JSON.parse(fs.readFileSync(path.resolve(root,'../generated-documents.json'),'utf8'));
const walk=()=>Object.keys(documents).map(p=>path.join(root,p.slice(1))).concat(physicalWalk(path.join(root,'client')));
const read=p=>documents['/'+p]??fs.readFileSync(path.join(root,'client',p),'utf8');
const exists=p=>{const rel=path.relative(root,p);return ('/'+rel) in documents||fs.existsSync(path.join(root,'client',rel));};
const context=vm.createContext({});
for(const f of ['projects.js','interviews.js','writing.js'])vm.runInContext(read(f),context);
const data=vm.runInContext('({projects,interviewArchive,writingArchive})',context);
function localFile(url) {
  let p=decodeURIComponent(url.pathname).replace(/^\//,'');
  if(!p)p='index.html';
  const possibilities=[p,p+'.html',path.join(p,'index.html')];
  return possibilities.map(p=>path.join(root,p)).find(p=>exists(p));
}
test('all 26 public routes have production canonicals, descriptions and indexing',()=>{
  const pages=walk(root).filter(p=>p.endsWith('.html')&&!p.includes('huddledex-browser')&&!p.endsWith('/404.html'));
  assert.equal(pages.length,27);
  for(const file of pages){
    const html=read(path.relative(root,file).replace(/^client\//,''));
    assert.ok(html.includes('<link rel="canonical" href="'+config.origin+'/'));
    assert.doesNotMatch(html,/noindex|localhost|127\.0\.0\.1/);
    assert.match(html,/name="description"/);
    assert.match(html,/property="og:image"/);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
  }
  assert.equal((read('sitemap.xml').match(/<loc>/g)||[]).length,26);
  assert.match(read('robots.txt'),/Allow: \//);
});
test('HTML and CSS local resource references stay within the published package',()=>{
  for(const file of walk(root).filter(p=>/\.(html|css)$/.test(p))){
    const body=read(path.relative(root,file).replace(/^client\//,'')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    const relative=path.relative(root,file).split(path.sep).join('/');
    const url=new URL(relative,config.origin+'/');
    const base=body.match(/<base\s+href="([^"]+)"/)?.[1];
    const refs=[...body.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(x=>x[1]);
    refs.push(...[...body.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(x=>x[1]));
    for(const ref of refs){
      if(ref.includes('${')||ref.startsWith('#')||ref.startsWith('data:'))continue;
      const dest=new URL(ref,base?new URL(base,url):url);
      if(dest.origin!==config.origin)continue;
      assert.ok(localFile(dest),`${relative} references missing ${dest.pathname}`);
    }
  }
});
test('every project gallery and interview portrait is included; hidden projects are absent',()=>{
  for(const icon of ['chatgpt','claude','gemini','copy-prompt','menu','close'])assert.ok(exists(path.join(root,'assets/icons',icon+'.svg')),icon);
  assert.equal(data.projects.length,14);
  assert.equal(data.interviewArchive.length,85);
  assert.equal(data.writingArchive.length,21);
  for(const p of data.projects){
    assert.ok(['Independent','Experiments','Earlier'].includes(p.kind));
    for(const key of ['previewImages','screenshots','gallery'])for(const image of p[key]||[]){
      for(const attr of ['src','thumb'])if(image[attr])assert.ok(exists(path.join(root,'assets',image[attr])),image[attr]);
      assert.ok(image.alt?.trim());
    }
  }
  for(const i of data.interviewArchive)assert.ok(exists(path.join(root,'assets',i.image)),i.image);
  for(const name of ['command','agents','digital-asset-research'])assert.ok(!data.projects.some(p=>p.id===name));
  for(const file of walk(root))assert.doesNotMatch(path.relative(root,file),/preview\.jpg|sources\.json|README|VERIFICATION|\.env|research-report/);
});
test('agent profile links resolve and remain absolute when fetched as plain text',()=>{
  for(const file of walk(root).filter(p=>/\.(md|txt)$/.test(p))){
    for(const match of read(path.relative(root,file).replace(/^client\//,'')).matchAll(/\]\(([^)\s]+)\)/g)){
      const link=match[1];
      if(link.startsWith('#')||link.startsWith('mailto:'))continue;
      assert.match(link,/^https?:\/\//);
      const url=new URL(link);
      if(url.origin===config.origin)assert.ok(localFile(url),`${file}: ${link}`);
    }
  }
});
test('live Worker serves redirects, UTF-8 text, HEAD and genuine 404 responses',async()=>{
  const worker=(await import('../dist/server/index.js')).default;
  for(const [url,status] of [['/about',301],['/ai',301],['/projects.html',301],['/not-a-real-page',404],['/llms.txt',200],['/projects',200]]){
    const response=await worker.fetch(new Request(config.origin+url));
    assert.equal(response.status,status,url);
    if(status===200){assert.match(response.headers.get('Content-Type'),/charset=utf-8/);assert.equal(response.headers.get('Cache-Control'),'public, max-age=0, must-revalidate');}
  }
  assert.equal(await (await worker.fetch(new Request(config.origin+'/',{method:'HEAD'}))).text(),'');
  assert.equal((await worker.fetch(new Request(config.origin+'/',{method:'POST'}))).status,405);

  assert.match(read('404.html'),/noindex/);
  assert.equal((await worker.fetch(new Request('https://www.itstyleryip.com/projects'))).headers.get('Location'),'https://itstyleryip.com/projects');
  const asset=await worker.fetch(new Request(config.origin+'/assets/optimized/test.webp'),{ASSETS:{fetch:async()=>new Response('image',{status:200})}});
  assert.equal(asset.headers.get('Cache-Control'),'public, max-age=31536000, immutable');
});
