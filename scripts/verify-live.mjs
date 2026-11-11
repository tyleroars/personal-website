import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pages,origin,encode} from './page-metadata.mjs';

const root=path.resolve(import.meta.dirname,'..');
const expected=JSON.parse(JSON.parse(fs.readFileSync(path.join(root,'generated-documents.json')))['/version.json']);
const [version=expected.version,commit=expected.commit]=process.argv.slice(2);
const get=async route=>{
 const response=await fetch(origin+route,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,route);
 return response;
};
const live=await (await get('/version.json')).json();
assert.equal(live.version,version,'Live version');
assert.equal(live.commit,commit,'Live commit');
assert.equal(live.dirty,false,'Production must use a clean checkout');
const images=new Set();
for(const page of pages){
 const response=await get(page.route);
 if(!page.noindex)assert.equal(response.headers.get('X-Robots-Tag'),null,page.route+' must remain indexable');
 const html=await response.text();
 assert.ok(html.includes(`<link rel="canonical" href="${origin+page.route}">`),page.route+' canonical');
 assert.ok(html.includes(`<meta name="description" content="${encode(page.description)}">`),page.route+' description');
 assert.ok(html.includes(`<meta name="robots" content="${page.noindex?'noindex,follow':'index,follow,max-image-preview:large'}">`),page.route+' robots');
 const image=html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
 assert.ok(image,page.route+' sharing image');images.add(image);
}
for(const file of ['site.css','site.js','projects.js','theme-init.js','rainbow.js','llms.txt','llms-full.txt']){
 const docs=JSON.parse(fs.readFileSync(path.join(root,'generated-documents.json')));
 assert.equal(await (await get('/'+file)).text(),docs['/'+file],file+' matches release');
}
const imageList=[...images];
for(let start=0;start<imageList.length;start+=6)await Promise.all(imageList.slice(start,start+6).map(async url=>{
 const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,url);assert.match(response.headers.get('content-type'),/^image\/png/);
}));
const missing=await fetch(origin+'/release-check-not-a-page',{signal:AbortSignal.timeout(20000)});
assert.equal(missing.status,404);
const www=await fetch('https://www.itstyleryip.com/projects',{redirect:'manual',signal:AbortSignal.timeout(20000)});
assert.equal(www.status,301);assert.equal(www.headers.get('location'),origin+'/projects');
console.log(`Verified live v${version} (${commit.slice(0,7)}): ${pages.length} pages, ${images.size} sharing images, current scripts and agent profiles, www redirect and genuine 404.`);
