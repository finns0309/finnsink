---
title: "After the Model: A Few Distinctions on What Remains"
slug: after-the-model
lang: en
summary: >-
  For a while I kept asking whether to stay in AI. By the third time I noticed it was a misplaced question — disguising an internal judgment (where on the value chain to place myself) as an external one (whether the industry is worth being in). This essay isn't about whether to stay. It's about the real question hidden underneath — once model capabilities keep climbing and engineering and interface keep getting commoditized, what is left in the product layer that won't be flattened.
thesis: >-
  Once model capabilities are universally available, what doesn't get flattened is not the shiny "AI product" narrative, nor data assets as an abstract concept, but the new data structures — accumulated through long-term commitment — that can carry human-machine co-evolution.
published_at: 2026-05-03
updated_at: 2026-05-03
keywords:
  - product strategy in the AI era
  - value remainder
  - data structure
  - first-party model providers
  - human-machine symbiosis
  - bootstrapping
stance: working
person_snapshot:
  - I believe "should I stay in AI" is a misplaced question. The real one is which way of organizing AI capabilities into products is losing its value basis.
  - I believe engineering is depreciating and data is appreciating, but stopping at "find a company with data assets" is the cheap version. What cannot be flattened is the structural understanding that long-term commitment accumulates.
---

# After the Model: A Few Distinctions on What Remains

## I. A Misplaced Question

For a while I kept asking myself the same question: should I stay in AI.

By the third time around, I noticed it wasn't a real question. Or rather, it was a misplaced one — it disguised an internal judgment (where on the value chain should I place myself) as an external one (is this industry worth being in). The two look similar but require entirely different work. The first asks you to take apart the actual shape of your work; the second asks only for an attitude toward an industry label. The second is cheap, which is why it's tempting.

Misplacing a question into its cheaper version is the most common way to avoid the difficult judgment underneath.

So this essay is not about whether to stay in AI. It's about the real question that question was hiding: **once model capabilities keep climbing and engineering and interface keep getting commoditized, what is left in the product layer that won't be flattened.** Without an answer, "stay" or "leave" both lose meaning — the first becomes inertia, the second becomes pique, neither is judgment.

What follows is a sequence of distinctions. Each one tries to take a concept that has been blurred by everyday language, split it into its component parts, and identify which parts are coming apart under the new conditions.

---

## II. First Distinction: Industry Judgment vs. Value Judgment

Consider the proposition:

> **(P1)** "AI is not worth being in."

(P1) is usually treated as a single claim. But it actually contains at least two:

> **(P1a)** AI as a class of technical capability has limited long-term value.
> **(P1b)** Organizing AI capabilities into products and selling them, as a way of working, has limited long-term value.

(P1a) is a prediction about technological trajectory. (P1b) is a structural claim about a form of commercial organization. They can be true or false independently.

I have no doubt about (P1a). Model capabilities continue to advance, with no sign of stopping. What I actually doubt is (P1b) — more precisely, a particular shape of (P1b): **the practice of re-wrapping upstream model capabilities into a feature-shaped piece of software and assuming the wrapping itself constitutes a moat.**

This distinction matters because it converts an unactionable mood ("AI is over") into a specific operational judgment ("which class of position is no longer worth occupying"). The first cannot be replied to. The second can be analyzed further.

My doubt about (P1b) doesn't come from any ideological objection to wrappers. It comes from the fact that, as a practitioner, I've discovered that most AI products produce less value for me than calling general-purpose models with Claude Code directly. What does that observation imply? It implies that I am no longer the right person to be using "can it do some AI thing" as a filter for what to work on. That filter worked two years ago — back then most users couldn't use the models directly, so there was real arbitrage in any halfway competent wrapping. That arbitrage is closing.

So the conclusion of this section:

> **(C1)** What needs scrutiny is not "is AI worth being in" but "which way of organizing AI capabilities into products is losing its value basis."

---

## III. Second Distinction: Three Layers and the First-Party Problem

It's common to split AI as a venture space into three layers: infra, model, product. The point of the split isn't classification; it's to make visible what each layer's moat actually rests on.

**The infra layer** rests on capital density and timing. Its chips were placed by the previous generation's hyperscalers. Almost no opening for new entrants. Unchanged in 2026.

**The model layer** rests on the product of intellectual density, data access, and capital density. Frontier closed-source labs have established a generational gap that hasn't narrowed under time — it has widened. Open-source models are catching up on capability but still trail by one to two generations on frontier usability.

