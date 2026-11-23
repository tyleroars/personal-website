import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {transformSync} from 'esbuild';

const digest=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);

// Use the existing page template at build time; browsers retain that initial HTML.
export function pageRenderer(root){
  const source=fs.readFileSync(path.join(root,'src/site.js'),'utf8');
  const end=source.indexOf('\nconst dialog=');
  if(end<0)throw new Error('Missing static-page rendering boundary');
  const template=source.slice(0,end);
  const data=['projects.js','interviews.js','writing.js','token-usage-data.js','token-view.js'].map(name=>fs.readFileSync(path.join(root,'src',name),'utf8')).join('\n');
  return (html,page)=>{
    if(!/<body\b[^>]*data-design="combined"/.test(html))return html;
    const article=html.match(/<article\b[^>]*class="writing-article"[\s\S]*?<\/article>/)?.[0];
    if(page.article&&!article)throw new Error('Missing source article: '+page.route);
    const main={innerHTML:''};
    const context=vm.createContext({document:{body:{dataset:{page:page.article?'writing-article':page.route==='/'?'about':page.route.slice(1)},hasAttribute:()=>false},querySelector(selector){
      if(selector==='main')return main;
      if(selector==='.writing-article')return {outerHTML:article};
      throw new Error('Unexpected template DOM dependency: '+selector);
    }}});
    vm.runInContext(data,context);vm.runInContext(template,context);
    let rendered=main.innerHTML;
    if(page.route==='/projects'){
      const projects=vm.runInContext('projects',context);
      // A real text fallback, including usable title links, when JavaScript is off.
      rendered=rendered.replace(/(<button\b[^>]*data-project="([^"]+)"[^>]*>[\s\S]*?<\/button>)/g,(button,_,id)=>{
        const p=projects.find(p=>p.id===id);return button+`<noscript><a href="#story-${escape(id)}">${escape(p.title)} →</a></noscript>`;
      });
      const fallback='<noscript><style>.page-projects .project-title-action{display:none}.project-text-fallback{font-size:16px;line-height:1.8}.project-text-fallback>section{margin-top:32px;padding-top:24px;border-top:1px solid var(--line)}</style><section class="project-text-fallback" aria-label="Project stories">'+projects.map(p=>`<section id="story-${escape(p.id)}"><h2>${escape(p.title)}</h2>${[...p.story,...(p.eventStory||[])].map(t=>`<p>${escape(t)}</p>`).join('')}${p.outcomes?.length?'<h3>Outcomes</h3><ul>'+p.outcomes.map(t=>`<li>${escape(t)}</li>`).join('')+'</ul>':''}${p.measurement?`<h3>${p.measurement.kind==='cost'?'Cost comparison':'Time-saving estimate'}</h3>${p.measurement.notes.map(note=>`<p>${escape(note)}</p>`).join('')}${p.measurement.sourceUrl?`<p><a href="${escape(p.measurement.sourceUrl)}">${escape(p.measurement.sourceLabel)}</a></p>`:''}`:''}${(p.workflows||[]).map(w=>`<h3>${escape(w.title)}</h3>${w.paragraphs.map(t=>`<p>${escape(t)}</p>`).join('')}`).join('')}${p.url?`<p><a href="${escape(p.url)}">${escape(p.urlLabel||'Visit the site')}</a></p>`:''}${p.codeUrl?`<p><a href="${escape(p.codeUrl)}">${escape(p.codeLabel||'View code on GitHub')}</a></p>`:''}${p.accessNote?`<p>${escape(p.accessNote)}</p>`:''}</section>`).join('')+'</section></noscript>';
      rendered=rendered.replace('<footer class="site-footer">',fallback+'<footer class="site-footer">');
    }
    html=html.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/,(_,open,close)=>open+rendered+close);
    html=html.replace(/<body\b/,'<body data-prerendered');
    const removable=page.route==='/projects'?[]:['projects.js','interviews.js','writing.js'];
    html=html.replace(/<script\b[^>]*src="([^"?]+)(?:\?[^"]*)?"[^>]*><\/script>/g,(tag,file)=>removable.some(name=>file.endsWith(name))?'':tag);
    return html;
  };
}

