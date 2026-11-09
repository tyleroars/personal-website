# WTF is... a context window vs. a rate limit?

By Tyler Yip · 2026-07-07

It's something I kind of knew, but also not really.

Sup champ,

I’ve been couch-ridden the past 2 weeks, fighting a *nasty *virus. I could not go 10 seconds without hacking my lungs out.

Falling asleep - and staying asleep - has been borderline impossible. So beyond trying not to sound like I have tuberculosis on client meetings and doing the bare minimum to keep my job, I’ve done absolutely nada.

I’ve actually had this spare draft sitting in queue for over a week. The only thing missing was literally a subject line, preview text, and an intro. But, I just couldn’t do it.

I’m finally better now. So:

## WTF is...  a context window vs. a rate limit?

If you've spent enough time with Claude, you've probably hit some kind of wall without really knowing why. A message telling you to wait. Or Claude starting to give worse answers mid-conversation, forgetting things you'd already covered. Frustrating either way, but they're actually caused by completely different things.

To understand any of it, you need to know what tokens are. Tokens are how AI measures text. Every word, punctuation mark, and space gets broken into small chunks called tokens. About 750 words equals roughly 1,000 tokens. Every limit Claude has is measured in them.

The context window is how many tokens Claude can hold in memory within a single conversation. Claude's is 200,000 tokens, roughly 150,000 words. Think of it like a whiteboard with a fixed amount of space. As your conversation grows, older parts start falling off the edge and Claude can't see them anymore. That's why it sometimes starts suggesting something you already told it not to do, or asks you to clarify something you covered an hour ago.

When a conversation gets long enough, Claude automatically compresses the earlier parts to free up room. What that means is Claude replaces older messages with a condensed summary. Some specific details, like an instruction you gave early on, might survive or might get summarized away. That's why after a long session Claude can start behaving slightly differently than it was at the start.

Rate limits are a different thing entirely. A rate limit is just a cap on how frequently you can use something within a given time period. Every app and website has them. Your whole Claude account, [Claude.ai](https://Claude.ai), Claude Code, Cowork, all of it pulls from the same bucket. On Claude Pro you get a certain number of messages every 5 hours. Hit that ceiling and you wait. Short messages stretch your limit further. Long conversations with big files eat through it faster.

I've hit both more times than I'd like to admit. At least now you know the difference!

[Read on Tyler’s site](wtf-is-a-context-window-vs-a-rate-limit.html)
