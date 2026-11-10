import fs from 'node:fs';
import path from 'node:path';
import {root, pages, applyPageMetadata, publicationDate} from './page-metadata.mjs';

for (const page of pages) for (const file of page.files) {
  const target = path.join(root, 'src', file);
  fs.writeFileSync(target, applyPageMetadata(fs.readFileSync(target, 'utf8'), page));
}
const articlePages=pages.filter(page=>page.article);
const writingSummary=`${articlePages.length} articles, hosted in full on this site. Publication dates indicate when the views and product observations were written.\n\n`+
  articlePages.map(page=>`- [${page.article.title}](${page.markdown}) (${publicationDate(page.article.date)}): ${page.description}`).join('\n')+'\n';
for (const page of articlePages) {
  const target=path.join(root,'src',page.markdown);
  fs.writeFileSync(target,fs.readFileSync(target,'utf8').replace(/By Tyler Yip · \d{4}-\d{2}-\d{2}/,`By Tyler Yip · ${publicationDate(page.article.date)}`));
}
fs.writeFileSync(path.join(root,'src/writing.md'),'# Tyler Yip: Writing\n\n'+writingSummary);
for (const file of ['llms.txt','llms-full.txt']) {
  const target=path.join(root,'src',file);
  let text=fs.readFileSync(target,'utf8');
  const start=text.indexOf('## Writing\n');
  if (start<0) throw new Error('Agent profile is missing its writing index: '+file);
  const end=text.indexOf('\n## ',start+1);
  const section='## Writing\n\n[Writing archive](writing.md)\n\n'+writingSummary+'\n';
  text=text.slice(0,start)+section+(end<0?'':text.slice(end+1));
  fs.writeFileSync(target,text);
}
console.log(`Synced search and social copy for ${pages.length} routes.`);
