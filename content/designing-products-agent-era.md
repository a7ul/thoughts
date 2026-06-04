---
title: Rethinking products in the agent era
date: 2026-06-04T00:00:00.000Z
description: We spent 10-15 years designing apps for humans to do the work. Now agents can do the work. Here's how product thinking needs to shift.
keywords: agents, ai, product, design, ux, delegation
slug: designing-products-agent-era
---

I am Atul, cofounder at Filed. We build products for tax professionals in the US, and I lead the product team. Over the last two years we've had some learnings that have fundamentally changed how I think about building software.

We started Filed to automate data entry for tax professionals. I vividly remember a jaw-dropping moment when my co-founder Leroy and I visited a small two-person firm in Colorado, about two years ago. I couldn't believe that firms were still manually keying in so much data. It felt like an obvious problem to solve. So we solved it - and over the next two tax seasons we built solutions that provided real, measurable value by automating away a significant chunk of that work.

We built the software based on all our previous experiences at great startups the team had worked at. We shipped a SaaS product that provided real value to our customers. But one thing kept coming back: the core platform we had built had incredible capabilities, and yet the interface we put in front of it was a ceiling. It limited what a user could actually do.

Two tax seasons in, we realised we were building software the way software has been built for 20 years. Software where users come in, sit down, and do the work.

I strongly believe this is not how software should be built in the AI era.

## Moving atoms to bits was step one. This is step two.

To understand what's actually changed, it helps to zoom out and look at how companies have provided value to customers over time.

@figure(_diagrams/levels.svg, "Three eras of value creation - Physical, Digital, Agentic")

**Level 1 - Physical goods and services.** Before software, companies had a physical presence. You wanted to open a bank account, you walked into a branch. A person sat across from you, took your details, filed the paperwork, and opened the account. The value was real, but it was slow, location-dependent, and expensive to scale. Every interaction required a human on both sides of the table. Information moved via paper - forms, folders, filing cabinets.

**Level 2 - The digital transformation era.** Then came the internet. And it changed something fundamental: the limit on how much value a company could provide. Geography stopped being a constraint. A bank was no longer bounded by how many branches it could afford to open. It could serve a million customers from a single platform. This is where the billion-dollar companies were born - Stripe, Airbnb, Uber. Not because they invented new industries, but because they removed the ceiling on how far a single company could reach.

Take the bank example: I can't imagine opening an account with a bank that doesn't have a website and a mobile app. I can't imagine walking to an ATM every time I want to pay for something. The digital interface isn't a nice-to-have anymore - it's the baseline. The process moved to a screen, and that became the expectation. You became the operator.

But notice - physical banking didn't go away. The incumbents added Level 2 on top of Level 1. They didn't replace the branch; they extended the reach. And if you think about it, you probably still trust a bank with a physical presence more than a purely digital one with your hard-earned money. Because somewhere in the back of your mind you know: if the app goes down, if something goes wrong, you can walk into a branch and someone will help you. The physical layer is the safety net.

**Level 3 - The agentic era.** This is where we are headed. And just as Level 2 gave us the first billion-dollar companies, Level 3 will give us the first trillion-dollar ones.

Most companies today are still in Level 2. They've added AI features to a SaaS product. The AI does the work. But if your users still have to come to the product and verify everything themselves, it's still Level 2. The interface is still treating the user as the operator.

The agentic era is not about providing software where users come and do the work. It's about delegation. We already have our first trillion-dollar companies - Anthropic is valued at roughly a trillion dollars, with OpenAI and SpaceX following close behind. The scale of value being created at this layer is unlike anything we saw in the SaaS era - because we are not just breaching the scale that the digital transformation era created. We can now delegate real work.

If your core product value still depends on bringing users to your platform to use your interface to do most of the work - you're building in Level 2. Let me explain.

Let's imagine what delegation looks like with the bank example again.

Even with a mobile app and push notifications, I check my balance and transactions at least once or twice a week. Just to make sure everything looks right, that there are no weird charges, nothing unexpected. It's a small task, but it's one I show up for. I open the app, scroll through, and close it. Every week.

Now imagine I delegated this to someone I trust. How would that look?

I'd tell them: check my transactions every morning, let me know if anything looks off. They'd learn over time what's normal for me - the coffee, the groceries, the subscriptions. They'd only come to me when something didn't fit. I wouldn't need to open the app. I'd just hear from them when it mattered.

That's delegation. And that's exactly what an agent can do. It checks for me every morning. It knows what normal looks like. It flags what doesn't fit and tells me. I only look when there's something worth looking at.

And it doesn't stop there. That same person might notice that my money has just been sitting in a current account for months and mention it - "hey, you could be doing more with this." They'd point me to better options. They'd act like someone who's paying attention to my finances, not just waiting to be asked.

The only moment I'm involved is the one that requires my judgement. I'm not the operator anymore. I'm the supervisor.

So does this mean we should redesign our interfaces so agents can operate on them? Should we just expose MCPs so Claude or OpenAI can connect to our product and drive it directly?

