---
title: "Build the system that builds the product: new tools demand that we think bigger"
date: 2026-11-17T00:00:00.000Z
description: "Breaking assumptions to find novel ideas has always been what engineering is all about. Now it is the job."
keywords: agents, ai, product engineering, harness, engineering culture, startups
slug: system-that-builds-the-product
---

Here's my slightly controversial take: the software engineering best practices and playbook are now holding your company back. Specs, handoffs, sprint planning, the PM to designer to dev relay race. All of it was built for a world where writing code was more expensive than deciding what to build. It isn't anymore. Agents can now write, fix and maintain the code.

But wait. If agents are now building everything, why shouldn't they decide what to build too? They can read every support ticket, every feature request, every error and every analytics dashboard. Surely they can turn all of that into a roadmap? And if they can, why do we even need engineers? Why are companies still hiring them?

Back when everyone got around by horse and cart, if you'd asked people what they wanted, you'd have heard "faster horses". Or "faster carts". Or "a more comfortable seat on my cart, please". Nobody would have said "cars".

The real feedback was never "I want a faster horse". It was "I want to get places faster". And the answer to that wasn't a better horse. It was a completely new way of getting around. That answer only shows up if someone breaks the traditional rules and thinks about the problem differently.

@figure(_diagrams/thb-horses.svg, "People ask for a better version of what they already have. The real feedback is the need underneath it.")

Agents are trained on a huge number of ideas, and they're brilliant at giving you the average of all of them, and sometimes even novel ideas, as long as they stay within the rules of the game. Ask an agent what to build next from your feedback and you'll get a very well-reasoned faster horse.

@figure(_diagrams/thb-average.svg, "Agents land in the middle of everything they've seen, sometimes somewhere novel, but always inside the rules of the game.")

That's the whole tension in one line: **product feedback != product roadmap.** Product feedback is what you collect. The roadmap is what you build to address it.

A feature request is the trickiest kind of feedback, because it looks like a roadmap item. It isn't. A feature request is a customer describing a problem in the shape of a solution they can imagine. "Faster horses" *was* a feature request. If you build feature requests one by one, you get a product that's the sum of everyone's guesses: a bit better at everything, and different at nothing. Your job is to look past the request to the problem underneath it, and then come up with the answer they couldn't have asked for.

@figure(_diagrams/thb-feedback-roadmap.svg, "Build every request as asked and you get the sum of everyone's guesses. Look at the problem underneath and you get a roadmap.")

Think about the features you actually love in the products you use. They're almost never the obvious ones. They're the ones that delighted you because they were unusually good, or because they did something differently from everyone else.

So the split looks like this:

- **New products and new features**: if you want to stand out, you have to challenge and break the traditional rules to address the feedback you got. That's an engineer's job: deciding which assumptions and rules to willingly break, so something magical can come out. Breaking assumptions to find novel ideas has always been what engineering is all about. Now it *is* the job.
- **Product maintenance, bug fixes and minor feature updates**: this is the opposite. Here you *want* to stay within the rules you've already set, and improve on them. This is where agents shine, and this should no longer be done by a human. It's a complete waste of an engineer's time and skills.

Break the rules when you're deciding what to build. Follow them, relentlessly, when you're maintaining what you've built.

@figure(_diagrams/thb-split.svg, "Engineers decide which assumptions to break. Agents follow the rules you've already set.")

So how do you actually do this in practice? How do you hand the maintenance to agents, trust what they ship, and keep your engineers on the decisions that matter? That's what the rest of this post is about. My [last post](./agents-code-your-way.html) covered one piece of it: making agents write code the way our team does. This one is the bigger picture: what the job of an engineer is turning into, and why we need to let go of traditional practices and start thinking way bigger.

## Everyone is already a PM, a designer and a dev

*It's cheaper to ship and fix than to wait.*

Look at what engineers actually do day to day now. Every engineer on my team, and every engineer I've spoken to at the startups around us, is basically acting as a PM, a designer and a dev at the same time.

Nobody planned this. It just happened, because the maths changed. Asking a designer to design something and waiting for it to come back now feels painfully slow. Writing a spec, getting it reviewed, scheduling it into a sprint: also slow. Meanwhile the agent can build three versions of the thing before lunch.

