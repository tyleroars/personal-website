const design='combined';
const page=document.body.dataset.page;
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=escapeHTML;
const socialContacts=`<a href="https://github.com/tyleroars"><img src="assets/icons/github.svg" alt="" width="16" height="16"><span>GitHub</span></a><a href="https://www.linkedin.com/in/tyleryip/"><img src="assets/icons/linkedin.svg" alt="" width="16" height="16"><span>LinkedIn</span></a><a href="mailto:tyleryip.sg@gmail.com" aria-label="Email Tyler at tyleryip.sg@gmail.com"><img src="assets/icons/gmail.svg" alt="" width="16" height="16"><span>Gmail</span></a>`;
const routes=[['about','About','home.html'],['projects','Projects','projects.html'],['writing','Writing','writing.html'],['work','Work','work.html'],['interviews','Interviews','interviews.html']];
const navDescriptions={about:"Background & interests",projects:"Apps & experiments",writing:"Notes on AI",work:"Experience & skills",interviews:"Career conversations"};
const sidebar=`<aside class="combined-sidebar"><div class="sidebar-header"><a href="home.html" class="sidebar-profile" aria-label="Tyler Yip, home"><img src="assets/optimized/1372408ed4e1.webp" alt="Tyler Yip beneath cherry blossoms" width="240" height="360" decoding="async" fetchpriority="high"><span>Tyler Yip</span></a><div class="sidebar-actions"><div class="theme-choice"><button type="button" class="theme-toggle" data-theme-toggle aria-label="Switch to light mode" title="Switch to light mode"><svg data-theme-icon="dark" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><svg data-theme-icon="light" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></button></div><button type="button" class="mobile-nav-toggle" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false"><span class="mobile-menu-icon" aria-hidden="true"></span></button></div></div><nav id="primary-navigation" aria-label="Main navigation">${routes.map(([id,name,url])=>`<a href="${url}" ${(page===id||(id==='writing'&&page==='writing-article'))?'aria-current="page"':''}><span class="nav-label">${name}</span><span class="nav-note" aria-hidden="true">${E(navDescriptions[id])}</span></a>`).join('')}</nav><div class="combined-contacts">${socialContacts}</div></aside>`;
const footer=`<footer class="site-footer"><nav class="footer-contacts" aria-label="Contact links">${socialContacts}</nav><a href="llms.txt" target="_blank" rel="noopener">llms.txt</a></footer>`;
const projectButton=(p,label)=>`<button class="project-open" data-project="${E(p.id)}">${E(label||p.title)} <span aria-hidden="true">↗</span></button>`;
const heroCropAttrs=shot=>`${shot.cropHeight?'class="hero-preview" ':''}style="--preview-ratio:${shot.width/(shot.cropHeight||shot.height)}${shot.cropHeight?`;--hero-preview-aspect:${E(shot.width)} / ${E(shot.cropHeight)}`:''}"`;
const projectPreview=p=>{
 const images=p.id==='huddle'?[p.screenshots[1],p.screenshots[4],p.screenshots[6]]:(p.previewImages||[]).slice(0,3);
 return images.length?`<div class="${p.id==='huddle'?'huddle-preview':'project-preview-strip'}">${images.map(shot=>`<img ${heroCropAttrs(shot)} src="assets/${E(shot.src)}" alt="${E(shot.alt||shot.title||p.title)}" decoding="async" width="${shot.width}" height="${shot.height}" loading="lazy">`).join('')}</div>`:'';
};
// Keep old category hashes usable without adding category navigation to the page.
const legacyProjectAnchors={gradsimple:'project-latest',tone:'project-tools','the-frenz':'project-earlier'};
const projectResults=p=>p.results?.length?`<ul class="project-results" role="list" aria-label="${E(p.title)} figures and outcomes">${p.results.map(result=>`<li><strong>${E(result.value)}</strong> ${E(result.label)}</li>`).join('')}</ul>`:'';
const projectRow=p=>`${legacyProjectAnchors[p.id]?`<span class="legacy-project-anchor" id="${legacyProjectAnchors[p.id]}" aria-hidden="true"></span>`:''}<article class="site-project" id="${p.id==='huddle'?'huddledex':E(p.id)}"><div class="project-heading"><h2><button type="button" class="project-title-action" data-project="${E(p.id)}" aria-haspopup="dialog"><span class="project-title-text">${E(p.title)}</span><span class="project-title-arrow" aria-hidden="true">→</span></button></h2></div><p>${E(p.desc)}</p>${projectResults(p)}${projectPreview(p)}</article>`;
const intro=(title,text)=>`<header class="page-intro"><h1>${title}</h1>${text?`<p>${text}</p>`:''}</header>`;
let content='';
if(!document.body.hasAttribute('data-prerendered')){
if(page==='about'){
 content=`<section class="about-hero" aria-labelledby="about-title"><header class="page-intro"><h1 id="about-title">Hi, I’m Tyler.</h1><p>I’m from Singapore, now in Vancouver. I work with customers at <a href="https://knak.com/">Knak</a> and run <a href="projects.html#gradsimple">GradSimple</a>, where I get to be a little nosy about people’s careers.</p></header><div class="about-rainbow"><div class="rainbow-mascot"><img src="assets/tyler-mascot-v1.webp" alt="An illustrated Tyler wearing round glasses and holding a camera" width="585" height="640" decoding="async" fetchpriority="high"></div></div></section><div class="about-prose"><p>I love hearing the story behind a job title. How someone found their way there, what the work is actually like, and what they’re figuring out next. With AI changing so much of that, I’ve been doing a lot of experimenting myself.</p><p>I used to <em>wish</em> I could code. Now I’m building tools for our team and GradSimple, and sharing marketing prompts and workflows through <a href="projects.html#aiwt">AI Worth Trying</a>. That still feels a little ridiculous. In a good way!</p></div><section class="about-links" aria-label="Explore the site"><a href="projects.html"><strong>Projects</strong><span>Apps, newsletters, and things I’m building.</span></a><a href="writing.html"><strong>Writing</strong><span>Experiments, practical guides, and what I’m learning about AI.</span></a><a href="work.html"><strong>Work</strong><span>My experience, skills, and education.</span></a><a href="interviews.html"><strong>Interviews</strong><span>Career conversations from GradSimple.</span></a></section>`;
}else if(page==='projects'){
 content=intro('Projects','Apps, newsletters, and other things I’ve built and run.')+`<section class="project-sequence" aria-label="All projects">${projects.filter(p=>['Independent','Experiments','Earlier'].includes(p.kind)).map(projectRow).join('')}</section>`;
}else if(page==='writing'){
 content=intro('Writing','I write about what I’m trying with AI, the things I’ve built, and what I’m figuring out along the way.')+`<div id="writing-list" class="writing-list"></div>`;
}else if(page==='writing-article'){
 content=document.querySelector('.writing-article').outerHTML;
}else if(page==='work'){
 content=intro('Work','Enterprise customer success, product adoption, and practical AI implementation.')+`<section class="cv-section"><h2>Experience</h2><article class="cv-job"><div class="job-heading"><h3><a href="https://knak.com/" target="_blank" rel="noopener">Knak</a></h3><span>Remote, Canada</span></div><div class="role-line"><strong>Senior Customer Success Manager</strong><span>Sep 2026–Present</span></div><div class="role-line"><span>Customer Success Manager</span><span>Feb 2025–Aug 2026</span></div><ul><li>Manage a <mark class="work-highlight">$2.4M ARR</mark> enterprise portfolio, including OpenAI, NVIDIA, and Logitech.</li><li>Achieved <mark class="work-highlight">147% net revenue retention</mark>, earning Knak’s 2026 Best Net Expansion Rate award.</li><li>Supported <mark class="work-highlight">OpenAI’s adoption of Knak’s API and MCP</mark> in partnership with Product and Engineering, contributing to 109% account expansion.</li><li>Negotiated an average 13% uplift on renewals in 2025–2026, the highest on the Customer Success team.</li><li>Secured renewals for 53% of at-risk accounts, leading the team in total accounts saved.</li><li>Built Glean and ChatGPT agents and a book-of-business command center used by the CS team and senior leadership, cutting account-planning time by an estimated 40% and personal monthly portfolio-review preparation by an estimated <mark class="work-highlight">90%</mark>.</li></ul></article><article class="cv-job"><div class="job-heading"><h3><a href="https://alloy.ai/" target="_blank" rel="noopener">Alloy.ai</a></h3><span>Remote, Canada</span></div><div class="role-line"><strong>Senior Customer Success Manager</strong><span>May 2024–Jan 2025</span></div><div class="role-line"><span>Customer Success Manager</span><span>Sep 2022–Apr 2024</span></div><ul><li>Achieved <mark class="work-highlight">120% NRR</mark> across a $2M ARR portfolio of US mid-market and enterprise customers.</li><li>Increased <mark class="work-highlight">NPS from 40 to 56</mark> by auditing platform usage, addressing customer pain points, and delivering tailored support plans.</li><li>Built cross-retailer dashboards that helped one customer save four hours per week on reporting.</li><li>Helped advance a complex enterprise implementation into its second phase through customer-metric mapping and tailored training guides.</li></ul></article><article class="cv-job"><div class="job-heading"><h3><a href="https://dreamlandgenesis.com/" target="_blank" rel="noopener">Genesis Labs</a></h3><span>Remote, Canada</span></div><div class="role-line"><strong>Alpha Analyst, Digital Assets</strong><span>Mar 2022 - Jul 2022</span></div><p class="role-description">Contract</p><ul><li>Delivered research reports, coaching, and presentations to help clients evaluate digital-asset projects and trading opportunities.</li><li>Managed a <mark class="work-highlight">10-person team</mark> of analysts, moderators, and marketing managers.</li><li>Evaluated NFT and digital-asset projects using market data, smart contracts, wallet activity, and community research; presented investment recommendations and market scenarios to senior management.</li></ul></article><article class="cv-job"><div class="job-heading"><h3>Pattern</h3><span>Vancouver, Canada</span></div><div class="role-line"><strong>Operations Analyst (Account Manager)</strong><span>Jun 2021–Mar 2022</span></div><p class="role-description">Now <a href="https://www.hireborderless.com/ca" target="_blank" rel="noopener">Borderless AI</a></p><ul><li>Managed 15 mid-market accounts through tailored onboarding and support.</li><li>Managed relationships with around 50 independent contractors during a high-growth period, scaling support capacity.</li><li>Streamlined hiring processes to achieve a <mark class="work-highlight">92.5% fill rate</mark>.</li></ul></article><article class="cv-job"><div class="job-heading"><h3><a href="https://www.communityphone.org/" target="_blank" rel="noopener">Community Phone</a></h3><span>Remote, Canada</span></div><div class="role-line"><strong>Customer Success Representative</strong><span>Mar–Jun 2021</span></div><ul><li>Achieved a <mark class="work-highlight">20% upsell close rate</mark>, above the company average, through personalized customer engagement.</li><li>Led implementation of an insurance product and its onboarding strategy.</li></ul></article><article class="cv-job"><div class="job-heading"><h3><a href="https://www.scdf.gov.sg/" target="_blank" rel="noopener">Civil Defence Academy</a></h3><span>Singapore</span></div><div class="role-line"><strong>CPR and First Aid Instructor</strong><span>Jun 2015–May 2017</span></div><ul><li>Presented CPR and first-aid training at corporate events with up to 200 participants.</li><li>Earned three Service Excellence Awards for first-responder presentations and client engagement.</li><li>Selected to lead CPR training for <mark class="work-highlight">Lee Hsien Loong</mark>, then Prime Minister of Singapore.</li></ul></article></section><section class="cv-section"><h2>Skills & tools</h2><dl class="skills-list"><div><dt>Customer work</dt><dd>Enterprise account management, success planning, executive business reviews, product adoption, renewals, negotiation, and churn recovery.</dd></div><div><dt>Enablement & delivery</dt><dd>Customer onboarding, tailored training guides, live presentations and workshops, and cross-functional implementation.</dd></div><div><dt>AI & implementation</dt><dd>Glean, ChatGPT, Codex, Claude, Dots, MCP integrations, and API-enabled workflows.</dd></div><div><dt>Tools I use</dt><dd>Salesforce, Tableau, GitHub, WordPress, Canva, and Google Workspace.</dd></div></dl></section><section class="cv-section"><h2>Education</h2><div class="job-heading"><h3>University of British Columbia</h3><span>2017 – 2021</span></div><p>Bachelor of Commerce, UBC Sauder School of Business</p><p>Major: Finance<br>Specialization: Financial Engineering and Risk Management</p><ul class="education-awards"><li>Graduated with Honors</li><li><mark class="work-highlight">Outstanding International Student Award</mark> ($12,000 for strong academic achievement and extracurricular contributions)</li><li>Dean’s Honor Roll (2019–2020)</li></ul></section>`;
}else{
 content=intro('Interviews',`I ask people about their careers, what the work is like, and how they got there. <mark class="interview-count">${interviewArchive.length} conversations and counting.</mark>`)+`<div id="interview-grid" class="interview-grid"></div><a class="small-button archive-visit" href="https://gradsimple.com/humans-of-gradsimple/">Browse the collection on GradSimple ↗</a>`;
}
if(page==='interviews'){
 const list=[...interviewArchive].sort((a,b)=>b.date.localeCompare(a.date));
 const rendered=list.map(x=>{
  const name=x.name.replace(/\s*\([^)]*(?:Check.In|2025)[^)]*\)/gi,'').trim();
  const first=name.toLowerCase().split(' ')[0];
  const context=[x.role||(!x.organization&&x.field?`Studied ${x.field}`:''),x.organization].filter(Boolean).join(' · ');
  return `<a class="interview-record" href="${E(x.url)}"><div class="archive-avatar"><img src="assets/${E(x.image)}" alt="Portrait of ${E(name)}" class="portrait-${E(first)}" loading="lazy" decoding="async" width="52" height="62"></div><div class="interview-record-copy"><div class="interview-record-heading"><h2><span class="interview-title">${E(name)} <span aria-hidden="true">↗</span></span></h2><time class="record-meta" datetime="${E(x.date)}">${new Intl.DateTimeFormat('en',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(x.date+'T00:00:00Z'))}</time></div>${context?`<p class="archive-role">${E(context)}</p>`:''}</div>${x.snippet?`<p class="archive-quote">“${E(x.snippet)}”</p>`:''}</a>`;
 }).join('');
 content=content.replace('<div id="interview-grid" class="interview-grid"></div>','<div id="interview-grid" class="interview-grid">'+rendered+'</div>');
}
if(page==='writing'){
 const date=new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Vancouver'});
 const list=[...writingArchive].sort((a,b)=>b.date.localeCompare(a.date));
 const rendered=list.map(p=>`<article class="writing-entry"><div class="writing-entry-copy"><h2><a href="writing/${E(p.slug)}.html">${E(p.title)}</a></h2><p>${E(p.subtitle)}</p></div><div class="writing-entry-meta"><time datetime="${E(p.date)}">${date.format(new Date(p.date))}</time><span>${p.readMinutes} min read</span></div></article>`).join('');
 content=content.replace('<div id="writing-list" class="writing-list"></div>','<div id="writing-list" class="writing-list">'+rendered+'</div>');
}

