# Tyler Yip: Projects

### GradSimple

[Project story](projects.html#gradsimple)

I run GradSimple, where I interview people about their careers, write a newsletter, and build career tools. I like getting past the job title and into how someone actually got there. These days, I’m also exploring how AI is changing our work and how we can use it ourselves.

Outcomes
- 7,259 newsletter subscribers
- 43,860 annual active website users, up 102% year over year
- Sponsored by Lovable, HubSpot, Webflow, Morning Brew, and 1440.

#### Search & AI visibility (2026 YTD)

January 1 to November 5, 2026:
- 1M+ Google Search impressions (Search Console exact total: 1,003,957)
- 134.8K Bing search impressions (All search sources)
- 66K citations across Microsoft Copilot and partners

Search impressions and AI citations are separate platform measures, not unique people or website visits. Counts from Bing are rounded platform displays.

#### Career tools

- [Career Explorer](https://career-explorer-ecru.vercel.app/): O*NET’s career data, with an interface that feels a little less early 2000s.
- [Starting Pay Checker](https://starting-pay-checker.vercel.app/): An easier way to find and compare pay, especially when starting out.
- [Job Market Radar](https://job-market-radar.vercel.app/): Monthly BLS hiring data, made easier to explore and compare across industries.
- [How Cooked Is Your Career?](https://career-cooked-check.base44.app/): A seven-question career check-in with a “cooked score.” An early Base44 experiment.

#### Behind the scenes

##### Career Intelligence MCP

I also built a Career Intelligence MCP so those stories and data could be useful inside an AI conversation. It lets an assistant search GradSimple’s public interviews, guides, and statistics, then link back to the sources. I wanted people to be able to ask a question and explore the relevant material without digging through the whole site themselves.

##### Reddit research & drafting

I used to find Reddit posts and type out all the comments manually. Then I started using an LLM to help draft replies, and eventually automated the workflow with Codex.

It worked super well and saved me from arthritis in my fingers haha. For a good three months, it was a well-oiled machine that helped grow GradSimple’s subscriber list!

My account ended up getting banned in August, which brought that experiment to an end.

[View Reddit Scout on GitHub](https://github.com/tyleroars/reddit-scout)

[Open project](https://gradsimple.com)

### HuddleDex

[Project story](projects.html#huddledex)

I was going to Knak’s Agentic Marketing Forum and had an idea the day before. At events, you meet people, have a good conversation, maybe connect on LinkedIn. But afterward, how much do you actually remember? Their name, what you talked about, that thing you said you’d send them?
I wanted a way to save that context while it was fresh. Scan someone’s badge for their details, take a photo of them or a selfie together, and record a quick voice note instead of typing everything out. The app could transcribe it and keep the conversation, photo, and follow-up attached to the person and event.
They could also scan my QR to get my digital card and save my contact, and I could share our photo so we both had a record of meeting. They wouldn’t need to download the app for that. So I vibecoded HuddleDex, got it onto my iPhone, and took it with me the next day.
I tried it out at the forum, including having people scan my QR for my digital business card. It was fun to actually use something I’d built the day before!
I also found things I’d missed pretty quickly. Someone asked for my phone number, but my digital card didn’t have it. I went to add it and realized I hadn’t even built a phone-number field. So I couldn’t update it lol.

Outcomes
- Built the day before the event and used it at Knak’s Agentic Marketing Forum
- Attendees scanned my QR to save my digital business card

[Open project](huddledex-browser/)
[Browser adaptation](huddledex-browser/)
[Browser starter ZIP](build-prompts/huddledex-browser-starter.zip)
The original iPhone app is not publicly distributed. The browser adaptation omits native OCR, on-device transcription, maps, hosted profiles and QR services.

### AI Worth Trying

[Project story](projects.html#aiwt)

I built AI Worth Trying to make it easier to go from “I should try AI for this” to actually doing it. It’s a searchable collection of practical tasks, prompts, and workflows, mostly for marketing work. Start with something you need to get done and find a way to try it!
I wanted each task to give you enough context to use it: what to provide, how to run the prompt or workflow, and what the output should look like. That structure is a big part of the project. A prompt is much easier to try when you know what to put in and what you’re aiming to get out.

[Open project](https://aiworthtrying.com)

### Tone Lab

[Project story](projects.html#tone)

I’m an amateur photographer and shoot with a Fujifilm camera. I’d mostly been relying on Fuji recipes, but wanted to dabble in post-processing too!
A lot of the editing software I looked at was expensive, required a subscription, or had loads of bells and whistles I didn’t need. I wanted something tailored to my taste, so I decided to see if I could build my own.
Tone Lab lets me try different looks, tweak the light and colour, compare versions, and export the ones I like. It all runs in the browser, with the photos staying on my device.

[Open project](https://tonelab-darkroom.thetyleryip.chatgpt.site)

### Vibe Coding Hackathon Vancouver (Sponsored by Codex)

[Project story](projects.html#hackathon)

I signed up for my first AI vibe coding hackathon in Vancouver in May 2026 without a team or a coding background. That morning, I met a tech lead, a data engineer, and a network-security student, and we teamed up. We had about six hours to build something!
We made a career-path visualizer that took your résumé and answers to four questions, then suggested three possible paths using O*NET salary and job data and more than 100 GradSimple professional profiles. I built with Codex while my teammates helped work through the technical choices.
Our live demo was shaky, and we didn’t win, but we got special recognition for UI/UX and product. One of the judges even told me afterward that it was his number-one pick!
We never ended up releasing it, though. It was still too expensive to run and needed more work before people could reliably use it.

Outcomes
- Built a working career-path demo with my team in about six hours
- Received special recognition for UI/UX and product

### Career Explorer

[Project story](projects.html#career)

O*NET has so much useful career data, but I hated the UI/UX. It feels like it hasn’t been updated since the early 2000s!
I built Career Explorer so I could browse that data through an interface I actually wanted to use. You can search for careers and filter by things like education, pay, and field.

[Open project](https://career-explorer-ecru.vercel.app/)

### Starting Pay Checker

[Project story](projects.html#pay)

I built this for GradSimple subscribers who wanted an easier way to see what different jobs pay, especially when they’re starting out. Entry-level pay is surprisingly hard to find online!
Starting Pay Checker lets you filter and compare roles using BLS wage data, with a focus on the lower end of the pay range as a reference for starting out.

[Open project](https://starting-pay-checker.vercel.app/)
[Public source code](https://github.com/tyleroars/starting-pay-checker)

### Job Market Radar

[Project story](projects.html#radar)

I built Job Market Radar to make monthly BLS hiring data easier to explore. You can compare industries in one place instead of digging through the source tables.
Each view shows which month the data covers, so you can see how recent the numbers are while comparing what’s happening across sectors.

[Open project](https://job-market-radar.vercel.app/)

### Image Optimizer

[Project story](projects.html#image)

I kept running into limits with free image apps, so I decided to just build my own. No ads either!
It resizes and compresses images and handles animated GIFs in the browser. I built it with email images in mind.

[Open project](https://gradsimple-image-optimizer.netlify.app/)

### Slides → Video

[Project story](projects.html#slides-converter)

I built this to turn TikTok slides into videos I could reuse on YouTube. Pick the images, set how long each slide should stay on screen, and export a video.
It accepts individual images or a ZIP, lets you reorder the slides, and runs in the browser. MP4 export depends on browser support, with WebM as a fallback.

[Open project](https://glowing-cajeta-86ab7f.netlify.app/)

### Newsletter Converter

[Project story](projects.html#newsletter)

Kit didn’t have an easy way to display archived newsletters the way I wanted, so I built a converter to bring them into WordPress.
It converted the newsletter HTML into an article I could publish on the website. I’d check the output and embeds, then publish it. I don’t use it anymore.

[Open project](https://tyleroars.github.io/my-tools/jm5-converter.html)
[Public source code](https://github.com/tyleroars/my-tools)

### The Frenz

[Project story](projects.html#the-frenz)

I co-founded The Frenz in 2021. I was the head analyst and worked on research, financials, and partnerships.
We were also developing an NFT collection with Hozer, an artist based in Korea. A mutual friend from college who was active in Web3 introduced us! We worked together on the characters, while the team built out the lore, community activities, Discord mechanics, and launch plans.
We chose not to launch the collection after the NFT market shifted.

Outcomes
- Around 1,500 Discord members at its peak

### How Cooked Is Your Career?

[Project story](projects.html#career-quiz)

I tried a more playful format for a GradSimple career check-in: seven quick questions and a “cookedness” result. This was one of my early Base44 builds!
It asks about things like Sunday-night dread, whether you use your skills at work, and how you feel about your future. Answer the questions and it gives you a score out of 100. The version linked here is the original Base44 build.

[Open project](https://career-cooked-check.base44.app/)

### Kawaii Peach

[Project story](projects.html#kawaii-peach)

Grace and I both lost our internships when the pandemic hit in 2020. Neither of us knew ecommerce, but we decided to start an online store anyway! We ran Kawaii Peach from March 2020 to March 2021, figuring out products, pricing, the storefront, and customer service as we went.
A lot of the work was getting people to find us. We planned the Instagram feed, worked on the content, ran ads, and tracked how posts and stories performed. Our social content had a 7% engagement rate!
We also worked on SEO, getting pages onto the first page of Google.
We both ended up using the experience to help land our first jobs.

Outcomes
- Over $30,000 in sales
- Nearly 10,000 followers across Instagram and Facebook within three months
- Top 1% for traffic among Shopify stores launched in the same month

[Open project](https://web.archive.org/web/20201125200531/https://kawaiipeach.com/)