**The product layer** is where the real question lives. Its conventional moats — distribution, brand, user habit, accumulated data — have suddenly run into a new condition: **model providers are now building applications themselves.**

This is worth analyzing on its own. Two years ago, the standard assumption was that model providers would focus on the substrate and leave applications to the ecosystem. That assumption broke in 2025. Claude Code, Codex, Seedance's own agent surface, Gemini's app matrix — these are not substrate, they're terminal products. Once first-party players occupy these surfaces, the position of third-party "wrappers" in the same category undergoes a structural change:

> **(P2)** Once a model provider builds a first-party product in a given category, the question for third parties is no longer "can we build it better" but "why would the provider allow us to."

This is asymmetric competition. A third-party wrapper's COGS is entirely the model provider's markup. It has no structural lever against vertical integration by the provider. Cursor had room in 2024 because the model labs hadn't yet built their own IDEs. By 2026, with Claude Code and Codex in that position, the room has compressed to almost nothing.

But this doesn't mean every position in the product layer has been eliminated. What's been eliminated is the specific shape of "product = model + a UI." Other positions remain viable. At least three:

(i) **Distribution and compliance lock-ins.** Some B2B customers, due to compliance requirements, procurement processes, or data residency, cannot connect directly to model providers and require a middle layer. The moat here is not the product itself but relationships, processes, and certifications.

(ii) **Genuinely multi-model orchestration.** In some domains, no single model is best — video generation needs to dynamically select among Veo, Sora, Seedance, Kling — and model providers themselves won't build cross-vendor integration because it conflicts with their core commercial interest in betting on their own models.

(iii) **Vertical scenarios where the model is one step in a longer pipeline.** Medical imaging plus report generation plus EHR integration; legal research plus case law plus compliance review. The model is one stage; the product's value lies in everything around it. Model providers have no incentive to descend to this granularity.

The common feature of these three positions: none of them are the shiny "AI product" narrative. They look like boring SaaS work. Their moats don't come from the model — they come from some structural constraint outside the model that cannot be flattened.

So:

> **(C2)** First-party entry by model providers does not eliminate the product layer, but it structurally compresses the specific form of "wrapping a model into a product." What remains is built on something outside the model — some constraint that cannot be commoditized away.

---

## IV. Third Distinction: Copy Cost vs. Production Cost

The next thing that needs to be split apart is the economic model.

The internet software wealth narrative of the last twenty years rested on one nearly mythologized property: **operating leverage**. Once fixed costs were paid, copying and distribution approached zero marginal cost. One codebase, one deployment, a billion calls — unit cost asymptotic to zero. This property is the foundation of every SaaS valuation multiple of the past two decades.

AI products violate this property.

> **(P3)** Most AI products incur real compute cost on every response, every generation, every inference. Unit cost does not approach zero as user count scales.

Two years ago I would have hedged this judgment: maybe not, since inference costs might decline rapidly over time — call it "Wright's Law for AI." If that curve held, AI products' operating leverage would be rescued by time.

That hedge has been falsified by 2025–2026. A few signals:

- Seedance 2.0 launched at noticeably elevated pricing, with API access tightened — global rollout came two months after release.
- Claude 4.7's recalibrated token-counting rules cause the same prompt length to consume 20–30% more quota.
- Chinese model providers tightened subscription quotas across the board in Q1 2026, retreating from the era of subsidy.

Read together, these don't say "the curve is choppy." They say model providers are no longer subsidizing usage. The era of free token allowances is over. Meanwhile, frontier capability gains are pushing the price band of high-end inference upward, not downward. So (P3) is not a phase-specific observation. It's a structural fact.

The implication is concrete:

> **(C3)** Under sustained or rising token prices, AI products with low ARPU and heavy token consumption (general chatbots, consumer video generation, personal assistants) face persistent pressure. Products with high ARPU and low relative token cost per unit of value delivered (legal research, clinical decision support, financial risk, professional engineering tools) have room to be sustainably profitable.

(C3) is not the claim that the former dies and the latter lives. It's the claim that **the structural bias of unit economics has shifted**. That shift will shape product form for the next three to five years.

The old-era story of "asset-light, high-leverage, near-zero marginal cost" software wealth does not apply to AI products.

---

## V. Pivot: From Function to Remainder

The first three distinctions have produced a joint set of constraints: wrapper positions are shrinking (C2), unit economics are tightening (C3), and industry-level judgments must be reduced to position-level ones (C1). All three are negative — they say which positions don't work, not which do.