document.querySelector('main').innerHTML=sidebar+`<div class="combined-content site-content page-${page}">${content}${footer}</div>`;
}
// Static page rendering ends here; production HTML is generated from the same template.
const dialog=document.querySelector('dialog');let opener;
function imageGallery(shots,label,heading='Project images'){
 const chevron=direction=>`<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${direction<0?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}"/></svg>`;
 const multiple=shots.length>1;
 const toolbar=multiple?`<div class="gallery-toolbar" role="group" aria-label="Image navigation"><button type="button" data-gallery-step="-1" aria-label="Previous image" hidden>${chevron(-1)}</button><button type="button" data-gallery-step="1" aria-label="Next image">${chevron(1)}</button></div>`:'';
 const thumbnails=multiple?`<div class="gallery-thumbnails" aria-label="Choose image">${shots.map((shot,index)=>`<button type="button" data-gallery-index="${index}" aria-label="Show image ${index+1}: ${E(shot.title||shot.alt)}" aria-pressed="false"><img ${heroCropAttrs(shot)} src="assets/${E(shot.thumb||shot.src)}" alt="" width="64" height="76" loading="lazy" decoding="async"></button>`).join('')}</div>`:'';
 return `<section class="image-gallery" aria-label="${E(label)}" aria-roledescription="carousel" data-shots="${E(JSON.stringify(shots))}"><div class="gallery-heading"><h3>${E(heading)}</h3>${multiple?'<span class="gallery-position" aria-live="polite" aria-atomic="true"></span>':''}</div><figure class="gallery-figure"><div class="gallery-stage"><img class="gallery-image" alt="${E(shots[0].alt||shots[0].title||label)}" width="${E(shots[0].width)}" height="${E(shots[0].height)}" decoding="async" loading="eager"><p class="gallery-loading" role="status">Loading image…</p><button class="gallery-retry" type="button" hidden>Retry image</button></div><figcaption class="gallery-caption"></figcaption></figure>${multiple?`<div class="gallery-footer">${thumbnails}${toolbar}</div>`:''}</section>`;
}
function initGalleries(){
 dialog.querySelectorAll('.image-gallery').forEach(gallery=>{
  const shots=JSON.parse(gallery.dataset.shots),image=gallery.querySelector('.gallery-image'),stage=gallery.querySelector('.gallery-stage'),status=gallery.querySelector('.gallery-loading'),retry=gallery.querySelector('.gallery-retry');let index=0;
  function loaded(){status.hidden=true;retry.hidden=true;image.classList.remove('is-loading');}
  image.addEventListener('load',loaded);image.addEventListener('error',()=>{status.hidden=false;status.textContent='This image couldn’t load.';retry.hidden=false;image.classList.add('is-loading');});
  function show(next){if(next<0||next>=shots.length)return;index=next;const shot=shots[index];stage.scrollTop=0;stage.scrollLeft=0;image.classList.add('is-loading');status.textContent='Loading image…';status.hidden=false;retry.hidden=true;image.alt=shot.alt||shot.title||'';image.width=shot.width;image.height=shot.height;stage.classList.toggle('is-cropped-hero',!!shot.cropHeight);stage.style.aspectRatio=shot.cropHeight?`${shot.width} / ${shot.cropHeight}`:'';image.src='assets/'+shot.src;
   const position=gallery.querySelector('.gallery-position');if(position)position.textContent=`${index+1} of ${shots.length}`;gallery.querySelector('.gallery-caption').textContent=shot.caption||shot.title||'';
   const previous=gallery.querySelector('[data-gallery-step="-1"]'),following=gallery.querySelector('[data-gallery-step="1"]'),focused=document.activeElement;
   if(previous)previous.hidden=index===0;if(following)following.hidden=index===shots.length-1;
   if(focused===previous&&previous?.hidden)following?.focus({preventScroll:true});
   if(focused===following&&following?.hidden)previous?.focus({preventScroll:true});
   gallery.querySelectorAll('[data-gallery-index]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   const selected=gallery.querySelector('[data-gallery-index="'+index+'"]');if(selected){const rail=selected.parentElement;rail.scrollLeft=Math.max(0,selected.offsetLeft-(rail.clientWidth-selected.offsetWidth)/2);}
   if(image.complete&&image.naturalWidth)loaded();
  }
  gallery.addEventListener('click',event=>{const thumb=event.target.closest('[data-gallery-index]'),step=event.target.closest('[data-gallery-step]');if(thumb){show(Number(thumb.dataset.galleryIndex));gallery.querySelector('.gallery-heading').scrollIntoView({block:'start'});}if(step)show(index+Number(step.dataset.galleryStep));});
  retry.addEventListener('click',()=>show(index));
  let touchStart;
  stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'&&event.isPrimary&&!event.target.closest('button'))touchStart={id:event.pointerId,x:event.clientX,y:event.clientY};});
  stage.addEventListener('pointercancel',()=>{touchStart=null;});
  stage.addEventListener('pointerup',event=>{if(!touchStart||event.pointerId!==touchStart.id)return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));});
  gallery.addEventListener('keydown',event=>{if(shots.length<2)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
  show(0);
 });
}
function buildPromptPanel(p){
 if(!p.buildPrompt)return '';
 const tools=[['ChatGPT','https://chatgpt.com/'],['Claude','https://claude.ai/new'],['Gemini','https://gemini.google.com/app']];
 return `<section class="build-prompt-panel" aria-label="Build your own browser version"><div class="build-prompt-heading"><strong>Build your own browser version</strong><a href="${E(p.buildPrompt.download)}" download="huddledex-browser-build-prompt.txt">Save .txt</a></div><p>Take the working starter and make it your own.</p><div class="starter-links"><a href="build-prompts/huddledex-browser-starter.zip" download>Download starter code</a></div><div class="build-prompt-actions"><button type="button" class="copy-build-prompt"><img src="assets/icons/copy-prompt.svg" alt="" width="16" height="16"><span>Copy prompt</span></button>${tools.map(([name,url])=>`<a class="prompt-launch" data-prompt-tool="${name}" href="${url}" target="_blank" rel="noopener" aria-label="Copy prompt and open ${name}"><img src="assets/icons/${name.toLowerCase()}.svg" alt="" width="19" height="19"><span>Open in ${name}</span></a>`).join('')}</div><div class="prompt-preview"><p>Includes the working browser starter’s full source, adapted from my iPhone app. No personal notebook data.</p><details class="build-prompt-details"><summary>View full prompt</summary><label class="sr-only" for="build-prompt-text">HuddleDex browser build prompt</label><textarea id="build-prompt-text" readonly rows="10" spellcheck="false">${E(p.buildPrompt.text)}</textarea></details></div><p class="build-prompt-feedback" role="status">Tool buttons copy the prompt, then open a new tab. Paste it there to start.</p></section>`;
}
function outcomeMarkup(result){
 const text=E(result),lead=text.match(/^((?:(?:About|Around|Over|Nearly)\s+)?(?:C?\$)?\d[\d,.]*(?:%|\+)?(?:\s+per\s+(?:year|month))?)/);
 return lead?`<strong>${lead[1]}</strong>${text.slice(lead[1].length)}`:text;
}
function projectOutcomes(p){
 if(!p.outcomes?.length)return '';
 return `<section class="project-outcomes" aria-label="${E(p.title)} outcomes"><h3>Outcomes</h3><ul>${p.outcomes.slice(0,3).map(result=>`<li>${outcomeMarkup(result)}</li>`).join('')}</ul>${projectMeasurement(p)}</section>`;
}
function projectMeasurement(p){
 const measurement=p.measurement;if(!measurement)return '';
 return `<details class="project-measurement"><summary>${measurement.kind==='cost'?'Cost comparison':'How I estimated the time saving'}</summary><div>${measurement.notes.map(note=>`<p>${E(note)}</p>`).join('')}${measurement.sourceUrl?`<p><a href="${E(measurement.sourceUrl)}" target="_blank" rel="noopener">${E(measurement.sourceLabel)}</a> · Checked ${E(measurement.checkedDate)}</p>`:''}</div></details>`;
}
function projectVisibility(p){
 if(!p.visibility?.length)return '';
 return `<section class="project-section"><h3>Search & AI visibility <small>${E(p.visibilityPeriod)}</small></h3><ul class="visibility-list">${p.visibility.map(result=>`<li>${E(result)}</li>`).join('')}</ul><p class="visibility-period">January 1 to November 5, 2026</p></section>`;
}
function projectTools(p){
 if(!p.relatedTools?.length)return '';
 return `<details class="project-section project-tool-section"><summary>Career tools <span>(${p.relatedTools.length})</span></summary><ul class="project-tools">${p.relatedTools.map(tool=>`<li><a href="${E(tool.url)}" target="_blank" rel="noopener">${E(tool.title)} <span aria-hidden="true">↗</span></a><p>${E(tool.description)}</p></li>`).join('')}</ul></details>`;
}
function projectWorkflows(p){
 if(!p.workflows?.length)return '';
 return `<section class="project-section project-workflows"><h3>Behind the scenes</h3>${p.workflows.map(workflow=>`<details class="project-workflow"><summary>${E(workflow.title)}</summary><div class="workflow-body">${workflow.paragraphs.map(paragraph=>`<p>${E(paragraph)}</p>`).join('')}${workflow.image?`<figure class="workflow-image"><img src="assets/${E(workflow.image.src)}" alt="${E(workflow.image.alt)}" width="${E(workflow.image.width)}" height="${E(workflow.image.height)}" loading="lazy" decoding="async"></figure>`:''}${workflow.codeUrl?`<a href="${E(workflow.codeUrl)}" target="_blank" rel="noopener">${E(workflow.codeLabel||'View code')} ↗</a>`:''}</div></details>`).join('')}</section>`;
}
function openProject(p,button){
 const story=p.story||[p.desc],introCount=p.readerLeadCount||2;
 opener=button;dialog.classList.toggle('flagship-dialog',p.id==='gradsimple');dialog.classList.toggle('huddle-dialog',p.id==='huddle');dialog.classList.toggle('project-visual-dialog',!!p.previewImages?.length);
 document.querySelector('#detail').innerHTML=`<header class="project-overview"><h2 id="detail-title" tabindex="-1">${E(p.title)}</h2><p class="project-summary">${E(p.desc)}</p>${p.url||p.codeUrl?`<div class="project-access-links">${p.url?`<a class="project-visit" href="${E(p.url)}" target="_blank" rel="noopener">${E(p.urlLabel||'Visit the site')} ↗</a>`:''}${p.codeUrl?`<a class="project-code" href="${E(p.codeUrl)}" target="_blank" rel="noopener">${E(p.codeLabel||'View code on GitHub')} ↗</a>`:''}</div>`:''}${projectOutcomes(p)}${!p.outcomes?.length?projectMeasurement(p):''}</header><div class="project-story project-lead">${story.slice(0,introCount).map(paragraph=>`<p>${E(paragraph)}</p>`).join('')}</div>${p.screenshots?.length?imageGallery(p.screenshots,p.title+' app screenshots','Inside the app'):''}${p.previewImages?.length?imageGallery(p.previewImages,p.title+' images'):(p.image?`<img src="assets/${E(p.image)}" alt="${E(p.title)} screenshot">`:'')}${story.length>introCount?`<div class="project-story project-continuation">${story.slice(introCount).map(paragraph=>`<p>${E(paragraph)}</p>`).join('')}</div>`:''}${projectVisibility(p)}${projectTools(p)}${projectWorkflows(p)}${p.eventStory?`<div class="project-story huddle-event-story">${p.eventStory.map(paragraph=>`<p>${E(paragraph)}</p>`).join('')}</div>`:''}${p.gallery?.length?imageGallery(p.gallery,p.title+' event photographs','At the event'):''}${p.links?.length?`<div class="project-story-links">${p.links.map(link=>`<a href="${E(link.url)}">${E(link.label)} ↗</a>`).join('')}</div>`:''}${p.accessNote?`<p class="project-access">${E(p.accessNote)}</p>`:''}${buildPromptPanel(p)}`;
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.querySelector('#detail').scrollTop=0;initGalleries();dialog.querySelector('#detail-title').focus({preventScroll:true});
 const copy=dialog.querySelector('.copy-build-prompt');
 if(copy){
  async function copyPrompt(tool){
   const feedback=dialog.querySelector('.build-prompt-feedback');
   try{await navigator.clipboard.writeText(p.buildPrompt.text);copy.querySelector('span').textContent='Copied!';feedback.textContent=tool?`Prompt copied. Paste it into ${tool} to start.`:'Prompt copied. Paste it into your favourite AI coding tool.';}
   catch{const details=dialog.querySelector('.build-prompt-details'),field=dialog.querySelector('#build-prompt-text');details.open=true;field.focus();field.select();feedback.textContent='Copy the selected prompt, then paste it into your AI tool.';}
  }
  copy.addEventListener('click',()=>copyPrompt());
  dialog.querySelectorAll('[data-prompt-tool]').forEach(link=>link.addEventListener('click',()=>copyPrompt(link.dataset.promptTool)));
 }
}
const projectNavigation=page==='projects'?createProjectNavigation({browser:window,projects,show:openProject,hide:()=>dialog.close(),findOpener:p=>document.querySelector(`[data-project="${p.id}"]`)}):null;
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-project]');if(!b)return;const p=projects.find(x=>x.id===b.dataset.project);if(p){e.preventDefault();if(projectNavigation)projectNavigation.open(p,b);else openProject(p,b);}
});
function closeProject(){if(projectNavigation)projectNavigation.close();else dialog.close();}
dialog.querySelector('.close').addEventListener('click',closeProject);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
// Fragment navigation can move focus after the initial dialog opens.
function restoreReaderFocus(){if(dialog.open&&!dialog.contains(document.activeElement))dialog.querySelector('#detail-title').focus({preventScroll:true});}
window.addEventListener('pageshow',restoreReaderFocus);
window.addEventListener('hashchange',restoreReaderFocus);
// Keep keyboard navigation within the reader, including its collapsible prompt.
dialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter(element=>{
  const closedDetails=element.closest('details:not([open])');
  return (!closedDetails||element===closedDetails.querySelector('summary'))&&element.getClientRects().length&&getComputedStyle(element).visibility!=='hidden';
 });
 const first=focusable[0],last=focusable[focusable.length-1];
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
});

