import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const {origin, articles} = JSON.parse(fs.readFileSync(path.join(root, 'launch-data.json'), 'utf8'));
if (new URL(origin).protocol !== 'https:') throw new Error('Production origin must use HTTPS');
const dist = path.join(root, 'dist');
fs.rmSync(dist, {recursive:true, force:true});
fs.cpSync(path.join(root, 'src'), dist, {recursive:true});
const routes = new Map([
  ['index.html','/'], ['home.html','/'], ['projects.html','/projects'],
  ['writing.html','/writing'], ['work.html','/work'], ['interviews.html','/interviews'],
  ...articles.map(a => [`writing/${a.slug}.html`, `/writing/${a.slug}`])
]);
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const encode = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// Change internal HTML route references in HTML, JS, and public agent documents.
// Keep Markdown and external project URLs intact.
function links(text) {
  return text.replace(/(?<=["'(`\s])(?:writing\/[a-z0-9-]+\.html|(?:home|index|projects|work|interviews|writing)\.html)(?=[#?"')`\s<])/g,
    match => routes.get(match) || match).replace('writing/${E(p.slug)}.html','/writing/${E(p.slug)}');
}
for (const file of walk(dist)) {
  if (!/\.(html|js|md|txt)$/.test(file)) continue;
  let text = links(fs.readFileSync(file,'utf8'));
  if (file.endsWith('.html')) {
    const relative = path.relative(dist,file).split(path.sep).join('/');
    text = text.replace(/<base\s+href=["'][^"']*["']\s*\/?\s*>/gi, '<base href="/">');
    text = text.replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '');
    // The HuddleDex browser adaptation remains a usable demo, outside the search index.
    const isDemo = relative.startsWith('huddledex-browser/');
    const route = routes.get(relative) || '/huddledex-browser/';
    const title = text.match(/<title>(.*?)<\/title>/s)?.[1] || 'HuddleDex';
    const url = origin + route;
    const article = articles.find(a => relative === `writing/${a.slug}.html`);
    const schema = article ? {
      '@context':'https://schema.org', '@type':'BlogPosting', headline:article.title,
      description:article.subtitle, datePublished:article.date,
      author:{'@type':'Person',name:'Tyler Yip',url:origin+'/'}, mainEntityOfPage:url
    } : route === '/' ? {
      '@context':'https://schema.org', '@type':'ProfilePage', url,
      mainEntity:{'@type':'Person','@id':origin+'/#tyler-yip',name:'Tyler Yip',url,
        sameAs:['https://github.com/tyleroars','https://www.linkedin.com/in/tyleryip/']}
    } : null;
    const extra = [
      `<meta name="robots" content="${isDemo?'noindex,follow':'index,follow,max-image-preview:large'}">`,
      `<link rel="canonical" href="${encode(url)}">`,
      `<meta property="og:url" content="${encode(url)}">`,
      '<meta property="og:site_name" content="Tyler Yip">',
      `<meta property="og:image" content="${origin}/assets/optimized/1372408ed4e1.webp">`,
      '<meta property="og:image:alt" content="Tyler Yip beneath cherry blossoms">',
      `<meta name="twitter:image" content="${origin}/assets/optimized/1372408ed4e1.webp">`,
      ...(schema ? [`<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`] : [])
    ].join('');
    text = text.replace('</head>', extra+'</head>');
    if (!text.includes('<base ') && relative.startsWith('writing/')) throw new Error('Article needs root base: '+relative);
  }
  // Root-relative links in .txt/.md must also work when read without an HTML base URL.
  if (/\.(md|txt)$/.test(file)) {
    text = text.replace(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g, (_,target) => {
      const localBase = path.relative(dist,path.dirname(file)).split(path.sep).join('/')+'/';
      return `](${new URL(target,origin+'/'+(localBase==='/'?'':localBase)).href})`;
    });
  }
  fs.writeFileSync(file,text);
}
// No SPA fallback: unknown URLs must genuinely return 404.
fs.writeFileSync(path.join(dist,'404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Tyler Yip</title><link rel="stylesheet" href="/personal.css"></head><body><main style="max-width:40rem;margin:15vh auto;padding:24px"><h1>This page isn’t here.</h1><p><a href="/">Back to Tyler’s site</a></p></main></body></html>');
const unique = [...new Set(routes.values())];
fs.writeFileSync(path.join(dist,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+unique.map(route=>`  <url><loc>${origin}${route}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(dist,'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist,'_redirects'), [
  '/home.html / 301','/index.html / 301','/about / 301','/about/ / 301',
  '/ai /projects 301','/ai/ /projects 301',
  ...['projects','writing','work','interviews'].map(r=>`/${r}/ /${r} 301`),
  ...['projects','writing','work','interviews'].map(r=>`/${r}.html /${r} 301`)
].join('\n')+'\n');
fs.writeFileSync(path.join(dist,'_headers'), `/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/assets/*\n  Cache-Control: public, max-age=86400\n/assets/optimized/*\n  Cache-Control: public, max-age=31536000, immutable\n/llms.txt\n  Content-Type: text/plain; charset=utf-8\n/llms-full.txt\n  Content-Type: text/plain; charset=utf-8\n/*.md\n  Content-Type: text/markdown; charset=utf-8\n/writing/*.md\n  Content-Type: text/markdown; charset=utf-8\n`);
console.log(`Built ${unique.length} indexable routes; ${walk(dist).length} public files.`);
// Sites static hosting does not interpret _headers or _redirects. Serve public
// text through a small Worker; keep raster media and the ZIP as static assets.
const documents={};
for(const file of walk(dist)) {
  const relative=path.relative(dist,file).split(path.sep).join('/');
  if(/\.(html|js|css|txt|md|xml|svg)$/.test(file) && !relative.startsWith('assets/')) {
    documents['/'+relative]=fs.readFileSync(file,'utf8');
  }
}
const redirects=Object.fromEntries(readRedirects());
function readRedirects(){return fs.readFileSync(path.join(dist,'_redirects'),'utf8').trim().split('\n').map(line=>line.split(' ').slice(0,2));}
const generated = `const documents=${JSON.stringify(documents)};
const redirects=${JSON.stringify(redirects)};
const canonicalOrigin=${JSON.stringify(origin)};
const types={html:'text/html',js:'text/javascript',css:'text/css',txt:'text/plain',md:'text/markdown',xml:'application/xml'};
export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.hostname==='www.itstyleryip.com'||url.protocol==='http:')return Response.redirect(canonicalOrigin+url.pathname+url.search,301);
  if(url.pathname.startsWith('/assets/')||(url.pathname.startsWith('/build-prompts/')&&url.pathname.endsWith('.zip'))){
    const asset=await env.ASSETS.fetch(request);
    const headers=new Headers(asset.headers);
    headers.set('Cache-Control',asset.status===200?(url.pathname.startsWith('/assets/optimized/')?'public, max-age=31536000, immutable':'public, max-age=86400'):'public, max-age=0, must-revalidate');
    headers.set('X-Content-Type-Options','nosniff');
    return new Response(asset.body,{status:asset.status,headers});
  }
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  if(redirects[url.pathname])return Response.redirect(canonicalOrigin+redirects[url.pathname]+url.search,301);
  if(url.pathname.endsWith('.html') && url.pathname.startsWith('/writing/'))return Response.redirect(canonicalOrigin+url.pathname.slice(0,-5)+url.search,301);
  let file=url.pathname==='/'?'/index.html':url.pathname;
  if(file==='/huddledex-browser')return Response.redirect(canonicalOrigin+file+'/'+url.search,301);
  if(file==='/huddledex-browser/')file+="index.html";
  if(!(file in documents) && file+'.html' in documents)file+='.html';
  const exists=file in documents;
  const body=exists?documents[file]:documents['/404.html'];
  const type=types[file.split('.').pop()]||'text/html';
  const headers=new Headers({'Content-Type':type+'; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
  if(!exists)headers.set('X-Robots-Tag','noindex');
  return new Response(request.method==='HEAD'?null:body,{status:exists?200:404,headers});
}};
`;
const staging=path.join(root,'.production-media');
fs.rmSync(staging,{recursive:true,force:true});
fs.mkdirSync(staging,{recursive:true});
for(const file of walk(dist)) {
  const relative=path.relative(dist,file);
  if(!('/'+relative in documents) && !['_headers','_redirects'].includes(relative)) {
    fs.mkdirSync(path.dirname(path.join(staging,relative)),{recursive:true});
    fs.copyFileSync(file,path.join(staging,relative));
  }
}
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(path.join(dist,'server'),{recursive:true});
fs.renameSync(staging,path.join(dist,'client'));
fs.writeFileSync(path.join(dist,'server/index.js'),generated);
// Validation reads these generated text responses without starting a browser.
fs.writeFileSync(path.join(root,'generated-documents.json'),JSON.stringify(documents));
console.log('Worker text responses and static media packaged.');