So people do the obvious thing. They experiment. It's much cheaper to try something than to debate it. It's much cheaper to ship and then fix than to get it perfect up front.

That's great for speed. But if you stop there, you end up with a team of very fast people producing a lot of code that nobody is quite sure about. Speed alone isn't the point. The point is what you do with it.

@figure(_diagrams/thb-relay.svg, "The old relay race, where every handoff is a wait, versus one engineer and their agents trying, shipping and fixing.")

## Build the system that builds the product

*The harness is the job now.*

Here's the shift I think we need to make. We are on a journey to build systems that ensure the code we generate is of the highest quality, and at the same time behaves and builds our systems the right way.

Read that again, because it's a different job from the one most of us trained for. The job is no longer "build the product". The job is **build the system that builds the product**.

In practice that system is a harness: everything an agent needs so that when it does the work, it does it correctly, to the quality we need, completely autonomously. And not just the first build. The harness also has to cover everything that happens after:

- **Maintaining** what's already shipped.
- **Keeping things updated**, so nothing quietly rots.
- **Monitoring** how it behaves in production.
- **Suggesting improvements** nobody asked for yet.

I won't pretend this is free. A proper harness takes weeks of dedicated work before it feels like it's doing anything. But it pays for itself, because the first version of a product is a tiny fraction of the changes it will ever need. The large amount of work that comes in *after* you ship (bug fixes, flow fixes, small tweaks, follow-up features) is exactly the work a good harness eats.

@figure(_diagrams/thb-iceberg.svg, "The first version is the tip. Everything after you ship is the bulk of the work, and that's what the harness is for.")

A good example of this is [opentax](https://github.com/filedcom/opentax), which is open source.

## What the harness actually does

*From first build to fixing bugs while you sleep.*

So what does "the system that builds the product" look like in practice? Let's walk through it, step by step.

@figure(_diagrams/thb-harness-loop.svg, "An engineer builds the first version. Agents listen to production, fix bugs, and the harness approves. New ideas go back to the engineer.")

### Step 1: an engineer builds the first version, through the harness

The first version of a product is the most fun part. It's also the part where building through agents shrinks the timeline the most. Something that used to be a quarter is now a few weeks.

But notice who drives it: a dev. Not "the agents, unsupervised". The first build of a product, or any major change to how a feature works, goes through a dev. I'll come back to why in a minute, because it's the whole reason the rest of this works.

Once it's shipped, the job changes. Now it's about modifying the same harness so that maintenance is predictable and stays up to the quality bar.

### Step 2: agents listen

For any of this to work, product engineers have to let their agents *listen*. That means giving them access to:

- **Monitoring**, so they see how the system behaves in production.
- **Errors**, checked periodically, not only when someone remembers to look.
- **Analytics**, so they can see what users actually do.

An agent that can only read your codebase can only fix what you tell it about. An agent that can read your errors and your analytics can discover new bugs, and new avenues, on its own.

### Step 3: bugs get fixed automatically

When an agent finds a bug, it fixes it. It goes through the harness like any other change: rules, tests, review, verification. Nobody has to triage it, assign it, or remember it exists.

### Step 4: features are the product engineer's call

Feature requests and feature discovery are different. The agents can surface them, but the product engineer gets to choose. Which features get built, in what order, and which ones don't get built at all, is a human decision. Remember the faster horses.

### Step 5: the harness reviews, and approves

Any follow-up feature that doesn't change the architecture goes through automatically, once the harness you built has reviewed and approved it. This is where the review loop from my [last post](./agents-code-your-way.html) comes in: rules that live next to the code, checked by a decision model, with a score instead of an essay. That's what makes "approved by the harness" mean something. Without it, auto-approve is just a polite word for "nobody looked".

## What about code taste?

*You already don't read every line.*

This is the first objection I always get. "If agents write everything and the harness approves it, who cares about code quality? Who has taste?"

The harness does. That's literally what it's for. You build the harness to make sure your agents build things the way you need them built. If anything, this gives you *more* uniformity across the platform than a team of humans ever did, because every change is held to the same rules, every time, by something that doesn't get tired on a Friday afternoon.

What it does mean is that you're not looking at the exact code anymore. And I know that feels uncomfortable. But honestly, this is not something new.

When you work on a team of engineers, you're already doing this. You probably don't know every line of code your peers have written. You do know how the feature works. You know what it does, where it lives, how it connects to everything else, and what will break if you change it. That's the knowledge you should build on.

So here's the move: **let the agents find the best architecture, and have them teach that architecture to you.** You don't need to have typed it to understand it. You need to know how it works in general, well enough to make good decisions about it.

@figure(_diagrams/thb-taste.svg, "You never read every line your teammates wrote. You knew how it worked. Same deal with agents.")

And that's exactly why the first build of a product, and any major change to a feature, goes through a dev. That's the moment the dev learns how it works. Everything after that, the bug fixes and the follow-ups that don't touch the architecture, can flow through the harness without them.

## What you get: bandwidth

*This is the bit that actually matters.*

So what does all of this buy you? Bandwidth.

Bandwidth to experiment with more new features. Bandwidth to try wild, crazy ideas that would never have survived a planning meeting. Bandwidth to think bigger.

@figure(_diagrams/thb-bandwidth.svg, "Hand the maintenance to the harness and the week flips. (Illustrative.)")

A few things that change once the harness is carrying the maintenance load:

- **You can build entire systems** that previously had to be planned for months, because they used to eat a lot of engineering time. Now they're a few weeks of a dev and their agents.
- **You can focus on experience.** The product no longer has to look bad. The small details, like animations and performance, that you'd typically push to a tech debt queue (where they'd live forever), now actually ship.