So the question has to be posed again:

> **Once model capabilities are universally available, what doesn't get flattened?**

This is the real pivot. It moves attention from "what flashy feature should I build" to "what remains after everything else is flattened." The question of remainder is closer to where value actually lives than the question of novelty.

Because novelty gets copied. Remainder doesn't.

---

## VI. Fourth Distinction: Processing vs. Providing vs. Producing

Where is the remainder? I've written about this before, in *Data is the Product*. The shape of every software product's relationship to data falls into three pipelines.

**(M1) Processing data.** The product offers a processing capability. The user brings their own data, runs it through the product's algorithms, and walks away with optimized output. Office, Adobe Creative Suite, AutoCAD, MATLAB. The defining feature: the content lives outside the product; the product just transforms it.

**(M2) Providing data.** The product itself holds data assets, or hosts the user's data. Users come to consume that data or collaborate on top of it. Two sub-types:

- *Platforms holding third-party data assets.* NetEase Cloud's music catalog, YouTube's video library, Google's search index, Netflix's film vault. The moat is content accumulation and rights.
- *Platforms hosting first-party user data.* Notion's pages, Slack's messages, GitHub's repos, Google Drive's files. The moat is migration cost and organizational structure.

The ownership models differ. The function is the same: providing data a structured place to live.

**(M3) Producing data.** The product generates content from nothing in response to user intent. AI writing assistants, image generators, video tools, coding assistants. They sell neither processing nor inventory; they sell creation from scratch. This is a product form with no precedent in software history. Processing requires raw material; providing requires accumulation; producing requires neither.

The three pipelines face entirely different fates in the AI era.

**(M1) Processing is being eaten by general-purpose models.** Processing capability is fundamentally substitutable by compute. When a general-purpose model can directly understand intent and execute, the carefully engineered specialized algorithms become unnecessary middle layers. You no longer need a dedicated photo editor to color-grade an image — you tell the model "warmer tones." You no longer need a data cleaning tool — drop the table in the model. Building a Photoshop competitor used to take hundreds of engineers and years. Now a general model covers most users' needs. Engineering is not unnecessary; it just no longer constitutes a moat.

**(M3) Producing is also being flattened, possibly faster.** This is counterintuitive. Producing looks like the AI era's native lane — but precisely because of that, the competitors of producing-data products are not each other. They are the underlying models. The dominant pattern of AI startups is "user describes intent → product calls model → output appears." What they sell is not their generation capability but a wrapping of the model's. When the underlying model becomes simple enough to use directly, the wrapper turns from value into friction. Each capability jump compresses the wrapper's reason to exist. The compression is one-way — model capability only goes up.

**(M2) Providing data is the only pipeline that doesn't flatten.** Because data accumulation is not a compute problem — it is a problem of time and network effects. AI can write a song in a second; it cannot accumulate a music rights catalog in a second. AI can generate a user profile in a second; it cannot build a billion-user social graph in a second. AI can replicate Notion's editor in a day; it cannot replicate the data and organizational structure a team has accumulated in that workspace over two years. Compute can double; time cannot halve.

So:

> **(C4)** Processing capability is being substituted by compute, generation capability is being absorbed by base models, and the only thing that is not being flattened is data that requires time and relationships to accumulate. Engineering is depreciating. Data is appreciating.

But a qualifier needs to be added immediately: **"providing data is already monopolized" is true for old data types, not for new ones.** The previous internet generation locked down music rights, social graphs, search indices, video catalogs, professional identity — those windows are closed. But the AI era is generating new data needs whose corresponding assets are still forming: cross-platform structured user preferences, vertically structured domain knowledge, cross-source combination views. These data types currently lack incumbents, because their value before the AI agent era wasn't large enough to motivate anyone to build them. The motivation is appearing now.

So (C4) is not a pessimistic "you're too late." It's a directional pointer.

But stopping at (C4) isn't enough. Read at face value, it would suggest "find a company with data assets" — a cheap version of the conclusion. The real question is the next distinction.

---

## VII. Fifth Distinction: Data Assets vs. Data Structures

Data is not an undifferentiated resource.

> **(P5)** What determines a dataset's value is not just its volume, exclusivity, or freshness — it's how the data is organized into structure.

This sounds abstract. Two examples make it concrete.

**Example 1.** Notion is Notion not because it stores more documents than competitors (Google Docs stores more), but because it invented a particular data structure — page / database / relation — that lets users organize notes, knowledge, tasks, and collaboration into a network of cross-referencing objects. The structure doesn't just shape the product's features. It teaches users, over time, **to think in the structure's terms.**

