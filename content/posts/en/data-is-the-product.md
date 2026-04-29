---
title: Data Is the Product
slug: data-is-the-product
lang: en
summary: An observation that started with a floating-lyrics music player. As scheduling, scaffolding, engineering, and interfaces all collapse into AI, the three lines software has always run on — processing, providing, and producing data — are heading for very different fates.
thesis: Processing is being flattened by general-purpose models, producing is being internalized by base models, and only providing data survives — because data accumulation is a time and network-effect problem, not a compute problem. Engineering is depreciating; data is appreciating.
published_at: 2026-04-29
updated_at: 2026-04-29
keywords:
  - product strategy in the AI era
  - data moat
  - general-purpose models
  - vertical agents
  - network effects
stance: working
person_snapshot:
  - I believe the most important question for building a product in the AI era is not "what can I do with AI?" but "what do I have that AI cannot produce on its own?"
---

# Data Is the Product

When scheduling, scaffolding, engineering, and interfaces can all be competently handled by AI, what is a product actually selling?

## A Music Player

It started with a minor annoyance. NetEase Cloud Music — the dominant streaming platform in China — does not support floating lyrics on desktop the way I wanted. It can display the current lyric line in the status bar, and it has a desktop lyrics mode, but the styling is ugly and inflexible. So I used NowPlaying CLI to build a floating lyrics overlay on top of the app.

But NetEase's playback state reporting to NowPlaying was unreliable. Constant sync issues — lyrics drifting out of alignment, playback events arriving late or not at all. After fighting with it for too long, I decided to skip the workaround entirely and build my own player.

I found a reverse-engineered NetEase API. Song data, lyrics, per-syllable timestamps — everything pulled directly from their servers. My job was simple: consume that data, add some custom fields for my own display preferences, and render it the way I wanted.

The whole project took about a day from idea to working player. Every line of code I wrote — the UI framework, the floating window logic, the playback controls, the lyrics scroll, the custom metadata fields — could be regenerated in two hours by Claude Code in 2026. None of it constitutes a barrier. Anyone who can write a prompt could replicate the entire engineering layer.

But the data cannot be replicated. If the API did not exist — if I had to source song files myself, scrape lyrics from the internet, align per-syllable timestamps by hand for tens of thousands of tracks — this would not be a one-person project. It would not be a ten-person project. NetEase spent over a decade building its music catalog: licensing copyrights, cultivating a community that contributes line-by-line lyrics, employing teams that create professional timestamp annotations. This accumulated data asset is the entire foundation on which my one-day project stands. Without it, my code does nothing.

This experience made me pay attention to something I had not articulated before: **when engineering becomes nearly free, where does a product's value actually reside?**

This was not a hypothetical question. I ran into the exact same structure in my professional work.

I had been building an internal data analysis agent for the company I work at — a conversational interface where business users could ask questions in natural language and get charts and insights. The backend connected to the company's production database, Google Ads, and GA4. A single-agent architecture with a Python sandbox for query execution and visualization, a three-layer knowledge system that made the agent progressively smarter about the team's business vocabulary, workspace replay to recover state across sessions, RBAC for table-level permissions, and a dashboard system where conversational insights could be pinned and promoted into self-refreshing panels. I spent a long time on it. It worked well. The team started relying on it.

Then I tested the same workflow with Claude Code. I gave it API credentials to the same data sources and asked it the same questions.

It performed better.

Every piece of infrastructure I had carefully built — the knowledge system, the sandbox security model, the context compression, the workspace state management, the schema preloading — all of it existed to mediate between the user and the data. But Claude Code did not need mediation. It understood the intent directly, queried the data sources directly, and returned results directly. Every layer of abstraction I had added was friction the general-purpose model did not need.

But the data sources themselves — the production database, the ad platform metrics, the user behavior events — those did not appear out of thin air just because Claude Code was more capable. The general-purpose model won on processing ability. But it had no data of its own. If my agent had any value, that value resided not in the code I wrote, but in the data it connected to.

Same structure as the music player. Code is replaceable. Data is not.

