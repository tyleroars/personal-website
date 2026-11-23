// Optional regeneration of the checked-in social images; normal builds use the manifest.
// Reuse the About portrait with the two ink layers held in their separated positions.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {root, pages, encode} from './page-metadata.mjs';

const about = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
const portraitPath = about.match(/<div\b[^>]*\bdata-offset-print\b[^>]*>([\s\S]*?)<\/div>/)?.[1]
  .match(/<img\b[^>]*\bsrc="(assets\/optimized\/tyler-pixel-portrait-[a-f0-9]{12}\.webp)"/)?.[1];
if (!portraitPath) throw new Error('The share images need the current About portrait.');

const width = 2400, height = 1260;
const {data: pixels, info: portrait} = await sharp(path.join(root, 'src', portraitPath))
  .resize({width: 688, kernel: 'nearest'}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const raw = {width: portrait.width, height: portrait.height, channels: 4};
const top = Math.round((height - portrait.height) / 2);
const left = 1528;

async function inkPlate([red, green, blue], opacity, x, y) {
  const tint = Buffer.alloc(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    tint[i] = red;
    tint[i + 1] = green;
    tint[i + 2] = blue;
    tint[i + 3] = Math.round(pixels[i + 3] * opacity);
  }
  return {input: await sharp(tint, {raw}).png().toBuffer(), left: left + x, top: top + y};
}

const artwork = await Promise.all([
  inkPlate([217, 146, 119], .7, 25, -12),
  inkPlate([139, 195, 169], .75, -22, 10),
  sharp(pixels, {raw}).png().toBuffer().then(input => ({input, left, top})),
]);
const foreground = '#f3f5f7', secondary = '#c8cfd8', accent = '#abd7bf';
const portraitAlt = 'Pixel-art portrait of Tyler holding a camera, with sage and clay print layers.';
const text = (value,x,y,size,color,extra='') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${encode(value)}</text>`;
const measureCache = new Map();
async function measure(value,size) {
  const key=size+'|'+value;
  if (!measureCache.has(key)) {
    const result=await sharp({text:{text:encode(value),font:`Arial Bold ${size}`,rgba:true}}).metadata();
    measureCache.set(key,result.width);
  }
  return measureCache.get(key);
}
async function wrap(value,size,width) {
  const lines=[];let line='';
  for (const word of value.split(/\s+/)) {
    const next=line?line+' '+word:word;
    if (line && await measure(next,size)>width) {lines.push(line);line=word;} else line=next;
  }
  if (line) lines.push(line);
  return lines;
}
const output=path.join(root,'outputs/social-preview');
fs.mkdirSync(output,{recursive:true});
fs.mkdirSync(path.join(root,'src/assets/social'),{recursive:true});
const images={};
const thumbs=[];
for (const page of pages) {
  let copy='';
  if (page.route==='/') {
    copy=text('Tyler Yip',79,288,100,foreground,'font-weight="700" letter-spacing="-4"')+
      text('Projects, writing,',84,365,34,secondary)+text('and experiments with AI.',84,410,34,secondary);
  } else if (page.article) {
    let size=62, lines=await wrap(page.displayTitle,size,635);
    while (lines.length>4 && size>46) {size-=2;lines=await wrap(page.displayTitle,size,635);}
    if (lines.length>4) throw new Error('Article title does not fit: '+page.displayTitle);
    copy=text('Writing by Tyler Yip',84,134,28,accent);
    const first=lines.length===4?213:246;
    copy+=lines.map((line,i)=>text(line,82,first+i*(size*1.18),size,foreground,'font-weight="700" letter-spacing="-1"')).join('');
    const date=new Date(page.article.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Vancouver'});
    copy+=text(date,84,490,24,'#9faab7');
  } else {
    copy=text('Tyler Yip',84,184,29,accent)+text(page.displayTitle,80,284,84,foreground,'font-weight="700" letter-spacing="-3"');
    copy+=page.cardLines.map((line,i)=>text(line,84,357+i*45,31,secondary)).join('');
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#14181e"/><g font-family="Arial, Helvetica, sans-serif">${copy}${text('itstyleryip.com',84,548,25,accent)}</g></svg>`;
  const png=await sharp(Buffer.from(svg)).composite(artwork).removeAlpha()
    .png({compressionLevel:9,adaptiveFiltering:true}).toBuffer();
  const slug=page.route==='/'?'tyler-yip':page.route.split('/').filter(Boolean).at(-1);
  const fingerprint=createHash('sha256').update(png).digest('hex').slice(0,12);
  const file=`assets/social/${slug}-${fingerprint}.png`;
  fs.writeFileSync(path.join(root,'src',file),png);
  const alt=page.route==='/' ? 'Tyler Yip. Projects, writing, and experiments with AI. '+portraitAlt
    : page.displayTitle+' by Tyler Yip. '+portraitAlt;
  images[page.route]={file,width,height,type:'image/png',alt};
  if (page.route==='/') images[page.route].portrait=portraitPath;
  const thumb=await sharp(png).resize(480,252).png().toBuffer();
  const i=thumbs.length;
  thumbs.push({input:thumb,left:(i%3)*480,top:Math.floor(i/3)*252});
  fs.writeFileSync(path.join(output,slug+'.png'),thumb);
  console.log(`${page.route}: ${(png.length/1024).toFixed(1)} KB`);
}
fs.writeFileSync(path.join(root,'share-images.json'),JSON.stringify(images,null,2)+'\n');
await sharp({create:{width:1440,height:Math.ceil(thumbs.length/3)*252,channels:3,background:'#11151a'}}).composite(thumbs).png().toFile(path.join(output,'all-sharing-cards.png'));
console.log(`Created ${pages.length} sharing images and their preview sheet.`);
