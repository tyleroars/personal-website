// Original canvas art: circular rows and a shared magnetic pointer.
// Interaction inspired by Josh W. Comeau; rendering written for this site.
(() => {
 const host=document.querySelector('.about-rainbow');if(!host)return;
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const palette=['#ed6583','#f0cc59','#54bf9c','#8a79d4'];
 const pointer={x:0,y:0,vx:0,vy:0,weight:0,vw:0},target={x:0,y:0,weight:0};
 let width=0,height=0,segments=[],raf=0,lastFrame=0,inView=false,entered=false,introStart=0,introDone=false;
 const axisTurn=angle=>((angle+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;
 try{introDone=!!sessionStorage.getItem('tyler-rainbow-seen');}catch{}
 function draw(){
  if(!width)return;
  ctx.clearRect(0,0,width,height);
  const dark=document.documentElement.dataset.theme==='dark';
  ctx.fillStyle=dark?'#00000030':'#3f514713';ctx.beginPath();ctx.ellipse(width/2,height-9,width*.14,4,0,0,Math.PI*2);ctx.fill();
  for(const piece of segments){
   const toward=Math.atan2(pointer.y-piece.y,pointer.x-piece.x);
   const angle=piece.rest+axisTurn(toward-piece.rest)*pointer.weight;
   const dx=Math.cos(angle)*piece.length/2,dy=Math.sin(angle)*piece.length/2;
   ctx.strokeStyle=palette[Math.floor(piece.row/2)];ctx.lineWidth=piece.stroke;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(piece.x-dx,piece.y-dy);ctx.lineTo(piece.x+dx,piece.y+dy);ctx.stroke();
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
  // One spring position drives every piece, without delayed per-piece waves.
  const steps=Math.ceil(dt/.008),step=dt/steps;
  for(let i=0;i<steps;i++)for(const [value,velocity] of [['x','vx'],['y','vy'],['weight','vw']]){
   pointer[velocity]+=((target[value]-pointer[value])*420-pointer[velocity]*32)*step;
   pointer[value]+=pointer[velocity]*step;
  }
  draw();
  const moving=Math.abs(pointer.x-target.x)>.02||Math.abs(pointer.y-target.y)>.02||Math.abs(pointer.vx)>.03||Math.abs(pointer.vy)>.03||Math.abs(pointer.weight-target.weight)>.001||Math.abs(pointer.vw)>.002;
  if(!introDone||moving)raf=requestAnimationFrame(frame);else lastFrame=0;
 }
 function animate(){if(!raf&&inView&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);}
 function resize(){
  const bounds=host.getBoundingClientRect();if(!bounds.width)return;
  width=bounds.width;height=bounds.height;
  const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
  const scale=Math.min(width/340,height/225),cx=width/2,cy=height-26*scale;
  segments=[];
  for(let row=0;row<8;row++){
   const radius=(72+row*12)*scale;
   // Equal arc distances give outer rows more pieces, keeping gaps consistent.
   const count=Math.round(Math.PI*radius/(15*scale));
   for(let i=0;i<count;i++){
    const angle=Math.PI*(.035+.93*i/(count-1));
    segments.push({row,x:cx-Math.cos(angle)*radius,y:cy-Math.sin(angle)*radius,rest:angle-Math.PI/2,length:6*scale,stroke:4.6*scale});
   }
  }
  if(!entered){pointer.x=target.x=width/2;pointer.y=target.y=height*.3;}
  draw();animate();
 }
 function move(event){
  if(reduced.matches||!fine.matches||event.pointerType==='touch'||!inView||document.hidden)return;
  const bounds=host.getBoundingClientRect();introDone=true;
  try{sessionStorage.setItem('tyler-rainbow-seen','1');}catch{}
  target.x=event.clientX-bounds.left;target.y=event.clientY-bounds.top;target.weight=1;
  if(!entered){pointer.x=target.x;pointer.y=target.y;pointer.vx=pointer.vy=0;entered=true;}
  animate();
 }
 function leave(){entered=false;target.weight=0;animate();}
 function rest(){cancelAnimationFrame(raf);raf=0;lastFrame=0;entered=false;introDone=true;target.weight=pointer.weight=pointer.vw=pointer.vx=pointer.vy=0;draw();}
 const sizes=new ResizeObserver(resize);sizes.observe(host);
 const visibility=new IntersectionObserver(([entry])=>{
  inView=entry.isIntersecting;
  if(inView){resize();animate();}else{cancelAnimationFrame(raf);raf=0;lastFrame=0;target.weight=pointer.weight=pointer.vw=0;}
 });visibility.observe(host);
 const theme=new MutationObserver(draw);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);host.addEventListener('pointercancel',leave);
 window.addEventListener('blur',leave);reduced.addEventListener('change',rest);fine.addEventListener('change',rest);
 function visible(){if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;target.weight=pointer.weight=pointer.vw=0;}else animate();}
 document.addEventListener('visibilitychange',visible);
 window.addEventListener('pagehide',event=>{
  cancelAnimationFrame(raf);raf=0;if(event.persisted)return;
  sizes.disconnect();visibility.disconnect();theme.disconnect();document.removeEventListener('visibilitychange',visible);window.removeEventListener('blur',leave);
  reduced.removeEventListener('change',rest);fine.removeEventListener('change',rest);
 });
 window.addEventListener('pageshow',()=>{lastFrame=0;resize();});
 if(reduced.matches)introDone=true;resize();
})();
