import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const createNavigation=vm.runInNewContext(fs.readFileSync(new URL('../src/project-navigation.js',import.meta.url),'utf8')+';createProjectNavigation');
const projects=[{id:'gradsimple'},{id:'newsletter'},{id:'huddle'},{id:'career-quiz'}];

function setup(url,previous=[]){
  const entries=[...previous.map(url=>({url:new URL(url,'https://example.com'),state:null})),{url:new URL(url,'https://example.com'),state:null}];
  let index=entries.length-1;
  const listeners={};
  const browser={
    get location(){return entries[index].url;},
    addEventListener(type,listener){(listeners[type]??=[]).push(listener);},
    history:{
      get state(){return entries[index].state;},
      pushState(state,_,url){entries.splice(index+1);entries.push({url:new URL(url,entries[index].url),state});index++;},
      replaceState(state,_,url){entries[index]={url:new URL(url,entries[index].url),state};},
      back(){move(-1);},forward(){move(1);}
    }
  };
  function move(delta){
    const next=index+delta;if(next<0||next>=entries.length)return;
    const hash=browser.location.hash;index=next;
    for(const fn of listeners.popstate||[])fn();
    if(hash!==browser.location.hash)for(const fn of listeners.hashchange||[])fn();
  }
  const shown=[],hidden=[];
  let selected=null;
  const options={browser,projects,show(project,button){selected=project.id;shown.push({id:project.id,button});},hide(project){selected=null;hidden.push(project.id);},findOpener:project=>'button-'+project.id};
  const navigation=createNavigation(options);
  return {browser,entries,shown,hidden,navigation,options,get selected(){return selected;}};
}

test('opening, closing and sharing a second story never keeps the first story hash',()=>{
  const app=setup('/projects');
  app.navigation.open(projects[0],'clicked-gradsimple');
  assert.equal(app.browser.location.hash,'#gradsimple');
  app.navigation.close();
  assert.equal(app.browser.location.href,'https://example.com/projects');
  assert.equal(app.selected,null);
  app.navigation.open(projects[1],'clicked-newsletter');
  assert.equal(app.browser.location.hash,'#newsletter');
  assert.equal(app.shown.at(-1).button,'clicked-newsletter');
  assert.equal(setup(app.browser.location.href).selected,'newsletter');
});

test('Back closes a direct-linked story before leaving Projects; Forward reopens it',()=>{
  const app=setup('/projects#gradsimple',['/']);
  assert.equal(app.selected,'gradsimple');
  app.browser.history.back();
  assert.equal(app.browser.location.pathname,'/projects');
  assert.equal(app.browser.location.hash,'');
  assert.equal(app.selected,null);
  app.browser.history.forward();
  assert.equal(app.selected,'gradsimple');
  assert.equal(app.shown.at(-1).button,'button-gradsimple');
  app.navigation.close();
  app.browser.history.back();
  assert.equal(app.browser.location.pathname,'/');
});

test('reloading a managed story does not add another history entry',()=>{
  const app=setup('/projects#newsletter');
  const length=app.entries.length;
  const shown=[];
  createNavigation({...app.options,show:project=>shown.push(project.id)});
  assert.equal(app.entries.length,length);
  assert.deepEqual(shown,['newsletter']);
});

test('category anchors, legacy links and malformed fragments remain safe',()=>{
  const app=setup('/projects?from=about#project-earlier');
  assert.equal(app.selected,null);
  app.navigation.open(projects[3]);
  assert.equal(app.browser.location.href,'https://example.com/projects?from=about#career-quiz');
  app.navigation.close();
  assert.equal(app.browser.location.hash,'#project-earlier');
  for(const [hash,id,canonical] of [['huddle','huddle','huddledex'],['huddledex','huddle','huddledex'],['mcp','gradsimple','gradsimple'],['reddit','gradsimple','gradsimple']]){
    const direct=setup('/projects#'+hash);
    assert.equal(direct.selected,id);
    assert.equal(direct.browser.location.hash,'#'+canonical);
    direct.navigation.close();
    assert.equal(direct.browser.location.hash,'');
  }
  assert.equal(setup('/projects#%E0%A4%A').selected,null);
});