**Example 2.** Slack is Slack not because it sends messages (any software sends messages), but because it organized conversation into thread / message / channel. That structure defines what counts as an object, what relationships between objects are permissible, and how users coordinate across them.

A data structure is not a cold backend schema. It is something that reverse-trains its users, shapes mental models, and stipulates a cognitive model. It defines, within a given domain, **what counts as a thing**.

Inventing a new, effective data structure is extraordinarily hard — but **copying an existing one is cheap**. These two facts do not contradict each other. No product has fully replicated Notion's database design; you can guess at it from the API but the cognitive depth of the design cannot be reverse-engineered. Between invention and copy lies an asymmetry: the former requires years of co-evolution with users hitting walls together; the latter only requires looking at the result and re-implementing.

But here a self-rebuttal is needed.

If inventing a data structure is so valuable, why aren't there more Notions? The answer isn't that no one realized — it's that **invention is not a moment, it's a years-long process of hitting walls with users.** Ivan Zhao did not sit in a room and design page/database/relation. The structure emerged through countless prosumer users nesting pages, chaining properties, surfacing needs, with the team iterating and abstracting. Which is to say: "inventing a new data structure" is not something one decides to do. It is something identified in retrospect.

This qualifier is critical. It means any commitment to "go invent a new data structure" is, in substance, a commitment to long-term presence: you have to deep-commit to a specific problem domain for five to ten years before any structural understanding worth defending can accumulate.

So (C4) gets refined into:

> **(C5)** What cannot be flattened is not "data assets" as an abstract concept, but **the structural understanding that long-term commitment accumulates**. This understanding cannot be replicated by compute, and cannot be rescued by time — it can only be exchanged for, with years of presence.

---

## VIII. The Ontological Dislocation of Current AI Products

Now apply (C5) to current AI products.

Most of them share a structural feature: **their data structures are not abstracted from users' task worlds; they are reverse-engineered from the model API.**

Session, message, tool — these three primitives have become the standard kit. But what is this structure, fundamentally? It is **LLM-compatible**, not **AI-native**, and certainly not **human-shaping**.

Concretely:

- Without a user/assistant distinction, you cannot easily call the model — so the product has "roles."
- Without turn-based conversation, you cannot easily carry inference context — so the product has "dialogues."
- Without a tool-call schema, you cannot easily do function invocation — so the product has "tools."

The whole AI product world has been shaped by the model interface into a question-answer, dialogue-based form. This form is convenient for calling models, but it has **invented no new cognitive objects**. It only puts users in chat boxes. It does not, in the way Notion or Slack did, define a new ontology of world objects.

> **(P6)** The data structures of mainstream AI products today serve the model, not the user. They are friendly to the model interface but offer the user no new objects.

This is an ontological dislocation.

If we accept (C5) — that real remainder lies in structural understanding accumulated through long-term commitment — then a structure designed for the model's convenience is clearly not that kind of structure. It solves an engineering problem, not a user problem. It will be forced to follow the model API as the API evolves, rather than shape the model. It is a passive, transitional ontology.

The next-generation AI products that actually carry value will need to leave this transitional ontology and invent something new — not session/message/tool, but some new object system that starts from the user's real task world.

What does this structure look like, concretely? I don't know. I can only sketch directions:

- Memory not as context summary, but as objects with type, source, scope, and conflict relations.
- Tasks not as natural language requests, but as nodes with owner, constraint, state, and evidence.
- Knowledge not as document chunks, but as structured units that can be cited, corrected, linked, and audited.

But these are shape-hints, not answers. The real answer can only be identified after years of co-walling with users in a specific domain.

---

## IX. A Historical Thread: From Symbiosis to Tool, Back to Symbiosis

The commercial and product analysis is mostly in place. But the thread can be pushed one more level — into the historical origin of HCI. Not for the sake of breadth, but to connect the foregoing judgments to a deeper question.

**Licklider's "man-computer symbiosis" (1960)** envisioned bidirectional adaptation between human and machine — the computer not merely responding to instructions but learning the user's preferences and modes of thought, eventually producing a relationship of co-existence. This is HCI's real starting point.

**Engelbart's "augmenting human intellect" (1962)** added the recursion: tools change minds, and minds, with their new capacities, change tools — round and round. A loop of co-evolution.

