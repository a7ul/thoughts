---
title: Designing products in the age of agents
date: 2026-06-02T10:00:00.000Z
description: The human-does-the-task assumption just broke. Here's what that means for how we build products.
keywords: products, agents, ai, design, ux, delegation, mcp, engineering
slug: designing-products-agent-era
---

In my [last post](/scaling-agentic-development.html) I wrote about how we *build* software now that coding agents are real. This one is about the harder question that comes right after: once everyone has these agents, what do we actually build, and who do we build it for?

I want to start with something that sounds obvious but I think we have all stopped noticing, because it has been true for our entire careers.

For the last 10 to 15 years, every app any of us shipped was built on one assumption: **a human being comes to your platform and does the task.** They open the app, they log in, they land on a dashboard, and then *they* do the work  -  clicking, typing, dragging, reading. Our entire craft as product people is downstream of that one sentence. Onboarding exists to get the human in. Navigation exists to walk the human to the right screen. Empty states, tooltips, the perfectly placed primary button  -  all of it is scaffolding for a human who has shown up to do a job by hand.

That assumption just stopped being true. And I don't think most teams have sat with how deep that goes, because the change doesn't look like the changes we are used to.

## Three eras of getting something done

The cleanest way I can explain it is to take one real task and watch it move through three eras. Let's use the one I stare at every day at [Filed](https://filed.com): doing your taxes.

@figure(_diagrams/eras.svg, "Physical → digital → agentic. The first jump moved atoms to bits. The second one moves the work off your hands entirely.")

**Era one  -  physical.** You did your taxes in the real world. You collected paper, you drove to an office, you sat across a desk from a tax pro, you signed forms. The work was slow, it was made of atoms, and it was located somewhere. If you wanted it done you physically went and did it (or physically handed it to a person who did).

**Era two  -  digital.** This is the era we have spent our whole careers perfecting. We took that physical process and built a clean digital copy of it. TurboTax, online banking, Amazon, Expedia  -  same underlying task, now made of bits. No commute, no paper, instant, and you could do it from anywhere at 2am in your pajamas. We removed an enormous amount of friction.

But here is the part worth staring at, because it is the whole point of this post. **The digital era changed the *medium* of the task. It never changed the *doer*.** TurboTax did not do your taxes. It gave you a faster, friendlier surface on which to do your taxes *yourself*. The form went from paper to a web form. The shoebox of receipts went from cardboard to a file upload. But you were still the engine. You still sat down and did every step. For 15 years, "innovation" mostly meant: take something physical, make it digital, shave off friction  -  and leave the human exactly where they always were, in the driver's seat, doing the work.

So of course the interfaces we got good at building were interfaces for *a human to talk to a computer and do a task by hand*. Buttons, forms, tables, wizards. We even automated big chunks along the way  -  autofill, recommendations, fraud flags  -  but the spine never moved. A person sits in front of the product and performs the work.

**Era three  -  agentic.** This is the one that is genuinely different, and I think it is different in kind, not in degree.

## The agent era changes the doer, not the medium

Every improvement in the digital era made it *easier for the human to do the work*. The agent era does something we have never done before at this scale: it **takes the human out of doing the work.**

The agent era is a layer of abstraction sitting *on top of* the digital world. The processes underneath are still there  -  the digital platforms still exist, the forms still exist, the database rows still exist. But you, the user, are now one step removed from performing the task. You describe your intent, an agent goes and does it across those digital surfaces, and you step back in only when you want to check something or make a call the agent shouldn't make on its own.

Look at the gap between the two jumps:

- Physical → digital was a **change of medium**: atoms became bits.
- Digital → agentic is a **change of doer**: you became an agent acting on your behalf.

These are not the same kind of shift, and that is exactly why our instincts mislead us here. Our entire product playbook  -  destinations, navigation funnels, onboarding flows, engagement metrics, time-in-app  -  was written for the change-of-medium era. Every line of it quietly assumes the human stays the doer. So when the doer changes, the playbook isn't slightly outdated. It is aimed at the wrong person entirely. We are still polishing the lobby while the actual work has quietly moved to a back room we never designed.

## So you build an MCP for agents, right? It depends.

Here is the first wrong turn I see teams take, and I have caught myself reaching for it too. You hear "agents are the new users," and you reach for the obvious move: *let's expose our product as an MCP server, ship it, and agents will start using it.*

To be clear, I am not talking about interfaces in the buttons-and-layout sense here. An MCP *is* an interface  -  a set of typed tools instead of screens  -  and building one is very often exactly the right thing to do. The wrong turn is the reflex: assuming you can bolt an MCP onto whatever you have and agents will magically show up and use it. They won't. Whether an MCP is even the right thing to build depends entirely on what your product is  -  and the cleanest way to reason about that is the three-level stack.

