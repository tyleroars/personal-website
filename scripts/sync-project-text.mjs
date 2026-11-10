import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'src/projects.js'),'utf8'),context);
const projects=vm.runInContext('projects',context);
const link=(label,url)=>`[${label}](${url})`;
const paragraph=value=>value ? value+'\n\n' : '';
function projectText(project){
  const anchor=project.id==='huddle'?'huddledex':project.id;
  let text=`### ${project.title}\n\n${project.desc}\n\n`;
  text+=project.story.map(paragraph).join('');
  text+=(project.eventStory||[]).map(paragraph).join('');
  if(project.outcomes?.length) text+='Outcomes:\n\n'+project.outcomes.map(item=>'- '+item).join('\n')+'\n\n';
  if(project.visibility?.length){
    text+=`#### Search & AI visibility (${project.visibilityPeriod})\n\n`+project.visibility.map(item=>'- '+item).join('\n')+'\n\n';
    // Retain the scope notes already present in the public profile and project document.
    if(project.id==='gradsimple')text+='These visibility figures cover January 1 to November 5, 2026. Google’s 1M+ is rounded from 1,003,957 impressions. Search impressions, Microsoft AI citations, and active users are different measures and are not added together as unique reach.\n\n'+
      'The annual active-user figure comes from GA4, November 2025 to October 2026, with growth compared to the preceding twelve months. It covers all measured traffic sources. The 7,259-subscriber figure matches the archived site screenshot and is not a live counter.\n\n';
  }
  if(project.relatedTools?.length)text+='#### Related tools\n\n'+project.relatedTools.map(tool=>`- ${link(tool.title,tool.url)}: ${tool.description}`).join('\n')+'\n\n';
  for(const workflow of project.workflows||[]){
    text+=`#### ${workflow.title}\n\n`+workflow.paragraphs.map(paragraph).join('');
    if(workflow.image)text+=`![${workflow.image.alt}](assets/${workflow.image.src})\n\n`;
    if(workflow.codeUrl)text+=paragraph(link(workflow.codeLabel||'Public source code',workflow.codeUrl));
  }
  for(const item of project.links||[])text+=paragraph(link(item.label,item.url));
  if(project.url)text+=paragraph(link(project.urlLabel||'Visit the project',project.url));
  if(project.codeUrl)text+=paragraph(link('Public source code',project.codeUrl));
  if(project.buildPrompt){
    text+=paragraph(link('Browser build prompt',project.buildPrompt.download));
    text+=paragraph(link('Download the browser starter source','build-prompts/huddledex-browser-starter.zip'));
  }
  if(project.accessNote)text+=paragraph(project.accessNote);
  text+=paragraph(link('Project story on Tyler’s site','projects.html#'+anchor));
  return text;
}
const block=projects.map(projectText).join('');
fs.writeFileSync(path.join(root,'src/projects.md'),('# Tyler Yip: Projects\n\n'+block).trimEnd()+'\n');
for(const [file,heading] of [['llms.txt','Projects and independent work'],['llms-full.txt','Projects']]){
  const target=path.join(root,'src',file);
  const source=fs.readFileSync(target,'utf8');
  const start=source.indexOf('## '+heading+'\n');
  if(start<0)throw new Error('Missing projects section: '+file);
  const end=source.indexOf('\n## ',start+1);
  const section=`## ${heading}\n\n${projects.length} projects, including active tools, event prototypes, past businesses, and work that never launched.\n\n`+block;
  fs.writeFileSync(target,source.slice(0,start)+section+(end<0?'':source.slice(end+1)));
}
console.log(`Synced ${projects.length} projects, outcomes and workflows to projects.md, llms.txt and llms-full.txt.`);
