// Static charts first. Inspection updates one mark and readout, without rerendering.
const tokenContent=document.querySelector('.page-tokens');
if(tokenContent){
 const selected=tokenSelection(tokenUsage),series=selected.cumulative;
 const select=(plot,mark)=>{if(!mark||mark.classList.contains('is-selected'))return;plot.querySelector('.is-selected')?.classList.remove('is-selected');mark.classList.add('is-selected');plot.querySelector('[data-token-readout]').textContent=mark.dataset.tokenLabel;};
 const cumulative=(plot,index)=>{
  index=Math.max(0,Math.min(series.length-1,index));plot.dataset.tokenIndex=String(index);plot.classList.add('is-inspecting');
  const point=series[index],x=index/Math.max(1,series.length-1)*100,y=(200-point.total/Math.max(1,selected.total)*192)/208*100,dot=plot.querySelector('[data-token-dot]'),guide=plot.querySelector('[data-token-guide]');
  dot.style.left=x+'%';dot.style.top=y+'%';guide.style.left=x+'%';plot.querySelector('[data-token-readout]').textContent=tokenDate(point.date)+': '+tokenNumber(point.total)+' tokens';
 };
 const inspect=event=>{const mark=event.target.closest('[data-token-mark]');if(mark)select(mark.closest('[data-token-explorer]'),mark);};
 tokenContent.addEventListener('pointerover',inspect);tokenContent.addEventListener('click',inspect);
 const inspectRunning=event=>{const svg=event.target.closest('[data-token-cumulative]');if(!svg)return;const rect=svg.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width;cumulative(svg.closest('[data-token-explorer]'),Math.round(x*(series.length-1)));};
 tokenContent.addEventListener('pointermove',inspectRunning);tokenContent.addEventListener('pointerdown',inspectRunning);
 tokenContent.addEventListener('keydown',event=>{
  const plot=event.target.closest('[data-token-explorer]');if(!plot)return;
  const kind=plot.dataset.tokenExplorer,marks=kind==='cumulative'?null:[...plot.querySelectorAll('[data-token-mark]')].sort((a,b)=>Number(a.dataset.tokenIndex)-Number(b.dataset.tokenIndex)),current=marks?marks.findIndex(m=>m.classList.contains('is-selected')):Number(plot.dataset.tokenIndex??series.length-1),length=marks?.length??series.length;
  let next=Math.max(0,current);
  if(event.key==='Home')next=0;else if(event.key==='End')next=length-1;
  else if(event.key==='ArrowRight')next+=kind==='calendar'?7:1;else if(event.key==='ArrowLeft')next-=kind==='calendar'?7:1;
  else if(event.key==='ArrowDown')next++;else if(event.key==='ArrowUp')next--;else return;
  event.preventDefault();next=Math.max(0,Math.min(length-1,next));if(kind==='cumulative'){cumulative(plot,next);return;}
  const mark=marks[next];select(plot,mark);
  if(kind==='calendar'){const rail=plot.querySelector('.token-calendar-scroll');rail.scrollLeft=Math.max(0,Number(mark.getAttribute('x'))-rail.clientWidth/2);}
 });
 const rail=tokenContent.querySelector('.token-calendar-scroll'),mark=rail?.querySelector('.is-selected');if(rail&&mark)rail.scrollLeft=Math.max(0,Number(mark.getAttribute('x'))-rail.clientWidth+44);
}