@figure(_diagrams/levels.svg, "Physical → digital already built levels 1 and 2. The agent era adds level 3 on top  -  and that is where the new product lives.")

**Level 1  -  core systems, data and rails.** The ledger, the inventory, the flight database, the actual tax records. The source of truth. This barely changes; it is the bedrock everything else sits on.

**Level 2  -  the digital app.** This is the platform humans have been logging into for 15 years. If you are building a level-2 product, you are digitizing something that used to live in the physical world  -  you *are* the underlying platform: the bank, the airline, the store. For you, an MCP is exactly the way to go. Alongside the human UI you have always had, you now open a second front door for agents: a set of typed tools they can call to actually do the thing on your platform. You are extending access to the thing you already own.

The difference between a screen and a tool is the whole game, so let me make it concrete. The old way to ship a level-2 feature was to design a screen: *"add a page where the user reviews flagged transactions."* The agent-era way is to also expose it as a capability:

```json
{
  "name": "list_flagged_transactions",
  "description": "Return transactions that look unusual for this account",
  "input": { "account_id": "string", "since": "date" },
  "returns": [{ "id": "string", "amount": "number",
               "merchant": "string", "reason": "string" }]
}
```

Once that capability exists, the human review screen is just *one* consumer of it. An agent is another. A scheduled automation is a third. You were forced to name the actual thing the user is trying to do, instead of the screen they happened to be looking at  -  and that turns out to make the human product cleaner too.

**Level 3  -  AI-native delegation.** Now flip it around. If you are building on level 3, it is *because there are already incumbents doing level 2*  -  the bank, the tax software, the booking engine already exist and are good at what they do. In that case, building an MCP is **not** the right first move. Nobody is sitting around waiting to point their agent at your shiny new MCP server. Your job is to build the delegation platform itself  -  the place your user actually goes to hand work to AI.

That platform is made of four things: **chat** (how you talk to it), **skills** (how you teach it the way *you* do things), **workflows** (the repeatable jobs it runs), and **integrations** (how it reaches down into the level-2 platforms to get the work done). This is where the value sits for an AI-native company. Your job is not to rebuild the bank. It is to build agents that work one level up and take on the job the way a good employee would.

Sure  -  later on, there may well be a case for plugging your level-3 product *into* ChatGPT and the other horizontal delegation platforms, so their agents can call into you. But that is a distribution play for down the road. Today, your primary user is a *vertical* AI user: someone in your specific domain who needs a platform where they can use AI to delegate the actual tasks of their job. Build that first.

The practical consequence is bigger than it sounds. If you are an incumbent building a bank today, you don't get to build only level 2 anymore  -  you build levels 1, 2, *and* 3, with your users living mostly at level 3 and dropping down to the level-2 UI only when they want to do something by hand. And if you are building *only* at level 3, the level-2 UI isn't even yours  -  it belongs to the incumbent, and it becomes the fallback your users drop to when they want to do something by hand.

## Why a chatbot is not the answer

The lazy version of level 3 is to bolt a chat box onto your existing app and call it agent-ready. I have built that version. It doesn't get you there, and it is worth being precise about why, because the reasons tell you what to build instead.

A bare chat box fails on two specific things:

**It doesn't convey what's possible.** A blank text box with a blinking cursor gives the user zero sense of the space of things they are allowed to ask for. A traditional UI, for all its friction, is also a *menu*  -  it shows you what the product can do. Strip it down to a chat prompt and you have quietly offloaded the entire problem of "what can I even do here" onto the user. Most people freeze.

**It answers in a slow stream of text.** Delegation is supposed to *save* you time. But a wall of generated prose takes real effort to read, and reading paragraphs to find out whether your task got done is the opposite of the point. You wanted to hand off the work, not acquire a pen pal.

So what you actually need is two capabilities living side by side:

1. The ability to **delegate**  -  to describe a task, *teach* the agent how you want it done, and have it get done.
2. The ability to **step in and do it yourself**  -  to take the wheel, do the task by hand, and make modifications, whenever you want to.

## The mental model I keep coming back to

Whenever I am designing one of these surfaces, this is the test I run in my head:

> If you had to delegate this exact task to another person  -  through this interface, and only this interface  -  how would you do it? And when they misunderstood you, how would you correct them?

I love this question because it quietly forces every hard part into the open. How does intent get communicated clearly? How does the person show you their progress so you can tell if they are on track? How do you interrupt and course-correct mid-task without starting over? How do they learn your preferences so you don't have to repeat yourself every time? "Where do the buttons go" never surfaces any of that. "How would you hand this to a competent colleague" surfaces all of it.

## You are the supervisor now