## "Build the UI for agents" is probably not necessary for your product

No.

UI is always built for humans. That's not a legacy assumption - it's still true. The interface exists so a person can understand what's happening, make decisions, and stay in control.

Now, MCPs and CLIs are great - they are necessary if you are building at Level 2. They are the machine interfaces that agents need to reach into your platform. If you want your users to give their own agents access to your product, you should let them - and build for it properly, with safe, structured access and the right controls in place. Because if you don't, agents will still try to use your product. They'll just do it through the UI you built for humans. And that's worse - there are no guardrails, no rate limits, no audit trail. You lose visibility and control entirely.

The platforms that should be building MCP are the underlying ones - the banks, the ecommerce platforms, the data providers. The pipes that agents need to reach into. If you're building at that layer, yes, you need to think about how agents will interact with your system.

But if you're building an AI-native product, your job is not to expose your product to someone else's agent. Your job is to build the agent. You sit above the pipes. Your value is in the intelligence and delegation layer on top - not in becoming a better pipe. For Level 3 products, MCPs are not necessary to get started. They can be a good addition down the line, but they're not what moves the needle early on.

So should you build your own model instead? Train something domain-specific for your industry?

That's not a great fit either. The rate at which model providers are innovating means you'd be in a permanent race you can't win. Every month, the frontier moves. You'd be spending your best engineering time competing with OpenAI and Anthropic - companies with hundreds of researchers and billions in compute. That's not a fight a product company should pick.

The best strategy is to build a boat that rises with the tide. Use the models. Let them get better - your product gets better with them. Your edge is not the model. It's the domain knowledge, the workflows, the trust you've built with your users, and the agent layer you've designed on top.

## Adding a chatbot won't get you there either

The next instinct we usually reach for is: add a chatbot. Put a chat interface on top of the product, let users ask questions, have the AI respond. Ship it. Job done.

@figure(_diagrams/chatbot-example-gitbook.png, "GitBook's AI assistant - this is a great feature and adds real value. But I classify this as a product that works in Level 2.")

It's not done.

A chatbot is a tool for doing, not for delegating. There are a few reasons it falls short.

First, it doesn't convey what's possible. When a user opens a chat box, they don't know what to ask. They don't know what the agent can and can't do, what workflows exist, what it can run on their behalf. A blank input box is not a delegation interface - it's a search bar with a friendlier tone. It signals to users that there's more possible, but puts the burden entirely on them to figure out what to ask.

Second, a stream of text is slow to read. If an agent does work and returns a wall of prose, the user still has to process everything themselves. That's not delegation - that's outsourcing the typing but keeping all the thinking.

Third, and most importantly, a chatbot has no memory of what you've delegated. Every conversation starts fresh. There's no concept of ongoing tasks, standing instructions, or work happening in the background while you're doing something else. You're still the one showing up, prompting, waiting, reading.

Chat is not the enemy - it's actually a crucial part of the interface. But it's one piece, not the whole thing. The supervisor on a factory floor communicates mostly through conversation. But the conversation is in service of work that runs without them. That's the distinction.

## Think of yourself as a supervisor, not a user

Let's take inspiration from the factory floor. Think about how it works. There's a production line - repetitive tasks, running continuously, churning out output. The supervisor isn't on the line. They're not operating the machines or doing the work themselves. They give instructions, set expectations, and check in when something needs their attention. Most of the time, the line just runs.

That's the mental model for Level 3 products.

The workers on the belt are agents now. The repetitive, process-heavy tasks - the ones your users used to come to your product to do themselves - those run in the background. The user's job shifts. They're no longer the one doing the work. They're the one who set it up, who taught the agent how they want things done, and who steps in when a decision requires their judgement.

The interface needs to reflect that. It should show what's running, what's been done, what needs attention. It should make it easy to give instructions and easy to course-correct. It should feel less like a tool you operate and more like a team you manage.

Take ecommerce. Today you open the app, search, filter, scroll, compare, and eventually buy. You're doing all of that. In a Level 3 product, you tell the agent what you're looking for - your size, your budget, the brands you like - and it does the searching and filtering. It brings you the shortlist. You pick one and confirm the purchase. The agent handled the repetitive part. You handled the decision.

Or take airline booking. You go in and describe what you need - dates, destination, preferred times, how many stops you'll tolerate. The agent finds the options that fit. It ranks them. You confirm the one you want. You weren't scrolling through 200 results. You were reviewing a recommendation from something that already knew your preferences. That's the supervisor relationship in practice.

@figure(_diagrams/filed-homepage.png, "Filed - built for delegation, not for doing.")

_If you were to delegate this task to someone you trust, using this interface - how would you explain it to them? And how would you correct them if they got it wrong?_

That question reframes everything. It's not "how does the user do the task?" It's "how does the user hand the task off?"

