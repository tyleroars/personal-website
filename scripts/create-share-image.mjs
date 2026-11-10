// Optional regeneration of the checked-in social images; normal builds use the manifest.
// The approved mascot is reused unchanged, with vector-rendered typography and rainbow.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {root, pages, encode} from './page-metadata.mjs';

const mascot = (await sharp(path.join(root, 'src/assets/tyler-mascot-v1.webp')).png().toBuffer()).toString('base64');
const colors = ['#ed6583', '#f0cc59', '#54bf9c', '#8a79d4'];
const segments = [];
for (let row = 0; row < 8; row++) {
  const radius = 120 + row * 15;
  const count = Math.round(Math.PI * radius / 19);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * (.035 + .93 * i / (count - 1));
    const x = 925 - Math.cos(angle) * radius;
    const y = 442 - Math.sin(angle) * radius;
    const turn = angle - Math.PI / 2;
    const dx = Math.cos(turn) * 4, dy = Math.sin(turn) * 4;
    segments.push(`<path d="M${x-dx},${y-dy} L${x+dx},${y+dy}" stroke="${colors[Math.floor(row/2)]}"/>`);
  }
}
const artwork = `<g fill="none" stroke-width="5.5" stroke-linecap="round">${segments.join('')}</g>
  <image x="775" y="220" width="300" height="328.205" xlink:href="data:image/png;base64,${mascot}"/>`;
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
    copy=text('Hi, I’m',80,181,29,'#a4d4bc')+text('Tyler Yip',75,282,92,'#f3f5f7','font-weight="700" letter-spacing="-4"')+
      text('Projects, writing,',80,357,32,'#c8cfd8')+text('and experiments with AI.',80,404,32,'#c8cfd8');
  } else if (page.article) {
    let size=62, lines=await wrap(page.displayTitle,size,610);
    while (lines.length>4 && size>46) {size-=2;lines=await wrap(page.displayTitle,size,610);}
    if (lines.length>4) throw new Error('Article title does not fit: '+page.displayTitle);
    copy=text('Writing by Tyler Yip',80,130,28,'#a4d4bc');
    const first=lines.length===4?211:244;
    copy+=lines.map((line,i)=>text(line,77,first+i*(size*1.18),size,'#f3f5f7','font-weight="700" letter-spacing="-1"')).join('');
    const date=new Date(page.article.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Vancouver'});
    copy+=text(date,80,488,24,'#9faab7');
  } else {
    copy=text('Tyler Yip',80,181,29,'#a4d4bc')+text(page.displayTitle,75,282,84,'#f3f5f7','font-weight="700" letter-spacing="-3"');
    copy+=page.cardLines.map((line,i)=>text(line,80,357+i*47,31,'#c8cfd8')).join('');
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2400" height="1260" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#11151a"/><g font-family="Arial, Helvetica, sans-serif">${copy}${text('itstyleryip.com',80,548,24,'#a4d4bc')}</g>${artwork}</svg>`;
  const png=await sharp(Buffer.from(svg)).removeAlpha().png({compressionLevel:9}).toBuffer();
  const slug=page.route==='/'?'tyler-yip':page.route.split('/').filter(Boolean).at(-1);
  const fingerprint=createHash('sha256').update(png).digest('hex').slice(0,12);
  const file=`assets/social/${slug}-${fingerprint}.png`;
  fs.writeFileSync(path.join(root,'src',file),png);
  const alt=page.route==='/'?'Tyler Yip. Projects, writing, and experiments with AI. An illustrated Tyler sits in front of a colorful dotted rainbow. itstyleryip.com.':`${page.displayTitle}, by Tyler Yip. An illustrated Tyler and a dotted rainbow on a charcoal background.`;
  images[page.route]={file,width:2400,height:1260,type:'image/png',alt};
  const thumb=await sharp(png).resize(480,252).png().toBuffer();
  const i=thumbs.length;
  thumbs.push({input:thumb,left:(i%3)*480,top:Math.floor(i/3)*252});
  fs.writeFileSync(path.join(output,slug+'.png'),thumb);
  console.log(`${page.route}: ${(png.length/1024).toFixed(1)} KB`);
}
fs.writeFileSync(path.join(root,'share-images.json'),JSON.stringify(images,null,2)+'\n');
await sharp({create:{width:1440,height:Math.ceil(thumbs.length/3)*252,channels:3,background:'#11151a'}}).composite(thumbs).png().toFile(path.join(output,'all-sharing-cards.png'));
console.log(`Created ${pages.length} sharing images and their preview sheet.`);