But the industry never realized this loop after Engelbart. When Xerox PARC and later Apple turned his vision into product, they made an unobtrusive but consequential decision: **the recursion was split into two roles.** Developers change tools, users use tools. Engelbart's notion that "users could change the behavior of the tool itself" was barred by a technical wall. What users could change was settings, preferences, color themes — these are configuration, not structure.

Until the LLM era, when ordinary people, for the first time, could participate in tool generation and modification through natural language. Bootstrapping **partially returned**, at the session level: the user voices a vague idea, the model realizes it, the user revises their idea on seeing the result, and the tool gets revised again. This is Engelbart's loop, restored.

But a problem follows immediately: **all of it happens inside a session, with no persistence.** Hands off the keyboard, conversation ends, the recursion breaks, co-evolution dissipates.

The HCI thread and the commercial thread converge here. The convergence point is, again, data structure.

> **(P7)** If co-creation, co-revision, and co-evolution between human and model cannot be objectified, structured, and inherited, all of it remains ephemeral chat. It does not accumulate as asset, does not consolidate as product, does not constitute a moat.

But — if this co-evolution can be sedimented into a new system of objects, then AI products begin, finally, to leave the transitional LLM-compatible ontology and enter a new form.

So (C5) can be expressed once more, more sharply:

> **(C6)** What carries real value in the AI era is not data assets per se, but **the new data structures capable of carrying human-machine co-evolution.** These structures must be both human-shaping (defining the objects of the user's world) and recursion-friendly (allowing co-evolution traces to persist across sessions).

---

## X. A Criterion for "Worth Doing"

Combining all the prior distinctions, a usable criterion emerges for filtering work.

The old criterion:

> Is it AI? Is it agent? Is it frontier? Can it demo well?

This worked in 2024. It's failed today — not because it's wrong, but because too many things satisfy it. It no longer discriminates.

The new criterion:

(D1) Does this direction **wrap the model**, or does it **invent new data structures and assets**?
(D2) Does it **manufacture one-off experiences**, or does it **sediment recursive traces that compound**?
(D3) Does it do **small optimizations on chat boxes**, or does it **rewrite the relationship between humans and tools**?
(D4) Is its moat independent of the upstream model — that is, would it survive if the model provider released a free, stronger model tomorrow?
(D5) Does its unit economics work assuming token prices do not decline?

Together, these five criteria filter out most current AI directions. That is the intended outcome. The point is not to produce a list of "things worth doing" but to provide a shared set of reasons for refusing — so one can say "not this" without emotion.

---

## XI. Limitations

Some honest acknowledgments before closing.

**(L1)** The argument structure of this essay is clean: a misplaced question, five distinctions in sequence, a final landing point at "data structures that carry human-machine co-evolution." But any argument that is too clean should be suspected. Real judgment rarely arrives by linear ascent — it more often arrives through dead ends, reversals, and self-contradictions that slowly resolve. What's on display here is a result, not a process. Anyone who reads this and concludes "he's figured it out" is reading wrong.

**(L2)** "Invent new data structures" sounds clear in formulation but is empty in execution. Because what it actually requires is long-term commitment — five to ten years of deep presence in one domain. Anyone who says this seriously must immediately ask themselves an uncomfortable question: am I willing to spend five years in one specific domain, walling repeatedly with the same users, giving up the sharp clarity of being a meta-layer player? If the answer is no, this criterion is decoration, not judgment.

**(L3)** This essay defaults to the builder's vantage point — where products should go, how value should be captured, how unit economics should hold. But the builder's vantage is not the only one. From the user's vantage, the social vantage, the institutional vantage, the question of "value remainders in the AI era" might take entirely different shapes. I have not engaged any of them.

**(L4)** The whole framework presupposes that model capabilities will continue to advance marginally without a phase change (the genuine arrival of AGI being the obvious example). If that presupposition fails — if models acquire genuine cross-session persistent learning, for instance — the entire "data structure as remainder" argument needs to be rewritten. My analysis lives within the regime "models are powerful tools but still tools." It does not extrapolate.

---

## XII. Closing

I thought I was asking whether to keep doing AI.

Walking through it, I noticed that what I was actually looking for was never an industry label.

What I was looking for was: in the era of models, **what is still worth doing**.

That question led me to data structure. But data structure is not an endpoint. It's a new entry — one that converts "worth doing" from an external judgment (which industry is at the frontier) into an internal one (am I willing to spend ten years in a particular domain).

The new entry doesn't lead anywhere more comfortable.

But at least it leads to a real question.