This observation sent me down a line of thinking that I want to lay out here. I started re-examining every software product I could think of, looking at its relationship with data. What I found is that these relationships fall into three categories — and that these three categories correspond, roughly but meaningfully, to three eras of the software industry.

## Three Lines

A product's relationship with data takes one of three forms. A single product can operate along more than one of these lines simultaneously, but the underlying logic of each is distinct:

**Processing data** — the product offers some form of computational transformation. Users bring their own data in, the product applies algorithms or tools to improve it, and users leave with a better version of what they came with.

**Providing data** — the product holds data assets internally. Users come to the product to consume data they cannot find elsewhere.

**Producing data** — the product generates content from scratch based on user intent. Users arrive with an idea — sometimes just a vague one — and leave with something that did not exist before.

These are not a flat taxonomy. They have a historical sequence. The center of gravity of the software industry has migrated along the path from processing to providing to producing, and each migration corresponds to a shift in the underlying technological paradigm. Understanding the sequence is necessary to understand what is happening now.

## Processing Data: The Oldest Software Logic

Software was invented to process data. That is, in a sense, the most literal possible definition of what software does.

The spreadsheet let people calculate. The word processor let people edit text. Photoshop let people manipulate images. Premiere let people cut video. AutoCAD let people draft structures. MATLAB let people model systems. The common feature of all these tools is that **they contain no content of their own. The content comes from the user.** The user brings numbers, brings text, brings images, brings footage, brings measurements, and the software helps transform those inputs into something more structured, more polished, more presentable. Then the user takes the output and leaves.

Nearly all pre-internet software operated on this line. The entire Office suite. The entire Adobe suite. Every desktop application that was not a game. They were sold as tools — the value proposition was processing power. "I can help you do what you are already doing, but faster, more accurately, and with better output." The user's data is the input. The software's processing capability is the service. The improved data is the output.

This logic dominated from the personal computer era through the early internet. Its business model was clean: one-time purchase or subscription, selling access to a tool's capabilities. Its moat was engineering complexity. Writing an image editor that handles edge cases gracefully, an electronic spreadsheet engine that does not crash on large datasets, a video editing suite that responds in milliseconds — these require enormous engineering effort accumulated over years. That accumulated effort was the barrier to entry.

But this barrier rests on a premise: **engineering complexity cannot be quickly replicated.**

For the past thirty years, this premise has mostly held. Building a Photoshop competitor from scratch required hundreds of engineers working for years. Adobe's moat was deep not because image editing is theoretically hard, but because the accumulated engineering — color management, file format support, plugin architecture, performance optimization across hardware configurations, decades of edge case handling — was practically impossible to reproduce.

This premise is now being eroded. Not by a competing company, but by AI. I will come back to this.

## Providing Data: What the Internet Was Really About

The internet changed everything. But the thing it truly changed is not what most people think. "Connection" is the standard narrative — the internet connected people, connected information, connected markets. But connection is infrastructure. It is the pipe, not the water.

What the internet actually made possible was a new kind of business: one whose primary value is not processing the user's data, but **owning data that the user wants to access.** The internet turned "providing data" into an independent, monopolizable business model at a scale that was physically impossible before.

Data providers existed before the internet, of course. Encyclopedias, phone books, libraries, newspapers — these were all in the business of providing data. But their distribution was physically constrained, their update cycles were slow, and their monopoly power was limited by geography. The internet removed all of these constraints. A platform that accumulated enough data could provide it to the entire world at zero marginal cost. And once it did, the network effects kicked in.

The last twenty years of internet competition have been, at their core, a fight to establish data monopolies in different domains.

Google monopolized search indexes. What you can find on the internet is determined by what Google's crawlers have indexed and what its algorithms choose to surface. Facebook monopolized social graphs. Your relationships exist in digital form on its servers — a mapping of who you know, who you interact with, how often, and in what context. YouTube and Bilibili monopolized video content. Creators publish there, viewers watch there, and the platform collects rent from both sides. NetEase Cloud Music and Spotify monopolized music catalogs. What songs you can listen to depends on what licensing deals they have signed with labels and publishers. LinkedIn monopolized professional identity. Your resume, your network, your career history, your skills endorsements — all stored as structured data in its databases. Xiaohongshu (China's lifestyle content platform) monopolized a particular flavor of UGC — you want to find a good restaurant, you go there and read what other people recommend.

