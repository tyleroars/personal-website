// Original canvas art: staggered, paired tile courses and a horizontal spectrum.
// Interaction inspired by Josh W. Comeau; rendering written for this site.
function createRainbowTiles(width,height){
 const scale=Math.min(width/400,height/225),cx=width/2,cy=height-26*scale;
 const start=Math.PI*.035,span=Math.PI*.93,tiles=[];
 for(let pair=0;pair<5;pair++){
  const inner=52+pair*26,count=Math.floor(span*inner/26),step=span/count;
  for(let course=0;course<2;course++){
   const radius=(inner+course*13)*scale;
   // Alternate courses begin half a tile apart, like overlapping brick bonds.
   for(let i=0;i<count+course;i++){
    const angle=start+(i+(course?0:.5))*step;
    tiles.push({x:cx-Math.cos(angle)*radius,y:cy-Math.sin(angle)*radius,rest:angle-Math.PI/2,length:20*scale,stroke:5.4*scale,angle:angle-Math.PI/2,velocity:0,gap:1.5*scale,neighbors:[]});
   }
  }
 }
 // Cache only nearby cell boundaries. Each capsule stays within its own cell,
 // so denser rows can keep long tangents without colliding when they rotate.
 for(let i=0;i<tiles.length;i++)for(let j=i+1;j<tiles.length;j++){
  const a=tiles[i],b=tiles[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
  if(d>(a.length+a.stroke+b.length+b.stroke)/2+a.gap)continue;
  a.neighbors.push({nx:dx/d,ny:dy/d,distance:d});b.neighbors.push({nx:-dx/d,ny:-dy/d,distance:d});
 }
 return tiles;
}
function rainbowHalfLength(piece,angle=piece.angle){
 const ux=Math.cos(angle),uy=Math.sin(angle);let half=piece.length/2;
 for(const n of piece.neighbors){
  const projection=Math.abs(ux*n.nx+uy*n.ny);
  if(projection>1e-6)half=Math.min(half,(n.distance-piece.stroke-piece.gap)/(2*projection));
 }
 return Math.max(0,half);
}
function rainbowInfluence(x,y,tiles,width,height){
 const scale=Math.min(width/400,height/225);
 let distance=Infinity;for(const p of tiles)distance=Math.min(distance,Math.hypot(x-p.x,y-p.y));
 const t=Math.max(0,Math.min(1,(distance-28*scale)/(72*scale)));
 return 1-t*t*(3-2*t);
}
const rainbowAxisTurn=angle=>((angle+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;
function stepRainbowAngle(piece,target,dt){
 piece.velocity+=(rainbowAxisTurn(target-piece.angle)*720-piece.velocity*42)*dt;
 piece.angle+=piece.velocity*dt;
 return Math.abs(rainbowAxisTurn(target-piece.angle))>.001||Math.abs(piece.velocity)>.003;
}
(() => {
 const host=document.querySelector('.about-rainbow');if(!host)return;
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const palettes={dark:['#9b8bdd','#79b4cf','#69c5a4','#e5c76d','#e88c8a'],light:['#7a70c2','#4996b6','#42a783','#b4973d','#cf7075']};
 const target={x:0,y:0,weight:0};let gradients={},width=0,height=0,segments=[],raf=0,lastFrame=0,inView=false,introStart=0,introDone=false;
 let clientPoint=null;
 try{introDone=!!sessionStorage.getItem('tyler-rainbow-seen');}catch{}
 function draw(){
  if(!width)return;
  ctx.clearRect(0,0,width,height);
  const dark=document.documentElement.dataset.theme==='dark';
  ctx.fillStyle=dark?'#00000030':'#3f514713';ctx.beginPath();ctx.ellipse(width/2,height-9,width*.14,4,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=gradients[dark?'dark':'light'];ctx.lineCap='round';
  for(const piece of segments){
   const half=rainbowHalfLength(piece),dx=Math.cos(piece.angle)*half,dy=Math.sin(piece.angle)*half;
   ctx.lineWidth=piece.stroke;ctx.beginPath();ctx.moveTo(piece.x-dx,piece.y-dy);ctx.lineTo(piece.x+dx,piece.y+dy);ctx.stroke();
  }
 }
 function frame(now){
  raf=0;if(!inView||document.hidden)return;
  const dt=Math.min(lastFrame?(now-lastFrame)/1000:1/60,.032);lastFrame=now;
  if(!introDone&&!reduced.matches){
   if(!introStart)introStart=now;
   const t=Math.min(1,(now-introStart)/620);
   target.x=width*(.28+.44*t);target.y=height*.28;target.weight=Math.sin(t*Math.PI)*.48;
   if(t===1){introDone=true;target.weight=0;try{sessionStorage.setItem('tyler-rainbow-seen','1');}catch{}}
  }
  // Read the cursor immediately. Each fixed-centre tile springs to its own angle.
  const steps=Math.ceil(dt/.008),step=dt/steps;let moving=false;
  for(const piece of segments){
   const toward=Math.atan2(target.y-piece.y,target.x-piece.x);
   const angle=piece.rest+rainbowAxisTurn(toward-piece.rest)*target.weight;
   for(let i=0;i<steps;i++)stepRainbowAngle(piece,angle,step);
   moving=Math.abs(rainbowAxisTurn(angle-piece.angle))>.001||Math.abs(piece.velocity)>.003||moving;
  }
  draw();
  if(!introDone||moving)raf=requestAnimationFrame(frame);else lastFrame=0;
 }
 function animate(){if(!raf&&inView&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);}
 function resize(){
  const bounds=host.getBoundingClientRect();if(!bounds.width)return;
  width=bounds.width;height=bounds.height;
  const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
  segments=createRainbowTiles(width,height);
  const left=Math.min(...segments.map(p=>p.x)),right=Math.max(...segments.map(p=>p.x));
  for(const [name,colors] of Object.entries(palettes)){
   const gradient=ctx.createLinearGradient(left,0,right,0);
   colors.forEach((color,i)=>gradient.addColorStop(i/(colors.length-1),color));gradients[name]=gradient;
  }
  target.x=clientPoint?clientPoint.x-bounds.left:width/2;target.y=clientPoint?clientPoint.y-bounds.top:height*.3;
  target.weight=clientPoint?rainbowInfluence(target.x,target.y,segments,width,height):0;
  draw();animate();
 }
 function move(event){
  if(reduced.matches||!fine.matches||event.pointerType==='touch'||!inView||document.hidden)return;
  const bounds=host.getBoundingClientRect();introDone=true;
  try{sessionStorage.setItem('tyler-rainbow-seen','1');}catch{}
  clientPoint={x:event.clientX,y:event.clientY};target.x=event.clientX-bounds.left;target.y=event.clientY-bounds.top;
  const weight=rainbowInfluence(target.x,target.y,segments,width,height),wasActive=target.weight>0;target.weight=weight;
  if(weight>0||wasActive)animate();
 }
 function leave(){clientPoint=null;target.weight=0;animate();}
 function rest(){cancelAnimationFrame(raf);raf=0;lastFrame=0;introDone=true;clientPoint=null;target.weight=0;for(const p of segments){p.angle=p.rest;p.velocity=0;}draw();}
 const sizes=new ResizeObserver(resize);sizes.observe(host);
 const visibility=new IntersectionObserver(([entry])=>{
  inView=entry.isIntersecting;
  if(inView){resize();animate();}else{cancelAnimationFrame(raf);raf=0;lastFrame=0;target.weight=0;clientPoint=null;}
 });visibility.observe(host);
 const theme=new MutationObserver(draw);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('pointercancel',leave);
 window.addEventListener('blur',leave);reduced.addEventListener('change',rest);fine.addEventListener('change',rest);
 function visible(){if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;target.weight=0;clientPoint=null;}else animate();}
 document.addEventListener('visibilitychange',visible);
 window.addEventListener('pagehide',event=>{
  cancelAnimationFrame(raf);raf=0;if(event.persisted)return;
  sizes.disconnect();visibility.disconnect();theme.disconnect();document.removeEventListener('visibilitychange',visible);window.removeEventListener('blur',leave);
  window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);window.removeEventListener('pointercancel',leave);
  reduced.removeEventListener('change',rest);fine.removeEventListener('change',rest);
 });
 window.addEventListener('pageshow',()=>{lastFrame=0;resize();});
 if(reduced.matches)introDone=true;resize();
})();
