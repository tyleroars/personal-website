import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {accountSnapshot} from './lib/account-token-usage.mjs';
const raw=()=>({summary:{lifetimeTokens:300,peakDailyTokens:200,longestRunningTurnSec:60,currentStreakDays:1,longestStreakDays:1},dailyUsageBuckets:[{startDate:'2026-11-02',tokens:200},{startDate:'2026-10-31',tokens:100}],threadUsage:{threadId:'private-id',prompt:'private-body'},accountId:'private-account'});
const context=()=>{const c=vm.createContext({Intl,Date});vm.runInContext(fs.readFileSync(new URL('../src/token-view.js',import.meta.url),'utf8'),c);return c;};
test('official account export whitelists only summary metrics and daily totals',()=>{
 const data=accountSnapshot(raw(),'2026-11-12T00:00:00Z');assert.equal(data.schemaVersion,4);assert.equal(data.source.method,'account/usage/read');assert.deepEqual(data.daily,[{date:'2026-10-31',total:100},{date:'2026-11-02',total:200}]);assert.doesNotMatch(JSON.stringify(data),/private-id|private-body|private-account|threadUsage|threadId|accountId/);
});
test('missing totals and mismatched daily or peak usage stop export rather than fabricate detail',()=>{
 for(const change of [r=>r.summary.lifetimeTokens=null,r=>r.dailyUsageBuckets=null,r=>r.summary.lifetimeTokens=301,r=>r.summary.peakDailyTokens=199]){const r=raw();change(r);assert.throws(()=>accountSnapshot(r),/unavailable|does not match/);}
});
test('invalid dates, duplicates and invalid counts are rejected',()=>{
 for(const change of [r=>r.dailyUsageBuckets[0].startDate='2026-02-30',r=>r.dailyUsageBuckets.push({...r.dailyUsageBuckets[0]}),r=>r.dailyUsageBuckets[0].tokens=-1,r=>r.dailyUsageBuckets[0].tokens=1.5,r=>r.summary.longestRunningTurnSec=-1]){const r=raw();change(r);assert.throws(()=>accountSnapshot(r),/Invalid|does not match/);}
});
test('daily, monthly, weekday and cumulative views use the same dates and reconcile exactly',()=>{
 const c=context();c.data=accountSnapshot(raw());const s=vm.runInContext('tokenSelection(data)',c);
 assert.equal(s.total,300);assert.equal(s.months.reduce((n,d)=>n+d.total,0),300);assert.equal(s.weekdays.reduce((n,d)=>n+d.total,0),300);assert.deepEqual(JSON.parse(JSON.stringify(s.cumulative)),[{date:'2026-10-31',total:100},{date:'2026-11-01',total:100},{date:'2026-11-02',total:300}]);assert.equal(s.weekdays[0].total,200);assert.equal(s.weekdays[5].total,100);
 c.data.summary.lifetimeTokens=301;assert.throws(()=>vm.runInContext('tokenSelection(data)',c),/does not match/);
 c.data.source.method='sqlite-counter-sum';assert.throws(()=>vm.runInContext('tokenSelection(data)',c),/official account snapshot/);
});
test('published snapshot and browser data agree, contain no private fields, and all chart totals match',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../src/data/token-usage.json',import.meta.url))),c=context();vm.runInContext(fs.readFileSync(new URL('../src/token-usage-data.js',import.meta.url),'utf8')+';this.snapshot=tokenUsage;',c);assert.deepEqual(JSON.parse(JSON.stringify(c.snapshot)),data);
 assert.deepEqual(Object.keys(data).sort(),['schemaVersion','generatedAt','source','scope','summary','coverage','daily'].sort());assert.equal(data.source.method,'account/usage/read');assert.deepEqual(data.scope,{account:'personal',excludesWork:true,historicalChatGPTCoverage:'not verified'});assert.doesNotMatch(JSON.stringify(data),/\/Users\/|\.jsonl|rollout-|threadId|accountId|response_id|requestId|prompt|credential|model|cachedInput/);
 const s=vm.runInContext('tokenSelection(snapshot)',c);assert.equal(s.total,data.summary.lifetimeTokens);assert.equal(s.months.reduce((n,d)=>n+d.total,0),s.total);assert.equal(s.weekdays.reduce((n,d)=>n+d.total,0),s.total);assert.equal(s.cumulative.at(-1).total,s.total);assert.equal(s.peak.total,data.summary.peakDailyTokens);assert.equal(new Set(data.daily.map(d=>d.date)).size,data.daily.length);
 const html=vm.runInContext('renderTokenPage(snapshot)',c);assert.ok(html.includes(new Intl.NumberFormat('en-CA').format(s.total)));for(const cls of ['token-calendar','token-month-chart','token-weekdays','token-cumulative'])assert.ok(html.includes(cls));assert.doesNotMatch(html,/<details\b|token-method|token-models|token-heat-cell|recorded tokens|—|Usage events/i);
});