When you delegate to a person, a few things happen naturally. You explain what you want done and how you want it done. You set expectations. You give them enough context to make good decisions without checking in with you constantly. And when they get something wrong, you correct them - not by redoing the work yourself, but by adjusting their understanding so they get it right next time.

That's the interface you need to build. Not a screen for doing the work. A screen for teaching, instructing, and staying informed.

In practice this means your product needs four things - and your primary interfaces should be designed around all four of them.

**1. Delegate.** The user needs to be able to hand off a task - set it up, define what done looks like, and let the agent run with it without being present. This isn't a one-time prompt. It's an instruction that persists. "Do this every morning." "Whenever X happens, do Y." The interface needs to make that kind of standing delegation feel natural, not technical.

The best way to do this is with predefined tasks - end-to-end workflows that are already built, polished, and tuned before the user ever touches them. When someone lands on the product for the first time, things should already be ready to run. The baseline experience is: pick a task, kick it off, go home.

At Filed, this looks like prebuilt workflows for tax prep, tax review, and tax planning. These are tasks we've tuned to work well for the vast majority of firms - 80% of the time, they run end to end without intervention. The tax pro doesn't need to configure anything. They start the workflow and the agents handle it. That's what delegation-first design actually looks like in production.

**2. Teach.** Delegation without teaching breaks down fast. Predefined tasks get you 80% of the way. The remaining 20% is everything that's specific to this firm, this team, this way of working. Every firm has its own rules, preferences, and quirks. The agent needs to learn those - and your product needs to be the place where that knowledge lives.

In the Claude world, these are called skills. But you can call them whatever fits your domain - firm rules, preferences, standard operating procedures, the way we do things here. The point is that your product is a delegation agent, and a delegation agent is only as good as what it's been taught. The interface should make it easy to capture that knowledge, refine it over time, and apply it consistently across every task the agent runs.

When the agent gets something wrong, the user shouldn't have to redo the work themselves. They should be able to correct the instruction - and the product should remember that correction so it doesn't happen again.

**3. Monitor.** Tasks need to be able to run completely in the background - without the user watching, waiting, or checking in. That's the whole point. If the user has to stay glued to the screen to make sure things are going well, you haven't built a delegation product. You've built a slightly more automated version of the old one.

But users still need a place to come back to. When they do check in, the interface should show them everything - what the agent did, what it's currently working on, what's been completed, where it got stuck. Full audit trail. Current status. Clear enough that a quick glance is all it takes to stay informed. The monitor view is not where work happens. It's where trust is maintained.

**4. Stay in control.** When something requires the user's judgement, they need to be able to stop the work and step in themselves. And this is the important bit - your Level 3 product has to include the Level 2 interface. Users need a way to drop down, complete the work manually in the traditional interface, and then hand it back. Not as a workaround. As a deliberate, first-class part of the product.

The agent handles what it can. The user handles what it can't. The interface makes that handoff seamless - so that stepping in feels like taking the wheel, not abandoning the car.

## The fallback matters as much as the delegation

Just as physical banking didn't disappear when Level 2 arrived, the manual interface doesn't disappear in Level 3. Users still need to be able to drop down and do the work themselves. That's not a concession - it's by design.

There are two reasons for this.

The first is trust. A user will only delegate to an agent if they believe they can always take back control. If the interface makes it feel like you're handing the keys over permanently, people won't delegate at all. The ability to step in manually is what makes the delegation feel safe.

The second is irreversibility. There are actions an agent should never take without explicit human approval. In ecommerce, an agent can filter, search, compare, and rank - but the checkout is yours. In flight booking, it can find the best options based on your constraints - but confirming the ticket is yours. In finance, it can flag, analyse, and recommend - but moving money is yours. The irreversible step should always require a human in the loop.

The interface needs to make that boundary clear. What the agent handles. What you decide. And how to move between the two without friction.

## From doing to delegating

The shift from Level 2 to Level 3 is not about adding AI to your product. It's about rethinking what your product fundamentally is.

Level 2 products are built for doing. Users come in, use the interface, complete the task, and leave. The measure of success is how fast and how easily they can do that work.

Level 3 products are built for delegating. Users come in to set things up, to teach, to review, to decide. The work happens without them. The measure of success is how little they need to show up - and how much they trust what's running in their absence.

That's a completely different product. A different interface, a different onboarding, a different relationship with the user. You're not trying to make the work easier. You're trying to make yourself unnecessary for most of it.

At Filed, this is what we're building towards. We're not a tool tax professionals use to do their work faster. We're a platform they use to delegate their work - and step in when their judgement is needed. The software is less like a desk and more like a team.

All AI-native products need to make this shift. Stop designing for the user who comes in to do the task. Start designing for the supervisor who checks in, teaches, and stays informed. The interface follows from that. So does everything else.

---

**If there is one key takeaway from this post, it is this:**

*If you were to delegate this task to someone you trust and you are only allowed to communicate using this interface - how should the interface look so you can explain it well? How would you correct them when they did something wrong?*

Every product decision in the agent era flows from that question.