The role the human plays changes completely. You are not the worker anymore. You are the supervisor.

@figure(_diagrams/supervisor.svg, "The supervisor mostly gives instructions and takes a peek when needed. The workers on the belt are agents now.")

I keep picturing a supervisor on a factory floor. Think of the conveyor belts as your workflows  -  the repetitive, well-understood tasks that just need to get reliably done. The workers along the belt do the actual work. The supervisor doesn't do the work; they walk the floor, give instructions, peek at a station when something looks off, and step in only when a judgment call is needed. In this era, the workers are agents, and you are the supervisor.

And this is exactly why chat is still crucial  -  not as a gimmick, but because **the supervisor's job is fundamentally communication.** A supervisor leads by talking: giving direction, asking for status, correcting course. That has to happen in text or voice, because that is what instruction *is*. So the interface is not "a chatbot bolted onto an app." It is a way to talk to the agent on one side, paired with a live view of the work being done on the other. The UX still matters enormously. It just isn't a form to fill in by hand anymore  -  it is a cockpit for steering work.

And once you accept that, the most valuable property falls out naturally: these tasks should be able to run **while you are asleep**, and get done **the way you would have done them**. A supervisor who has trained their team well doesn't have to be present for every shift. That is the bar.

## What this actually looks like

This all stays abstract until you sketch the real product, so let me walk through three. The pattern is the same every time: a way to delegate, a live view of the work, and a manual fallback for when you want to drive yourself  -  with the human holding the wheel on anything destructive.

### Neo-bank

The level-2 task is "log in and check my transactions." For 15 years the product's job was to render that screen beautifully. In the agent era, you shouldn't have to *do* that at all.

Instead, you set an agent once: *watch my account every morning, and flag anything that looks off.* Now the work runs while you sleep. Each morning you get a short, scannable result  -  not a paragraph  -  and the only thing left for you is the judgment call: is this flagged charge actually fraud or not? You keep the ability to open the full transaction list and dig in yourself whenever you want. The agent does the watching; you keep the deciding.

@figure(_diagrams/mockup-bank.svg, "Set it once; it runs every morning while you sleep. You still hold the review / ignore decision  -  and the manual view is one tap away.")

### Ecommerce

You *can* still search and filter the catalogue yourself  -  that path doesn't go away. But most of the time you shouldn't have to. You tell a chat-like surface what you are actually after  -  *running shoes, under \$100, size 10, something blue*  -  and the agent does the searching and filtering and comes back with a handful of real options.

Notice where the line is drawn. Searching and filtering are cheap and reversible, so the agent just does them. **Checkout is destructive**  -  money leaves your account  -  so that one stays behind an explicit human OK. That split, "let the agent do the reversible stuff freely, gate the irreversible stuff behind me," is one of the core design decisions you now make for every single action in your product.

@figure(_diagrams/mockup-shop.svg, "The agent handles the filtering and searching. The one thing it can't do without you is the irreversible step  -  checkout.")

### Airline booking

Same shape again. You go in and say what you need  -  *cheapest direct flight to Tokyo next Friday, aisle seat*  -  and the agent does it according to your constraints, comes back with ranked options, and books only once you confirm. As the aggregator platform, your entire job is to provide the tools that make this clean: good search, clear constraints, a confirm step on the booking. The human states intent; the agent does the legwork; the human confirms the one step that can't be undone.

@figure(_diagrams/mockup-flights.svg, "State the intent, get ranked options that fit your constraints, confirm the one irreversible step yourself.")

Three different industries, one identical pattern. That is the tell that this is a real shift and not a fad: the same shape keeps falling out no matter what the domain is.

## Build for teaching, not for doing

So here is the gist, and it is the thing I would tattoo on the wall of any product team building right now.

When you are building at level 3, the questions you obsess over change. It stops being "how do I lay out this screen so the user can do the task" and becomes "how do I design this so the user can **delegate** the task and **teach** the agent to do it their way"  -  while still leaving the manual controls in place so they can drop down to a level-2 task by hand whenever they want.

At Filed, we work solely at level 3. We deliberately leave the level-2 work to the incumbents  -  the existing tax platforms are very good at being level 2, and we are not trying to rebuild that. What we give our users is the ability to hire, in effect, an extra digital delegation platform: somewhere they can hand off the work of their firm instead of grinding through every task by hand. And the moment you frame it that way, the orientation of the whole product flips. For 15 years we built platforms for *doing*. The platforms that win this era are built for *teaching*  -  surfaces where you hand off work, watch it happen, correct it when it drifts, and trust it to run without you.

If there is one line to take from all of this, it is this: **every AI-native product has to go from doing the task to being a delegation platform.**

The doer changed. Design for that.