const themeButtons=document.querySelectorAll('[data-theme-toggle]');
function syncThemeButtons(){
 const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
 themeButtons.forEach(button=>{button.setAttribute('aria-label',`Switch to ${next} mode`);button.title=`Switch to ${next} mode`;});
}
themeButtons.forEach(button=>button.addEventListener('click',()=>{
 const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 document.documentElement.dataset.theme=theme;try{localStorage.setItem('tyler-theme',theme);}catch{}syncThemeButtons();
}));syncThemeButtons();

// A full-height mobile sheet; desktop and no-script navigation remain visible.
const mobileNavButton=document.querySelector('.mobile-nav-toggle');
const primaryNavigation=document.querySelector('#primary-navigation');
const mobileHeader=document.querySelector('.combined-sidebar');
const pageContent=document.querySelector('.site-content');
const mobileNavQuery=window.matchMedia('(max-width:640px)');
if(mobileNavButton&&primaryNavigation){
 document.body.dataset.mobileNavReady='';
 let navigationCloseTimer;
 function setMobileNavigation(open,restoreFocus=false,immediate=false){
  clearTimeout(navigationCloseTimer);
  const expanded=mobileNavQuery.matches&&open;
  mobileNavButton.setAttribute('aria-expanded',String(expanded));
  mobileNavButton.setAttribute('aria-label',expanded?'Close navigation':'Open navigation');
  if(pageContent)pageContent.inert=expanded;
  if(!mobileNavQuery.matches){
   primaryNavigation.hidden=false;primaryNavigation.inert=false;
   delete document.body.dataset.mobileNavState;
  }else if(expanded){
   primaryNavigation.hidden=false;primaryNavigation.inert=false;
   document.body.dataset.mobileNavState='opening';
   requestAnimationFrame(()=>{if(mobileNavButton.getAttribute('aria-expanded')==='true')document.body.dataset.mobileNavState='open';});
  }else{
   primaryNavigation.inert=true;
   const finish=()=>{primaryNavigation.hidden=true;delete document.body.dataset.mobileNavState;};
   if(!immediate&&!primaryNavigation.hidden&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.body.dataset.mobileNavState='closing';
    navigationCloseTimer=setTimeout(finish,260);
   }else finish();
  }
  if(restoreFocus)mobileNavButton.focus();
 }
 mobileNavButton.addEventListener('click',()=>setMobileNavigation(mobileNavButton.getAttribute('aria-expanded')!=='true'));
 primaryNavigation.addEventListener('click',event=>{if(event.target.closest('a'))setMobileNavigation(false);});
 document.addEventListener('pointerdown',event=>{if(event.target===primaryNavigation||!mobileHeader.contains(event.target))setMobileNavigation(false);});
 document.addEventListener('keydown',event=>{
  if(mobileNavButton.getAttribute('aria-expanded')!=='true')return;
  if(event.key==='Escape'){event.preventDefault();setMobileNavigation(false,true);}
  if(event.key==='Tab'&&!event.shiftKey&&document.activeElement===primaryNavigation.querySelector('a:last-child'))setMobileNavigation(false);
 });
 mobileHeader.addEventListener('focusout',event=>{if(!mobileHeader.contains(event.relatedTarget))setMobileNavigation(false);});
 mobileNavQuery.addEventListener('change',()=>setMobileNavigation(false,false,true));
 setMobileNavigation(false,false,true);
}