The moat around each of these businesses is not technology. Google's search algorithm is very strong, but Bing's is not far behind — the real difference is that Google has crawled and indexed vastly more of the web. YouTube's recommendation system is very good, but TikTok's might be better — the real difference is that YouTube has a deeper content library built over almost two decades of creator uploads. Technology is a necessary condition, but it is not the sufficient one. **Data is the moat.**

The business logic of providing-data companies is fundamentally different from processing-data companies. Processing-data companies sell capability — the ability to transform. Providing-data companies sell access — the ability to reach information that does not exist elsewhere. The moat for processing is engineering complexity. The moat for providing is **network effects and time accumulation.** More users generate more data, more data attracts more users. Once this flywheel reaches critical mass, latecomers face an almost insurmountable deficit.

My music player is a perfect small-scale demonstration of this dynamic. I built the entire engineering layer in a day. But I am completely parasitic on NetEase's data layer. They spent over a decade accumulating that catalog. If I tried to replicate the data rather than the code, I would fail entirely. The code is trivially reproducible. The data is not.

If the processing era's war was "whose engineering is better," the providing era's war is "whose data is bigger" — or, more precisely, "who has the most data settling inside their walls." And the winner-take-all dynamics of the latter are far more extreme than the former. You can comfortably use three different word processors. You are unlikely to maintain active presences on three different social networks, and you are even less likely to run the same team on both Slack and Discord.

But there is a class of products on this line that is easy to overlook, because they provide not the platform's own data, but the user's.

Notion, Slack, Discord, Google Drive, GitHub — these products do not own content. They do not transform content. They do not generate content. What they do is **host the user's data and provide organizational infrastructure around it.** The notes you write in Notion come out the same way they went in. Notion does not make your notes better (that would be processing), does not show you other people's notes (that would be providing third-party data), and does not write notes for you (that would be producing). It gives your data a structured home — databases, relations, views, permissions, collaboration. Slack works the same way: your messages are organized by channel, thread, and timeline, making them consumable by your team in real time. Ownership of the data stays with you. The product handles distribution and persistence.

These products look very different from Netflix or Spotify on the surface, but on one critical dimension they stand on the same side: **their moats are not in engineering, but in data.** Netflix's moat is its content library — leave Netflix and you lose access to those shows. Notion's moat is not the data itself — you can export every page — but the organizational structure, usage habits, team collaboration patterns, and migration cost that have formed around the data. A team that has used a Notion workspace for two years, with thousands of pages, dozens of databases, and countless relations and formulas, will not switch to a functionally identical competitor. Not because they cannot move the data, but because they cannot move the structure.

So "providing data" actually has two subtypes. One is platforms holding third-party data assets — content libraries, UGC pools, search indexes — where the moat is content accumulation and licensing. The other is platforms hosting users' first-party data — notes, messages, code, files — where the moat is migration cost and network effects. The ownership models differ, but the conclusion on "what will not be flattened by AI" is the same. AI can replicate Notion's editor and Slack's interface in a matter of days. It cannot replicate two years of a team's accumulated data, organizational decisions, and collaboration topology inside those products. The engineering is replaceable. The data is not — regardless of whether it belongs to the platform or to the user.

## Producing Data: The Third Road

Then AI opened a third road — not processing existing data, not providing existing data, but generating data that did not previously exist.

The word "generative" in "generative AI" is doing exactly this work. A user arrives with nothing in hand — no draft, no raw material, no half-finished artifact. They have only an idea, sometimes not even a fully formed one. The model takes that idea and produces a piece of text, an image, a video, a piece of code, a musical composition. The output is new. It is not a transformation of something the user already had (that would be processing). It is not a retrieval from a pre-existing collection (that would be providing). It is creation from description.

This is genuinely without precedent in software history.

