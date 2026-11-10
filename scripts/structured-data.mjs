import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {root, origin, pages} from './page-metadata.mjs';

const context=vm.createContext({});
for (const file of ['projects.js','interviews.js']) vm.runInContext(fs.readFileSync(path.join(root,'src',file),'utf8'),context);
const {projects,interviewArchive}=vm.runInContext('({projects,interviewArchive})',context);
const personId=origin+'/#tyler-yip', websiteId=origin+'/#website';
export function structuredData(page, html, shareImageUrl) {
  const url=origin+page.route;
  const person={'@type':'Person','@id':personId,name:'Tyler Yip',url:origin+'/',sameAs:['https://github.com/tyleroars','https://www.linkedin.com/in/tyleryip/']};
  const website={'@type':'WebSite','@id':websiteId,name:'Tyler Yip',url:origin+'/',inLanguage:'en',publisher:{'@id':personId}};
  const collection=['/projects','/writing','/interviews'].includes(page.route);
  const webpage={'@type':page.route==='/'?'ProfilePage':collection?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:'en',isPartOf:{'@id':websiteId},about:{'@id':personId}};
  const graph=[website,person,webpage];
  if (page.route==='/') webpage.mainEntity={'@id':personId};
  if (!page.article) {
    webpage.primaryImageOfPage={'@type':'ImageObject',url:shareImageUrl,width:2400,height:1260};
  } else {
    // Use photographs/illustrations actually in the article for Article image markup.
    // The branded sharing card is a separate Open Graph asset, not a fabricated article photo.
    const body=html.split('class="article-body"')[1]?.split('<nav')[0] || '';
    const contentImages=[...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].slice(0,3).map(m=>new URL(m[1],origin+'/').href);
    const article={'@type':'BlogPosting','@id':url+'#article',url,headline:page.article.title,description:page.description,datePublished:page.article.date,author:{'@id':personId},publisher:{'@id':personId},mainEntityOfPage:{'@id':webpage['@id']},isPartOf:{'@id':origin+'/writing#webpage'},inLanguage:'en'};
    if (contentImages.length) {article.image=contentImages;webpage.primaryImageOfPage={'@type':'ImageObject',url:contentImages[0]};}
    webpage.mainEntity={'@id':article['@id']};graph.push(article);
  }
  if (collection) {
    let items=[];
    if (page.route==='/writing') items=pages.filter(p=>p.article).map(p=>({name:p.article.title,url:origin+p.route}));
    if (page.route==='/projects') items=projects.map(p=>({name:p.title,url:origin+'/projects#'+p.id}));
    if (page.route==='/interviews') items=interviewArchive.map(p=>({name:p.title,url:p.url}));
    const list={'@type':'ItemList','@id':url+'#list',numberOfItems:items.length,itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))};
    webpage.mainEntity={'@id':list['@id']};graph.push(list);
  }
  if (page.route!=='/') {
    const crumbs=[{name:'Home',url:origin+'/'}];
    if (page.article) crumbs.push({name:'Writing',url:origin+'/writing'});
    crumbs.push({name:page.displayTitle,url});
    const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:crumbs.map((crumb,index)=>({'@type':'ListItem',position:index+1,name:crumb.name,item:crumb.url}))};
    webpage.breadcrumb={'@id':breadcrumb['@id']};graph.push(breadcrumb);
  }
  return {'@context':'https://schema.org','@graph':graph};
}
