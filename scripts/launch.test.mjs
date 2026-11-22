import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import sharp from 'sharp';
import {pages, origin, publicationDate} from './page-metadata.mjs';
const root=path.resolve(import.meta.dirname,'../dist');
const config=JSON.parse(fs.readFileSync(path.resolve(root,'../launch-data.json'),'utf8'));
const shareImages=JSON.parse(fs.readFileSync(path.resolve(root,'../share-images.json'),'utf8'));
const physicalWalk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?physicalWalk(path.join(d,e.name)):[path.join(d,e.name)]);
const documents=JSON.parse(fs.readFileSync(path.resolve(root,'../generated-documents.json'),'utf8'));
const walk=()=>Object.keys(documents).map(p=>path.join(root,p.slice(1))).concat(physicalWalk(path.join(root,'client')));
const read=p=>documents['/'+p]??fs.readFileSync(path.join(root,'client',p),'utf8');
const exists=p=>{const rel=path.relative(root,p);return ('/'+rel) in documents||fs.existsSync(path.join(root,'client',rel));};
const context=vm.createContext({});
for(const f of ['projects.js','interviews.js','writing.js'])vm.runInContext(read(f),context);
const data=vm.runInContext('({projects,interviewArchive,writingArchive})',context);
test('release identity is served as revalidating JSON and stays out of search',async()=>{
  const release=JSON.parse(read('version.json'));
  const pkg=JSON.parse(fs.readFileSync(path.resolve(root,'../package.json')));
  assert.equal(release.version,pkg.version);
  assert.match(release.commit,/^[a-f0-9]{40}$/);
  assert.equal(typeof release.dirty,'boolean');
  const worker=(await import('../dist/server/index.js')).default;
  const response=await worker.fetch(new Request(origin+'/version.json'));
  assert.equal(response.status,200);
  assert.equal(response.headers.get('Content-Type'),'application/json; charset=utf-8');
  assert.equal(response.headers.get('Cache-Control'),'public, max-age=0, must-revalidate');
  assert.equal(response.headers.get('X-Robots-Tag'),'noindex');
  assert.deepEqual(await response.json(),release);
  assert.ok(!read('sitemap.xml').includes('version.json'));
});
function localFile(url) {
  let p=decodeURIComponent(url.pathname).replace(/^\//,'');
  if(!p)p='index.html';
  const possibilities=[p,p+'.html',path.join(p,'index.html')];
  return possibilities.map(p=>path.join(root,p)).find(p=>exists(p));
}
test('theme starts dark and respects a saved choice, including when storage is unavailable',()=>{
  const init=read('theme-init.js');
  for(const systemDark of [false,true]){
    for(const saved of [null,'light','dark','invalid','blocked']){
      const document={documentElement:{dataset:{}}};
      const localStorage={getItem(){if(saved==='blocked')throw new Error('Storage unavailable');return saved;}};
      vm.runInNewContext(init,{document,localStorage,matchMedia:()=>({matches:systemDark})});
      assert.equal(document.documentElement.dataset.theme,saved==='light'?'light':'dark');
      assert.equal(document.documentElement.dataset.js,'');
    }
  }
  for(const file of walk(root).filter(p=>p.endsWith('.html'))){
    const html=read(path.relative(root,file).replace(/^client\//,''));
    if(html.includes('data-design="combined"')){
      assert.match(html,/<html\b[^>]*data-theme="dark"/);
      assert.doesNotMatch(html,/<script\b[^>]*src="[^"]*cursor\.js/);
      assert.ok(html.includes('<script>'+init+'</script>'));
      assert.doesNotMatch(html,/<script\b[^>]*src="[^"\n]*theme-init/);
    }
  }
});
test('production HTML contains the collections and no-script project stories without rebuilding them',()=>{
  for(const page of pages.filter(page=>!page.noindex))for(const file of page.files){
    const html=read(file);
    assert.match(html,/<body\b[^>]*data-prerendered/);
    assert.equal((html.match(/class="combined-sidebar"/g)||[]).length,1);
    if(page.route!=='/projects')assert.doesNotMatch(html,/<script\b[^>]*src="\/?(?:projects|interviews|writing)\.js/);
  }
  assert.equal((read('interviews.html').match(/class="interview-record"/g)||[]).length,85);
  assert.equal((read('writing.html').match(/class="writing-entry"/g)||[]).length,21);
  const html=read('projects.html'),fallback=[...html.matchAll(/<noscript>[\s\S]*?<\/noscript>/g)].map(m=>m[0]).find(block=>block.includes('class="project-text-fallback"'));
  assert.ok(fallback);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for(const project of data.projects){
    assert.ok(html.includes(`href="#story-${project.id}"`));
    assert.ok(fallback.includes(`id="story-${project.id}"`));
    for(const paragraph of [...project.story,...(project.eventStory||[]),...(project.outcomes||[]),...(project.measurement?.notes||[]),...(project.workflows||[]).flatMap(w=>w.paragraphs)])assert.ok(fallback.includes(escape(paragraph)),project.id);
  }
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1])['@graph'];
  for(const item of schema.find(node=>node['@type']==='ItemList').itemListElement){
    assert.ok(html.includes(`id="${new URL(item.url).hash.slice(1)}"`));
  }
});
test('responsive previews are generated separately from full-size galleries',()=>{
  const html=read('projects.html'),strips=[...html.matchAll(/<div class="(?:project-preview-strip|huddle-preview)">([\s\S]*?)<\/div>/g)];
  assert.equal(strips.length,16);
  for(const strip of strips)for(const img of strip[1].matchAll(/<img\b[^>]*>/g)){
    assert.match(img[0],/srcset="[^"]+ \d+w, [^"]+ \d+w"/);
    for(const src of img[0].matchAll(/(?:src="|, )([^" ]+\.webp)/g))assert.ok(localFile(new URL(src[1],origin+'/')));
    assert.match(img[0],/sizes="[^"]+"/);
  }
  assert.match(strips[0][1],/loading="eager" fetchpriority="high"/);
  assert.doesNotMatch(strips[0][1],/loading="lazy"/);
  assert.match(read('index.html'),/srcset="[^"]+ 256w, [^"]+ 384w, assets\/tyler-mascot-v1.webp 585w"/);
  for(const project of data.projects)for(const shot of [...(project.previewImages||[]),...(project.screenshots||[])])assert.doesNotMatch(shot.src,/preview-[a-f0-9]{12}-(?:320|640)\.webp/);
});
test('all responsive image candidates exist at their declared widths',async()=>{
  const checked=new Set();
  for(const page of pages)for(const file of page.files)for(const match of read(file).matchAll(/<img\b[^>]*srcset="([^"]+)"/g)){
    for(const candidate of match[1].split(',').map(value=>value.trim())){
      if(checked.has(candidate))continue;checked.add(candidate);
      const [source,width]=candidate.split(/\s+/),imageFile=localFile(new URL(source,origin+'/'));
      assert.ok(imageFile,candidate);
      const relative=path.relative(root,imageFile),actual=await sharp(path.join(root,'client',relative)).metadata();
      assert.equal(actual.width,Number(width.slice(0,-1)),candidate);
    }
  }
  assert.ok(checked.size>200);
});
test('fingerprinted text assets cache safely, conditional requests revalidate, public previews stay out of search',async()=>{
  const worker=(await import('../dist/server/index.js')).default;
  for(const page of pages.filter(page=>!page.noindex))for(const file of page.files){
    const html=read(file);
    assert.equal((html.match(/rel="stylesheet"/g)||[]).length,1);
    assert.match(html,/href="\/site\.css\?v=[a-f0-9]{12}"/);
    const assets=[...html.matchAll(/(?:src|href)="(\/[^"?]+\.(?:js|css)\?v=[a-f0-9]{12})"/g)].map(m=>m[1]);
    for(const asset of assets){
      const response=await worker.fetch(new Request(origin+asset));
      assert.equal(response.status,200);
      assert.equal(response.headers.get('Cache-Control'),'public, max-age=31536000, immutable',asset);
      const cached=await worker.fetch(new Request(origin+asset,{headers:{'If-None-Match':response.headers.get('ETag')}}));
      assert.equal(cached.status,304);assert.equal(await cached.text(),'');
      const changed=await worker.fetch(new Request(origin+asset,{headers:{'If-None-Match':'W/"old-version"'}}));
      assert.equal(changed.status,200);
    }
  }
  for(const url of ['/site.css','/site.css?v=outdated','/']){
    const response=await worker.fetch(new Request(origin+url));
    assert.equal(response.headers.get('Cache-Control'),'public, max-age=0, must-revalidate');
  }
  for(const host of ['preview.workers.dev','example-preview.pages.dev']){
    const response=await worker.fetch(new Request('https://'+host+'/projects'));
    assert.equal(response.headers.get('X-Robots-Tag'),'noindex, follow');
  }
  assert.equal((await worker.fetch(new Request(origin+'/projects'))).headers.get('X-Robots-Tag'),null);
});
test('every page has accurate metadata, structured data and its own valid sharing image',()=>{
  const htmlPages=walk(root).filter(p=>p.endsWith('.html')&&!p.endsWith('/404.html'));
  assert.equal(htmlPages.length,pages.flatMap(page=>page.files).length);
  const descriptions=new Set(),images=new Set();
  for(const page of pages){
    assert.ok(!descriptions.has(page.description),'Duplicate description: '+page.route);
    descriptions.add(page.description);
    assert.ok(page.description.length>=80 && page.description.length<=170,'Description needs a clear summary: '+page.route);
    assert.doesNotMatch(page.description,/—/);
    const shareImage=shareImages[page.route];
    assert.ok(shareImage,'Missing image: '+page.route);
    assert.ok(!images.has(shareImage.file),'Shared image reused: '+page.route);
    images.add(shareImage.file);
    for(const file of page.files){
    const html=read(file);
    const escaped=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    assert.ok(html.includes(`<title>${escaped(page.title)}</title>`));
    assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
    assert.ok(html.includes(`<link rel="canonical" href="${origin+page.route}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin+page.route}">`));
    assert.equal((html.match(/name="description"/g)||[]).length,1);
    assert.ok(html.includes(`<meta name="description" content="${escaped(page.description)}">`));
    assert.ok(html.includes(`<meta property="og:description" content="${escaped(page.description)}">`));
    assert.ok(html.includes(`<meta name="twitter:description" content="${escaped(page.description)}">`));
    assert.match(html,/name="robots" content="(?:noindex,follow|index,follow,max-image-preview:large)"/);
    if(!page.noindex)assert.doesNotMatch(html,/noindex|localhost|127\.0\.0\.1/);
    assert.equal((html.match(/property="og:image"/g)||[]).length,1);
    assert.ok(html.includes(`<meta property="og:image" content="${config.origin}/${shareImage.file}">`));
    assert.ok(html.includes(`<meta property="og:image:width" content="${shareImage.width}">`));
    assert.ok(html.includes(`<meta property="og:image:height" content="${shareImage.height}">`));
    assert.match(html,/<meta property="og:image:type" content="image\/png">/);
    assert.match(html,/<meta property="og:image:alt" content="[^"]+">/);
    assert.equal((html.match(/name="twitter:card"/g)||[]).length,1);
    assert.match(html,/<meta name="twitter:card" content="summary_large_image">/);
    assert.ok(html.includes(`<meta name="twitter:image" content="${config.origin}/${shareImage.file}">`));
    assert.match(html,/<meta name="twitter:image:alt" content="[^"]+">/);
    if(!page.noindex)assert.equal((html.match(/<h1\b/g)||[]).length,1);
    const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1])['@graph'];
    assert.equal(new Set(graph.map(node=>node['@id'])).size,graph.length);
    const webpage=graph.find(node=>node.url===origin+page.route && ['ProfilePage','CollectionPage','WebPage'].includes(node['@type']));
    assert.equal(webpage.description,page.description);
    assert.equal(graph.find(node=>node['@type']==='Person').name,'Tyler Yip');
    if(page.article){
      const article=graph.find(node=>node['@type']==='BlogPosting');
      assert.equal(article.headline,page.article.title);
      assert.equal(article.datePublished,page.article.date);
      assert.equal(article.description,page.description);
      assert.ok(html.includes(`<time datetime="${page.article.date}">`));
      const dateLabel=new Date(page.article.date).toLocaleDateString('en-US',{timeZone:'America/Vancouver',year:'numeric',month:'short',day:'numeric'});
      assert.ok(html.includes(`<time datetime="${page.article.date}">${dateLabel}</time>`));
      assert.ok(read(page.markdown).includes(`By Tyler Yip · ${publicationDate(page.article.date)}`));
      assert.ok(html.includes('class="article-body"'));
      for(const url of article.image||[])assert.ok(localFile(new URL(url)),'Missing article image: '+url);
    }
    for(const img of html.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/\balt="[^"]*"/);
    }
    const image=fs.readFileSync(path.join(root,'client',shareImage.file));
    assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(image.readUInt32BE(16),shareImage.width);
    assert.equal(image.readUInt32BE(20),shareImage.height);
    assert.ok(shareImage.width>=1200 && shareImage.height>=627);
    assert.ok(Math.abs(shareImage.width/shareImage.height-1.91)<.01);
    assert.ok(image.length<5*1024*1024);
  }
  assert.equal((read('sitemap.xml').match(/<loc>/g)||[]).length,pages.filter(page=>!page.noindex).length);
  assert.ok(!read('sitemap.xml').includes('huddledex-browser'));
  assert.match(read('robots.txt'),/Allow: \//);
});
test('every compiled page uses the current TY favicon with real small-size assets',()=>{
  for(const page of pages)for(const file of page.files){
    const html=read(file);
    for(const size of [16,32])assert.ok(html.includes(`sizes="${size}x${size}" href="/assets/tyler-mark-v7-${size}.png"`),file);
    assert.ok(html.includes('href="/assets/tyler-mark-v7-180.png"'),file);
    assert.ok(html.includes('href="/assets/favicon-v7.ico"'),file);
    assert.doesNotMatch(html,/tyler-mark-v[12]-/);
  }
  for(const size of [16,32,48,180,192,512]){
    const bytes=fs.readFileSync(path.join(root,'client/assets',`tyler-mark-v7-${size}.png`));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);
  }
  const ico=fs.readFileSync(path.join(root,'client/assets/favicon.ico'));
  assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
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
  assert.equal(data.projects.length,16);
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
  const normalize=text=>text.replace(/[^\p{L}\p{N}%$]+/gu,' ').trim().toLowerCase();
  for(const file of ['projects.md','llms.txt','llms-full.txt']){
    const content=normalize(read(file));
    for(const project of data.projects){
      const copy=[project.title,project.desc,...(project.results||[]).map(result=>`${result.value} ${result.label}`),...project.story,...(project.eventStory||[]),...(project.outcomes||[]),...(project.measurement?.notes||[]),...(project.workflows||[]).flatMap(workflow=>[workflow.title,...workflow.paragraphs])];
      for(const text of copy)assert.ok(content.includes(normalize(text)),`${file} is missing current ${project.id} content: ${text.slice(0,70)}`);
    }
  }
  const plain=text=>text.replace(/<[^>]*>/g,' ').replace(/&(amp|lt|gt|quot|apos|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'"}[name]));
  const about=read('home.html').split('<section class="about-hero"')[1].split('<section class="about-links"')[0];
  const aboutCopy=[...about.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map(match=>plain(match[1]));
  assert.ok(aboutCopy.length>0);
  for(const file of ['home.md','llms.txt','llms-full.txt'])for(const paragraph of aboutCopy)assert.ok(normalize(read(file)).includes(normalize(paragraph)),`${file} is missing current About copy`);
  const work=read('work.html').split('<section class="cv-section"').slice(1).join('<section class="cv-section"');
  const workCopy=[...work.matchAll(/<(?:li|dd|dt|h3)\b[^>]*>([\s\S]*?)<\/(?:li|dd|dt|h3)>/g),...work.matchAll(/<div class="role-line">([\s\S]*?)<\/div>/g)].map(match=>plain(match[1]));
  assert.ok(workCopy.length>0);
  for(const file of ['work.md','llms.txt','llms-full.txt'])for(const item of workCopy)assert.ok(normalize(read(file)).includes(normalize(item)),`${file} is missing current Work copy: ${item.slice(0,70)}`);
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
test('published workflow estimates reconcile with disclosed baselines and the cost comparator',()=>{
  for(const [id,before,after,percent]of [['image',5,2,60],['newsletter',15,5,67],['slides-converter',10,2,80]]){
    const project=data.projects.find(p=>p.id===id),measurement=project.measurement;
    assert.equal(measurement.kind,'time');assert.equal(measurement.beforeMinutes,before);assert.equal(measurement.afterMinutes,after);
    assert.equal(Math.round(100*(before-after)/before),percent);
    assert.equal(project.results[0].value,`${percent}%`);
    assert.ok(measurement.scope);assert.ok(measurement.notes.some(note=>/estimate/i.test(note)));
    assert.ok(project.outcomes.some(text=>text.includes(`${percent}%`)));
  }
  const tone=data.projects.find(p=>p.id==='tone'),comparison=tone.measurement;
  assert.equal(comparison.currency,'CAD');assert.equal(comparison.months,12);
  assert.equal(Math.round(comparison.monthlyPrice*comparison.months*100),19188);
  assert.equal(tone.results[0].value,'~C$192/year');
  assert.equal(new URL(comparison.sourceUrl).hostname,'www.adobe.com');
  assert.ok(comparison.notes.some(note=>note.includes('before tax')&&note.includes('billed monthly')));
  assert.ok(comparison.notes.some(note=>note.includes('not a subscription I previously paid for')));
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
  for(const page of pages){
    const response=await worker.fetch(new Request(origin+page.route));
    assert.equal(response.status,200,page.route);
    assert.match(response.headers.get('Link'),/llms\.txt/);
    if(page.markdown){
      assert.ok(response.headers.get('Link').includes(origin+'/'+page.markdown));
      const markdown=await worker.fetch(new Request(origin+'/'+page.markdown));
      assert.equal(markdown.status,200);
      assert.match(markdown.headers.get('Content-Type'),/^text\/markdown; charset=utf-8/);
      assert.equal(markdown.headers.get('X-Robots-Tag'),'noindex');
      assert.ok(markdown.headers.get('Link').includes('<'+origin+page.route+'>; rel="canonical"'));
    }
  }
  const sitemap=await worker.fetch(new Request(origin+'/sitemap.xml'));
  for(const loc of (await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g))assert.equal((await worker.fetch(new Request(loc[1]))).status,200,loc[1]);
});

test('project readers use real responsive assets and lightweight thumbnails throughout',async()=>{
 const checked=new Set();let count=0;
 for(const project of data.projects)for(const shot of [...(project.previewImages||[]),...(project.screenshots||[]),...(project.gallery||[])]){
  assert.ok(shot.variants?.length);assert.ok(shot.displaySrc);count++;
  for(const candidate of shot.variants){
   if(checked.has(candidate.src))continue;checked.add(candidate.src);
   const file=path.join(root,'client/assets',candidate.src),bytes=fs.readFileSync(file),meta=await sharp(bytes).metadata();
   assert.equal(meta.width,candidate.width);assert.match(candidate.src,/gallery-[a-f0-9]{12}-\d+\.webp$/);
   assert.ok(bytes.length<350000,'Oversized reader image: '+candidate.src);
  }
  assert.ok(fs.statSync(path.join(root,'client/assets',shot.thumb)).size<8000,'Oversized gallery thumbnail');
 }
 assert.equal(count,56);
});

test('the token page has static figures, a served aggregate dataset, and no extra scripts on other pages',async()=>{
 const worker=(await import('../dist/server/index.js')).default,response=await worker.fetch(new Request(origin+'/data/token-usage.json'));
 assert.equal(response.status,200);assert.equal(response.headers.get('Content-Type'),'application/json; charset=utf-8');assert.equal(response.headers.get('X-Robots-Tag'),'noindex');
 const snapshot=await response.json(),total=snapshot.summary.lifetimeTokens,html=read('tokens.html');
 assert.ok(html.includes('<h1>Token Usage</h1>'));assert.ok(html.includes('<title>Token Usage | Tyler Yip</title>'));
 assert.ok(html.includes(new Intl.NumberFormat('en-CA').format(total)));assert.ok(html.includes('class="token-calendar"'));assert.ok(html.includes('class="token-cumulative"'));assert.ok(html.includes('class="token-month-chart"'));assert.ok(html.includes('By weekday'));assert.doesNotMatch(html,/<details\b|token-source-controls|Read the daily figures|token-method|recorded tokens|—/i);assert.ok(html.includes('I also use Codex, Claude, and Glean at work, which isn’t included here.'));assert.deepEqual(snapshot.scope,{account:'personal',excludesWork:true,historicalChatGPTCoverage:'not verified'});assert.ok(read('tokens.md').includes(new Intl.NumberFormat('en-CA').format(total)));
 for(const file of ['index.html','projects.html','writing.html','work.html','interviews.html'])assert.doesNotMatch(read(file),/<script\b[^>]*src="[^"\n]*(?:token-view|token-usage-data|tokens)\.js/);
});

test('dense rainbow tiles retain clearance at every rotation and stay within the scene',()=>{
 const context=vm.createContext({document:{querySelector:()=>null}});
 vm.runInContext(fs.readFileSync(new URL('../src/rainbow.js',import.meta.url),'utf8'),context);
 for(const [width,height] of [[400,225],[340,200],[300,175],[271,175]]){
  context.width=width;context.height=height;
  const tiles=vm.runInContext('createRainbowTiles(width,height)',context);
  assert.equal(tiles.length,115);
  for(const a of tiles){
   const radius=(a.length+a.stroke)/2;
   assert.ok(a.x-radius>=0&&a.x+radius<=width&&a.y-radius>=0&&a.y+radius<=height,'A rotating tile would clip at the scene edge');
   context.piece=a;
   for(let n=0;n<180;n++){
    const angle=n*Math.PI/180;context.angle=angle;
    const half=vm.runInContext('rainbowHalfLength(piece,angle)',context);
    assert.ok(half>=0&&half<=a.length/2);
    // Each complete capsule stays on its side of every shared cell boundary.
    // Both adjacent capsules leave half the gap, even at different rotations.
    for(const edge of a.neighbors){
     const reach=half*Math.abs(Math.cos(angle)*edge.nx+Math.sin(angle)*edge.ny)+a.stroke/2;
     assert.ok(reach<=(edge.distance-a.gap)/2+1e-9,'Rotating capsules can cross their clearance boundary');
    }
   }
  }
 }
});

test('cursor influence fades continuously and returns to zero away from the tile field',()=>{
 const context=vm.createContext({document:{querySelector:()=>null}});
 vm.runInContext(fs.readFileSync(new URL('../src/rainbow.js',import.meta.url),'utf8'),context);
 context.tiles=vm.runInContext('createRainbowTiles(400,225)',context);
 context.left=context.tiles.reduce((a,b)=>a.x<b.x?a:b);
 assert.equal(vm.runInContext('rainbowInfluence(left.x-15,left.y,tiles,400,225)',context),1);
 assert.ok(Math.abs(vm.runInContext('rainbowInfluence(left.x-64,left.y,tiles,400,225)',context)-.5)<1e-9);
 assert.equal(vm.runInContext('rainbowInfluence(left.x-120,left.y,tiles,400,225)',context),0);
});

test('magnetic tile springs take the short axis rotation and settle without perpetual animation',()=>{
 const context=vm.createContext({document:{querySelector:()=>null}});
 vm.runInContext(fs.readFileSync(new URL('../src/rainbow.js',import.meta.url),'utf8'),context);
 for(const [start,target] of [[Math.PI*.49,-Math.PI*.49],[0,Math.PI],[0,Math.PI/3]]){
  context.piece={angle:start,velocity:0};context.target=target;
  vm.runInContext('for(let n=0;n<180;n++)stepRainbowAngle(piece,target,1/120)',context);
  assert.ok(Math.abs(vm.runInContext('rainbowAxisTurn(target-piece.angle)',context))<.001);
  assert.ok(Math.abs(context.piece.velocity)<.003);
  assert.ok(Math.abs(context.piece.angle-start)<=Math.PI/2+.01,'A tile took a long rotation across its equivalent line axis');
 }
});