Processing tools require the user to bring raw material — you need a photo before you can edit it. Providing platforms require pre-accumulated content — you need a music catalog before you can run a streaming service. But producing-data products need neither. They create from void. An AI video tool takes a user's description, invokes a model, and outputs a video that has never existed before. The user takes that video and distributes it on social media. The product itself does not accumulate content assets — each interaction is a standalone act of production.

This is why AI startups exploded after 2023. The barrier to entry on the producing-data line is remarkably low. You do not need decades of engineering accumulation the way processing-data products do. You do not need years of data monopoly-building the way providing-data products do. You need an API key to a large model, a UI layer on top, and some workflow logic. You can start selling on day one.

But low barriers to entry mean low barriers to competition. Which leads directly to the sharpest question of the current moment.

## What Gets Flattened and What Doesn't

All three lines coexist in today's product ecosystem. But they are experiencing very different fates.

### Processing is being eaten by general-purpose models.

This is the first line to fall. The core value proposition of processing-data products has always been "my algorithm does this better than you could do it manually" — faster formatting, more precise image manipulation, smarter data cleaning, better layout engines. But when a general-purpose model can directly understand the user's intent and execute the transformation, those carefully engineered specialized algorithms become an unnecessary middle layer.

You do not need a dedicated image editing application to adjust color temperature when you can tell a model "make this photo warmer" and get the result. You do not need a specialized data cleaning tool when you can hand a messy CSV to a model and tell it what structure you want. You do not need a presentation design tool to handle typography and layout when you can describe the content and let a model generate the slides.

My data analysis agent is a firsthand case study. Every component I built — the Python sandbox, the schema preloading, the context compression, the workspace state management, the RBAC layer — existed to process data more effectively for the user. But Claude Code, given the same raw data source credentials, skipped every one of those components and delivered better results. The general-purpose model did not need my mediation layer. It mediated for itself.

The moat around processing-data products — engineering complexity — is being systematically dismantled by AI. Building a Photoshop competitor used to require hundreds of engineers working for years. A general-purpose model can now handle the majority of a typical user's image editing needs. Engineering still matters, but it no longer constitutes a durable competitive advantage in the same way. The skills that took decades to accumulate can now be approximated — not perfectly, but well enough for most use cases — by a system that improves on a curve measured in months.

### Producing data is also being flattened, and possibly faster.

This is the counterintuitive part. Producing data looks like the native AI-era play — after all, it was AI that made "generating content from nothing" possible in the first place. But precisely because of this, companies on this line are not competing with each other. They are competing with the base models themselves.

From the 2023 startup wave through to today in 2026, the vast majority of AI startups are doing essentially the same thing: wrapping a UI and workflow layer around a large model's generation capabilities. AI writing assistants, AI design tools, AI video generators, AI coding helpers — they share a common architecture. User provides intent. Product calls model. Model produces output. Product displays result. The product is not selling its own generative capability. It is selling a more convenient package around someone else's generative capability.

But when the base model itself becomes convenient enough for end users to interact with directly, the packaging layer transitions from value to cost. Claude Code does not need a predefined workflow to write code. ChatGPT does not need a prompt template to draft an essay. Every capability jump in the base model compresses the reason for the wrapper to exist.

And this compression is irreversible. Models only get more capable. The scene that today still justifies a specialized UI — maybe a particular domain needs domain-specific prompt engineering, or users in a specific industry need a tailored interface — may not justify it tomorrow. The window of relevance keeps shrinking.

### Providing data is the only line that is not being flattened.

This is the core claim of this essay.

Processing is being flattened because processing capability is ultimately substitutable by raw compute and model intelligence. Producing is being flattened because production capability is the base model's core function — building a wrapper around it is building on a foundation that is actively subsuming you. But providing data is not being flattened, because **data accumulation is not a compute problem. It is a time-and-network-effects problem.**

AI can generate a song in one second. It cannot generate a music catalog in one second. AI can produce a user profile in one second. It cannot build a social network with a billion users in one second. AI can answer a general-knowledge question about an industry in one second. It cannot conjure a company's internal production database in one second.

Data takes time to grow. It requires users posting one update at a time. Creators uploading one song at a time. Businesses recording one transaction at a time. Researchers publishing one paper at a time. These processes are not compressible by compute. They are gated by real-world activity happening at the speed of real-world activity.