export async function productionMedia(root,dist){
  const context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'src/projects.js'),'utf8'),context);
  const projects=vm.runInContext('projects',context),previews=new Map();
  fs.mkdirSync(path.join(dist,'assets/optimized'),{recursive:true});
  async function resized(relative,width,quality=84){
    const input=path.join(root,'src/assets',relative),bytes=fs.readFileSync(input);
    const name=`optimized/preview-${digest(Buffer.concat([bytes,Buffer.from(String(width)+'-'+quality)]))}-${width}.webp`;
    await sharp(bytes).resize({width,withoutEnlargement:true}).webp({quality}).toFile(path.join(dist,'assets',name));
    return 'assets/'+name;
  }
  for(const p of projects){
    const images=p.id==='huddle'?[p.screenshots[1],p.screenshots[4],p.screenshots[6]]:(p.previewImages||[]).slice(0,1);
    for(const image of images)if(!previews.has('assets/'+image.src)){
      const {width}=await sharp(path.join(root,'src/assets',image.src)).metadata();
      const smallWidth=Math.min(320,width),largeWidth=Math.min(640,width),retinaWidth=Math.min(960,width);
      previews.set('assets/'+image.src,{small:await resized(image.src,smallWidth),large:await resized(image.src,largeWidth),smallWidth,largeWidth,retina:await resized(image.src,retinaWidth),retinaWidth});
    }
  }
  // Readers and project rows have their own responsive media sizes;
  // full gallery originals are not needed for list previews.
  const galleryMedia=new Map();
  for(const p of projects)for(const group of ['screenshots','previewImages','gallery'])for(const shot of p[group]||[]){
    const key=shot.src+'|'+(shot.cropHeight||'');
    if(!galleryMedia.has(key)){
      const input=path.join(root,'src/assets',shot.src),meta=await sharp(input).metadata();
      const photo=group==='gallery'||(p.id==='hackathon'&&/team|present|event/i.test(shot.alt||''));
      const variants=[];
      for(const width of [...new Set([480,960,1600].map(w=>Math.min(w,meta.width)))]){
        let image=sharp(input);
        if(shot.cropHeight)image=image.extract({left:0,top:0,width:meta.width,height:Math.min(shot.cropHeight,meta.height)});
        const bytes=await image.resize({width,withoutEnlargement:true}).webp({quality:photo?76:86,effort:4}).toBuffer();
        const src=`optimized/gallery-${digest(bytes)}-${width}.webp`;fs.writeFileSync(path.join(dist,'assets',src),bytes);variants.push({src,width});
      }
      const thumbInput=path.join(root,'src/assets',shot.thumb||shot.src);
      const bytes=await sharp(thumbInput).resize({width:112,height:96,fit:'inside',withoutEnlargement:true}).webp({quality:72}).toBuffer();
      const thumb=`optimized/gallery-thumb-${digest(bytes)}.webp`;fs.writeFileSync(path.join(dist,'assets',thumb),bytes);
      galleryMedia.set(key,{variants,displaySrc:variants[Math.min(1,variants.length-1)].src,thumb});
    }
    Object.assign(shot,galleryMedia.get(key));
  }
  // Only the compiled public dataset changes; narrative source and originals stay intact.
  fs.writeFileSync(path.join(dist,'projects.js'),'const projects='+JSON.stringify(projects)+';\n');
  const portrait={small:await resized('optimized/1372408ed4e1.webp',80,86),large:await resized('optimized/1372408ed4e1.webp',160,86)};
  const portraits=new Map();
  vm.runInContext(fs.readFileSync(path.join(root,'src/interviews.js'),'utf8'),context);
  for(const guest of vm.runInContext('interviewArchive',context))if(!portraits.has('assets/'+guest.image)){
    const {width}=await sharp(path.join(root,'src/assets',guest.image)).metadata();
    const smallWidth=Math.min(80,width),largeWidth=Math.min(160,width);
    portraits.set('assets/'+guest.image,{small:await resized(guest.image,smallWidth,84),large:await resized(guest.image,largeWidth,84),smallWidth,largeWidth});
  }
  const articleImages=new Map();
  for(const file of walk(path.join(root,'src/writing')).filter(file=>file.endsWith('.html'))){
    for(const match of fs.readFileSync(file,'utf8').matchAll(/<img\b[^>]*src="assets\/writing\/([^"]+)"/g)){
      const relative='writing/'+match[1],src='assets/'+relative;if(articleImages.has(src))continue;
      const {width}=await sharp(path.join(root,'src/assets',relative)).metadata();
      const widths=[...new Set([Math.min(480,width),Math.min(960,width),Math.min(1600,width)])];
      const variants=[];for(const size of widths)variants.push({width:size,src:await resized(relative,size,86)});
      articleImages.set(src,variants);
    }
  }
  return html=>{
    let stripIndex=0;
    html=html.replace(/(<div class="(?:project-preview-strip|huddle-preview)">)([\s\S]*?)(<\/div>)/g,(_,open,body,close)=>{
      let imageIndex=0;const currentStrip=stripIndex++;
      body=body.replace(/<img\b[^>]*>/g,tag=>{
        const src=tag.match(/\bsrc="([^"]+)"/)?.[1],image=previews.get(src);if(!image)return tag;
        const huddle=open.includes('huddle-preview');
        const sizes=huddle?'(max-width:408px) calc((100vw - 64px) / 3), 115px':'(max-width:408px) calc(100vw - 48px), 360px';
        const variants=[...new Map([[image.smallWidth,image.small],[image.largeWidth,image.large],[image.retinaWidth,image.retina]]).entries()].map(([w,url])=>`${url} ${w}w`).join(', ');
        tag=tag.replace(`src="${src}"`,`src="${image.small}" srcset="${variants}" sizes="${sizes}"`);
        if(currentStrip===0)tag=tag.replace('loading="lazy"',`loading="eager"${imageIndex===0?' fetchpriority="high"':''}`);
        imageIndex++;return tag;
      });return open+body+close;
    });
    html=html.replace(/<img\b[^>]*src="assets\/optimized\/1372408ed4e1.webp"[^>]*>/g,tag=>tag.replace('src="assets/optimized/1372408ed4e1.webp"',`src="${portrait.large}" srcset="${portrait.small} 80w, ${portrait.large} 160w" sizes="(max-width:640px) 37px, 56px"`));
    return html.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/g,(tag,src)=>{
      const image=portraits.get(src);
      if(image)return tag.replace(`src="${src}"`,`src="${image.large}" srcset="${image.small} ${image.smallWidth}w, ${image.large} ${image.largeWidth}w" sizes="52px"`);
      const variants=articleImages.get(src);
      if(variants){const primary=variants[Math.min(1,variants.length-1)];return tag.replace(`src="${src}"`,`src="${primary.src}" srcset="${variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="(max-width:640px) calc(100vw - 48px), 732px"`);}
      return tag;
    });
  };
}

