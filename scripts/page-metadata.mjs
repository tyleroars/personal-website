import fs from 'node:fs';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '..');
export const {origin, articles} = JSON.parse(fs.readFileSync(path.join(root, 'launch-data.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'page-metadata.json'), 'utf8'));
const sections = [
  ['/', ['index.html', 'home.html'], 'home.md'],
  ['/projects', ['projects.html'], 'projects.md'],
  ['/writing', ['writing.html'], 'writing.md'],
  ['/work', ['work.html'], 'work.md'],
  ['/interviews', ['interviews.html'], 'interviews.md'],
  ['/huddledex-browser/', ['huddledex-browser/index.html'], null]
];
export const pages = [
  ...sections.map(([route, files, markdown]) => ({route, files, markdown, noindex:route==='/huddledex-browser/'})),
  ...articles.map(article => ({route:'/writing/'+article.slug, files:[`writing/${article.slug}.html`], markdown:`writing/${article.slug}.md`, article}))
].map(page => {
  const meta = metadata[page.route];
  if (!meta?.title || !meta?.description) throw new Error('Missing page metadata: '+page.route);
  return {...page, ...meta, displayTitle:page.article?.title || meta.cardTitle};
});
if (Object.keys(metadata).length !== pages.length) throw new Error('Metadata contains an unknown route');
export const pageByRoute = new Map(pages.map(page => [page.route, page]));
export const pageByFile = new Map(pages.flatMap(page => page.files.map(file => [file, page])));
export const encode = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const publicationDate = value => new Date(value).toLocaleDateString('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit'});

// Kept in source HTML too, so local previews and view-source remain consistent.
export function applyPageMetadata(html, page) {
  const values = new Map([
    ['description',page.description], ['og:title',page.article?.title || page.title],
    ['og:description',page.description], ['og:type',page.article?'article':'website'],
    ['twitter:title',page.article?.title || page.title], ['twitter:description',page.description],
    ['twitter:card','summary_large_image']
  ]);
  const found = new Set();
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${encode(page.title)}</title>`);
  html = html.replace(/<meta\b[^>]*>/gi, tag => {
    const key = tag.match(/\b(?:name|property)=["']([^"']+)["']/i)?.[1];
    if (!values.has(key)) return tag;
    if (found.has(key)) return '';
    found.add(key);
    return `<meta ${key.startsWith('og:')?'property':'name'}="${key}" content="${encode(values.get(key))}">`;
  });
  return html.replace('</head>', [...values].filter(([key]) => !found.has(key)).map(([key,value]) =>
    `<meta ${key.startsWith('og:')?'property':'name'}="${key}" content="${encode(value)}">`).join('')+'</head>');
}