That second one is the one I'm most excited about. For years "we'll polish it later" was a lie everyone agreed to tell. It doesn't have to be anymore.

## Decisions stay with the human

*The agents do the work. You decide what the work is.*

For this to work, the decision making has to stay with the product engineers. The feature requests, the roadmap, the context about the business and the customer: all of that sits with a human.

Which means the engineering role itself has changed. It's now **product engineering**. It's about learning to think in terms of product, being close to users, and building features that align with the business. It's a mix of design, engineering and product management, all at once.

Zoom out and this is a bigger shift than it looks. For a long time we built teams out of specialised roles: designers, frontend devs, backend devs, QA, PMs. Those roles were necessary at the time, because one person simply couldn't do all of it at the quality and speed required. Now we're moving towards **more general roles for humans, and specialised agents** to do the specialised work. The human holds the whole picture. The agents go deep.

@figure(_diagrams/thb-roles.svg, "From specialist humans to a generalist human with specialist agents.")

This is where the startup industry is today. I believe that within one or two years, the incumbents will be there too.

## Now the unglamorous bits

It wouldn't be fair to sell this as all upside, so here's the fine print:

- **The idea is new.** We've tried it on a few projects inside Filed so far, and the results have been spectacular. But we're still building out the full harness for all of our products, so more learnings will come in due course.
- **The harness is a real upfront cost.** Weeks of dedicated work before it pays off. If you're not willing to invest that, you'll end up with fast agents and nothing holding them to your standard.
- **You won't read most of the code.** That's the trade. If your harness is weak, that's a problem you won't see until it bites you. The harness has to be good enough to deserve your trust, and you have to keep testing whether it still is.
- **The harness needs maintaining too.** Rules go stale, monitoring gets noisy, and agents will happily repeat a bad pattern the moment it appears in two places. Building the system that builds the product also means looking after that system.
- **It doesn't replace your judgement.** Decisions about what to build, and any change to the architecture, still go through a human. The harness repeats your judgement. It doesn't invent it.

## So what now?

If you're an engineer, the question to ask yourself is no longer "how fast can I build this?". It's "what would I need to build so that this, and everything after it, builds itself to the standard I care about?".

Build that. Ship the first version through it. Learn how it works. Then let the harness carry the follow-ups, and spend the time you get back on the things that never used to fit in a roadmap.

We have the tools and the time now to build really great experiences. And the world is just getting better and better.
