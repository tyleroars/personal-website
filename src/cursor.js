// A small soft follower accompanies the native pointer. No line, particles, or drawn trail.
if(design==='combined'){
 const follower=document.createElement('span');follower.className='soft-cursor';follower.setAttribute('aria-hidden','true');document.body.append(follower);
 const enabled=true;
 const capable=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');let raf=0,target=null,position=null,lastMove=0;
 function clear(){cancelAnimationFrame(raf);raf=0;target=null;position=null;follower.style.opacity='0';}
 function tick(now){if(!target||!enabled||!capable.matches){clear();return;}position.x+=(target.x-position.x)*.35;position.y+=(target.y-position.y)*.35;follower.style.transform=`translate3d(${position.x-5}px,${position.y-5}px,0)`;follower.style.opacity=now-lastMove<170?'.55':'0';if(now-lastMove<350)raf=requestAnimationFrame(tick);else raf=0;}
 function move(e){if(!enabled||!capable.matches||e.pointerType==='touch')return;target={x:e.clientX,y:e.clientY};if(!position)position={...target};lastMove=performance.now();if(!raf)raf=requestAnimationFrame(tick);}
 function sync(){follower.hidden=!capable.matches||!enabled;clear();}
 document.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',clear);addEventListener('blur',clear);capable.addEventListener('change',sync);
 addEventListener('pagehide',()=>{clear();document.removeEventListener('pointermove',move);removeEventListener('blur',clear);capable.removeEventListener('change',sync);});sync();
}
