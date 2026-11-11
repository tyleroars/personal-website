import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/site.js',import.meta.url),'utf8');
const controller=source.slice(source.indexOf('function initGalleries()'),source.indexOf('function buildPromptPanel('));

function setup(count=3){
 const node=()=>({hidden:false,style:{},events:{},classList:{add(){},remove(){},toggle(){}},addEventListener(name,fn){this.events[name]=fn;}});
 const image=node(),stage=node(),status=node(),retry=node(),position={},caption={},rail={clientWidth:100,scrollLeft:0};
 const document={activeElement:null};
 const button=step=>({...node(),dataset:{galleryStep:String(step)},focus(){document.activeElement=this;}});
 const previous=button(-1),following=button(1);
 const thumbs=Array.from({length:count},(_,i)=>({dataset:{galleryIndex:String(i)},parentElement:rail,offsetLeft:i*64,offsetWidth:56,setAttribute(k,v){this[k]=v;}}));
 const shots=Array.from({length:count},(_,i)=>({src:`image-${i}.webp`,alt:`Screen ${i+1}`,caption:`Caption ${i+1}`,width:600,height:800}));
 const gallery={...node(),dataset:{shots:JSON.stringify(shots)},querySelector(selector){
  const elements={'.gallery-image':image,'.gallery-stage':stage,'.gallery-loading':status,'.gallery-retry':retry,'.gallery-position':position,'.gallery-caption':caption,'[data-gallery-step="-1"]':previous,'[data-gallery-step="1"]':following,'.gallery-heading':{scrollIntoView(){}}};
  return elements[selector]??thumbs[Number(selector.match(/data-gallery-index="(\d+)"/)?.[1])]??null;
 },querySelectorAll(){return thumbs;}};
 vm.runInNewContext(controller+';initGalleries();',{document,dialog:{querySelectorAll:()=>[gallery]}});
 const click=target=>gallery.events.click({target:{closest:selector=>(selector==='[data-gallery-step]'&&target.dataset.galleryStep)||(selector==='[data-gallery-index]'&&target.dataset.galleryIndex!==undefined)?target:null}});
 const key=key=>gallery.events.keydown({key,preventDefault(){}});
 const touch=(dx,dy,primary=true)=>{stage.events.pointerdown({pointerType:'touch',isPrimary:primary,pointerId:1,clientX:150,clientY:100,target:{closest:()=>null}});stage.events.pointerup({pointerId:1,clientX:150+dx,clientY:100+dy});};
 return {document,previous,following,thumbs,rail,image,position,caption,click,key,touch};
}

test('gallery boundaries hide unavailable controls, preserve focus, and never wrap',()=>{
 const app=setup();
 assert.equal(app.position.textContent,'1 of 3');assert.equal(app.previous.hidden,true);
 app.key('ArrowLeft');assert.equal(app.position.textContent,'1 of 3');
 app.document.activeElement=app.following;
 app.click(app.following);assert.equal(app.previous.hidden,false);
 app.click(app.following);assert.equal(app.following.hidden,true);assert.equal(app.document.activeElement,app.previous);
 app.key('ArrowRight');assert.equal(app.position.textContent,'3 of 3');
 app.click(app.previous);app.click(app.previous);
 assert.equal(app.document.activeElement,app.following);assert.equal(app.previous.hidden,true);
});

test('thumbnail selection updates image, caption, current state, and rail visibility together',()=>{
 const app=setup(8);app.click(app.thumbs[7]);
 assert.equal(app.image.src,'assets/image-7.webp');assert.equal(app.image.alt,'Screen 8');assert.equal(app.caption.textContent,'Caption 8');
 assert.equal(app.position.textContent,'8 of 8');assert.equal(app.thumbs[7]['aria-pressed'],'true');assert.equal(app.thumbs[0]['aria-pressed'],'false');
 assert.ok(app.rail.scrollLeft>300);
});

test('touch gestures change images only for an intentional horizontal swipe',()=>{
 const app=setup();
 app.touch(-25,0);app.touch(-80,100);app.touch(-80,0,false);assert.equal(app.position.textContent,'1 of 3');
 app.touch(-80,5);assert.equal(app.position.textContent,'2 of 3');
 app.touch(80,5);assert.equal(app.position.textContent,'1 of 3');
 app.touch(80,0);assert.equal(app.position.textContent,'1 of 3');
});