My music player works not because my code is good — it is entirely replaceable — but because NetEase accumulated something over more than a decade that no one can reproduce overnight. My data analysis agent is useful not because my agent architecture is good — Claude Code has already proven its architecture is better — but because the data sources it connects to are not publicly accessible. The value is in the data, not the engineering that sits on top of it.

There is an easily overlooked corollary here: **in the AI era, the relative value of data is rising sharply.** Not because data itself has changed, but because everything surrounding data — engineering, UI, workflow, algorithms — is depreciating. When all other variables are converging toward zero or toward parity, the one variable still creating differentiation becomes the most important one by default.

## So What Is a Product Actually Selling?

Return to the opening question: when scheduling, scaffolding, engineering, and interfaces can all be competently handled by AI, what is a product actually selling?

My music player gives a direct answer: **it is selling data.**

Generalize this observation and you get the following thesis: in the AI era, the center of gravity of product value is migrating from *how it works* to *what it has.* Engineering capability, UI design, workflow orchestration, user experience optimization — the modules that used to require large teams and years of effort to build — are being rapidly commoditized by AI. What has not been commoditized, and what is structurally difficult to commoditize, is the data itself.

"Data" here does not mean just numbers. It means any asset that requires time to accumulate and cannot be conjured by a model from nothing. It can be content copyrights. It can be user-generated content. It can be industry-specific structured knowledge. It can be a user's own history and preferences. It can be cross-source composite views that no single data source can provide on its own. The common feature is: **acquiring it requires time, relationships, or privileged access — not just compute.**

But I need to qualify this immediately: **the claim that "providing data is monopolized" holds for old data types. It does not necessarily hold for new ones.**

The last generation of internet giants locked up music rights, social graphs, search indexes, video libraries, professional identities. The competitive window for those data categories has closed. But the AI era is generating new data needs, and the data assets corresponding to those needs are still forming.

Consider structured cross-platform user preferences. Every platform has user data, but each keeps it locked inside its own walls, stored in its own schema, serving its own recommendation algorithms. No one is building "user-owned, agent-readable, cross-platform structured identity" — a data asset that users control and can authorize any AI agent to read. This data type does not currently exist at scale — not because no one needs it, but because its value was not large enough to justify building it until AI agents became widespread. The incentive is now appearing.

Consider industry-specific structured knowledge. Compliance logic in financial regulation, decision trees in medical diagnosis, case relationship graphs in law — this knowledge is scattered across documents, databases, and human minds, and has never been systematically structured into a format that AI can directly consume. General-purpose models know the "common knowledge" of these domains, but they do not have the execution-level specifics. Whoever structures this knowledge first in a given vertical becomes the new data monopolist of that vertical.

Consider composite views across data sources. Not producing data, not owning data, not processing a single data source — but establishing connections between multiple existing data sources that create something no single source can provide alone. My data analysis agent, despite losing to Claude Code on the engineering layer, was doing something specific: putting ad spend data, user behavior data, and product database data into the same queryable space. No individual data source can answer "was last week's cost-per-acquisition spike caused by traffic quality issues from a specific channel?" — because that question spans three data sources. Can a general-purpose agent do this? Yes — but only if the user already knows what to ask, knows where the data lives, and knows how to interpret the results. The general-purpose agent's ceiling is the user's domain knowledge. There is a window here, though it is closing as model capabilities improve.

So the conclusion is not "only companies that own data can survive" — that would be too simple. The conclusion is a more nuanced observation: the most important question for building a product in the AI era is not "what can I do with AI?" It is **"what do I have that AI cannot produce on its own?"** The answer almost always points to some form of data — something that requires real time, real relationships, real industry immersion to accumulate.

The ability to process data is being flattened by general-purpose models. The ability to produce data is being internalized by general-purpose models. The ability to provide data is not being flattened, because data is not a compute problem.

Engineering is depreciating. Data is appreciating.

That is probably the simplest — and the most frequently overlooked — sentence about this era. And I arrived at it by building a floating lyrics player for a music app I did not like.