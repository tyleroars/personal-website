import {spawn} from 'node:child_process';import readline from 'node:readline';
const validCount=value=>Number.isSafeInteger(value)&&value>=0;
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
export function accountSnapshot(raw,observedAt=new Date().toISOString()){
 const summary=raw?.summary;
 if(!validCount(summary?.lifetimeTokens)||!Array.isArray(raw.dailyUsageBuckets)||!raw.dailyUsageBuckets.length)throw Error('Account lifetime total or daily usage is unavailable; previous snapshot kept.');
 const seen=new Set(),daily=raw.dailyUsageBuckets.map(row=>{
  if(!validDate(row.startDate)||!validCount(row.tokens)||seen.has(row.startDate))throw Error('Invalid or duplicate account usage date; previous snapshot kept.');
  seen.add(row.startDate);return {date:row.startDate,total:row.tokens};
 }).sort((a,b)=>a.date.localeCompare(b.date));
 if(daily.reduce((n,d)=>n+d.total,0)!==summary.lifetimeTokens)throw Error('Account daily usage does not match the lifetime total; previous snapshot kept.');
 const metrics={};for(const key of ['lifetimeTokens','peakDailyTokens','longestRunningTurnSec','currentStreakDays','longestStreakDays']){if(summary[key]!=null&&!validCount(summary[key]))throw Error('Invalid account summary metric');metrics[key]=summary[key]??null;}
 if(metrics.peakDailyTokens!=null&&metrics.peakDailyTokens!==Math.max(...daily.map(d=>d.total)))throw Error('Account peak does not match daily usage; previous snapshot kept.');
 return {schemaVersion:4,generatedAt:observedAt,source:{method:'account/usage/read',documentation:'https://learn.chatgpt.com/docs/app-server#7-token-usage-chatgpt',dateBasis:'dates returned by the service'},scope:{account:'personal',excludesWork:true,historicalChatGPTCoverage:'not verified'},summary:metrics,coverage:{firstDate:daily[0].date,lastDate:daily.at(-1).date},daily};
}
export function readAccountUsage({timeoutMs=25000}={}){
 return new Promise((resolve,reject)=>{
  const child=spawn('codex',['app-server','--stdio'],{stdio:['pipe','pipe','pipe']}),lines=readline.createInterface({input:child.stdout});let done=false;
  const send=message=>child.stdin.write(JSON.stringify(message)+'\n');
  const finish=(error,result)=>{if(done)return;done=true;clearTimeout(timer);child.stdin.end();lines.close();child.kill('SIGTERM');error?reject(error):resolve(result);};
  const timer=setTimeout(()=>finish(Error('Account usage request timed out; previous snapshot kept.')),timeoutMs);
  child.stderr.on('data',()=>{});child.stdin.on('error',()=>{});
  child.on('error',()=>finish(Error('Could not launch Codex account-usage reader.')));
  child.on('exit',()=>{if(!done)finish(Error('Account-usage reader exited before returning a result.'));});
  lines.on('line',line=>{let message;try{message=JSON.parse(line);}catch{return;}
   if(message.id===0){if(message.error){finish(Error('Account-usage initialization failed.'));return;}send({method:'initialized',params:{}});send({method:'account/usage/read',id:1});}
   else if(message.id===1){if(message.error){finish(Error(`Account usage unavailable (code ${message.error.code}); previous snapshot kept.`));return;}finish(null,message.result);}
   else if(message.id!==undefined&&message.method)send({id:message.id,error:{code:-32601,message:'Read-only usage export does not provide interactive auth or tool execution.'}});
  });
  // This starts no thread or model turn and never reads raw credentials.
  send({method:'initialize',id:0,params:{clientInfo:{name:'tyler_website_usage_export',title:'Personal website usage export',version:'1.0.0'},capabilities:{experimentalApi:true}}});
 });
}