export function optimizeTextAssets(dist){
  for(const file of walk(dist).filter(p=>p.endsWith('.js'))){
    const text=fs.readFileSync(file,'utf8');fs.writeFileSync(file,transformSync(text,{loader:'js',minify:true,charset:'utf8',legalComments:'none',target:'es2022'}).code);
  }
  const css=['style.css','personal.css'].map(name=>fs.readFileSync(path.join(dist,name),'utf8')).join('\n');
  fs.writeFileSync(path.join(dist,'site.css'),transformSync(css,{loader:'css',minify:true,charset:'utf8',legalComments:'none',target:'chrome110'}).code);
}

export function fingerprintHtmlAssets(dist){
  const hashes=Object.fromEntries(walk(dist).filter(p=>/\.(css|js)$/.test(p)).map(file=>['/'+path.relative(dist,file).split(path.sep).join('/'),digest(fs.readFileSync(file))]));
  const theme=fs.readFileSync(path.join(dist,'theme-init.js'),'utf8').replaceAll('</script','<\\/script');
  for(const file of walk(dist).filter(p=>p.endsWith('.html'))){
    let html=fs.readFileSync(file,'utf8'),hasBundle=false;
    html=html.replace(/<link\b[^>]*href="\/?(?:style|personal)\.css(?:\?[^"]*)?"[^>]*>/g,()=>{
      if(hasBundle)return '';hasBundle=true;return `<link rel="stylesheet" href="/site.css?v=${hashes['/site.css']}">`;
    });
    html=html.replace(/<script\b[^>]*src="\/?theme-init\.js(?:\?[^"]*)?"[^>]*><\/script>/g,()=>'<script>'+theme+'</script>');
    html=html.replace(/(<script\b[^>]*src=")([^"?]+)(?:\?[^"]*)?("[^>]*>)/g,(tag,start,source,end)=>{
      const key='/'+source.replace(/^\//,'');return hashes[key]?start+key+'?v='+hashes[key]+end:tag;
    });fs.writeFileSync(file,html);
  }
  return hashes;
}
