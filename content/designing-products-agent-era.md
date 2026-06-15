---
title: Stop building products for users. Build for supervisors.
date: 2026-06-15T00:00:00.000Z
description: We spent 10-15 years designing apps for humans to do the work. Now agents can do the work. Here's how product thinking needs to shift.
keywords: agents, ai, product, design, ux, delegation
slug: designing-products-agent-era
---

I am Atul, cofounder at [Filed](https://www.filed.com/). We build products for tax professionals in the US, and I lead the product team. Over the last two years we've had some learnings that have fundamentally changed how I think about building software.

<figure style="margin:2rem 0 2.5rem;text-align:center"><a href="https://www.filed.com/" target="_blank" rel="noopener noreferrer"><img src="./_diagrams/filed-wordmark.png" alt="Filed." style="width:140px;height:auto;display:inline-block;filter:invert(1)"></a></figure>

We started [Filed](https://www.filed.com/) to automate data entry for tax professionals. I vividly remember a jaw-dropping moment when my co-founder [Leroy](https://www.linkedin.com/in/leroykerry/) and I visited a small two-person firm in Colorado, about two years ago. I couldn't believe that firms were still manually keying in so much data. It felt like an obvious problem to solve. So we solved it - and over the next two tax seasons we built solutions that provided real, measurable value by automating away a significant chunk of that work.

We shipped a solid SaaS product, built on everything the team had learned at great startups. But one thing kept coming back: **the core platform had incredible capabilities, yet the interface we put in front of it was a ceiling** - it limited what a user could actually do.

Two tax seasons in, we realised we were building software the way it's been built for 20 years: users come in, sit down, and do the work. I strongly believe this is not how software should be built in the AI era.

## Moving atoms to bits was step one. This is step two.

To understand what's actually changed, it helps to zoom out and look at how companies have provided value to customers over time.

@figure(_diagrams/levels.svg, "Three eras of value creation - Physical, Digital, Agentic")

| Era | Interface | Who does the work | Scale ceiling | Example |
|---|---|---|---|---|
| **L1 · Physical** | A branch, a person, paper | Staff, with you present | Bounded by physical presence | Walk into a bank |
| **L2 · Digital** | An app or website | *You* — the operator | Bounded only by servers | Stripe, Airbnb, Uber |
| **L3 · Agentic** | An agent you supervise | The agent, on your behalf | Bounded by trust, not headcount | The next trillion-dollar companies |

**Level 1 - Physical goods and services.** Value was real but slow, location-dependent, and expensive to scale. Every interaction needed a human on both sides, and information moved on paper.

**Level 2 - The digital transformation era.** The internet removed the ceiling on reach. A bank was no longer bounded by how many branches it could open - it could serve a million customers from one platform. This is where the first billion-dollar companies were born - not because they invented new industries, but because **they removed the ceiling on how far a single company could reach.** The process moved to a screen, and you became the operator.

But notice - physical banking didn't disappear. Incumbents added Level 2 *on top of* Level 1. You probably still trust a bank with a physical presence more than a purely digital one - because if the app goes down, you can walk into a branch. **The physical layer is the safety net.**

**Level 3 - The agentic era.** Just as Level 2 gave us the first billion-dollar companies, Level 3 will give us the first trillion-dollar ones. We already have them - Anthropic and SpaceX at roughly a trillion, with OpenAI close behind.

Most companies today are still in Level 2 with AI features bolted on. But **if your users still have to come to the product and verify everything themselves, it's still Level 2** - the interface is still treating the user as the operator. The agentic era isn't about users coming to do the work. It's about delegation. **We can now delegate real work.**

If your core product value still depends on bringing users to your interface to do most of the work, you are building a Level 2 product. Let me explain.

Let's imagine what delegation looks like with the bank example again.

Even with a mobile app and push notifications, I check my balance and transactions at least once or twice a week. Just to make sure everything looks right, that there are no weird charges, nothing unexpected. It's a small task, but it's one I show up for. I open the app, scroll through, and close it. Every week.

Now imagine I delegated this to someone I trust. They'd:

- **Learn what's normal** for me over time - the coffee, the groceries, the subscriptions.
- **Flag only what doesn't fit**, so I never have to open the app to check.
- **Act proactively** - "your money's been sitting idle for months, you could be doing more with this."

That's exactly what an agent can do. The only moment I'm involved is the one that requires my judgement. I'm not the operator anymore. I'm the supervisor.

So does this mean we should redesign our interfaces so agents can operate on them? Should we just expose MCPs so Claude or OpenAI can connect to our product and drive it directly?

## "Build the UI for agents" is probably not necessary for your product

No.

UI is always built for humans. That's not a legacy assumption - it's still true. The interface exists so a person can understand what's happening, make decisions, and stay in control.

MCPs and CLIs are great - they're the machine interfaces agents use to reach into a platform, and necessary if you're building at Level 2. If your users want to give their own agents access, let them - but build it properly, with safe, structured access and controls. Because if you don't, agents will use your product anyway, through the UI you built for humans - with no guardrails, no rate limits, no audit trail.

The platforms that should build MCP are the underlying ones - banks, ecommerce platforms, data providers. The *pipes* agents reach into.

But if you're building an AI-native product, your job is not to expose your product to someone else's agent. **Your job is to build the agent.** You sit above the pipes - your value is the intelligence and delegation layer on top, not becoming a better pipe. For Level 3 products, MCPs aren't necessary to get started; a good addition later, but not what moves the needle early.

So should you build your own model? No - you'd be in a permanent race against OpenAI and Anthropic that you can't win, spending your best engineering time chasing a frontier that moves every month.

**The best strategy is to build a boat that rises with the tide.** Use the models; as they get better, your product does too. Your edge isn't the model - it's the domain knowledge, the workflows, the trust you've built, and the agent layer you've designed on top.

## Adding a chatbot won't get you there either

The next instinct we usually reach for is: add a chatbot. Put a chat interface on top of the product, let users ask questions, have the AI respond. Ship it. Job done.

@figure(_diagrams/chatbot-example-gitbook.png, "GitBook's AI assistant - this is a great feature and adds real value. But I classify this as a product that works in Level 2.")

It's not done.

**A chatbot is a tool for doing, not for delegating.** It falls short in three ways:

- **It doesn't convey what's possible.** A blank input box is a search bar with a friendlier tone. The user doesn't know what to ask, what workflows exist, or what the agent can run on their behalf - the burden is entirely on them.
- **A wall of text is slow to read.** If the agent returns prose, the user still has to process it all. That's outsourcing the typing but keeping the thinking.
- **It has no memory of what you've delegated.** Every conversation starts fresh - no ongoing tasks, no standing instructions, no background work. You're still showing up, prompting, waiting, reading.

Chat is not the enemy - it's actually a crucial part of the interface. But it's one piece, not the whole thing. The supervisor on a factory floor communicates mostly through conversation. But the conversation is in service of work that runs without them. That's the distinction.

## Think of yourself as a supervisor, not a user

Take inspiration from the factory floor. There's a production line - repetitive tasks, running continuously. The supervisor isn't on the line; they give instructions, set expectations, and step in when something needs their attention. Most of the time, the line just runs.

@figure(_diagrams/supervisor.svg, "The Level 3 mental model - you supervise a line of agents that runs without you, and step in only when judgement is needed.")

That's the mental model for Level 3 products. The workers on the belt are agents now, handling the repetitive tasks your users used to come do themselves. The user's job shifts: **they set it up, teach the agent how they want things done, and step in when a decision requires their judgement.** The interface should feel less like a tool you operate and more like a team you manage.

It shows up everywhere:

- **Ecommerce.** Instead of search → filter → scroll → compare, you tell the agent your size, budget, and brands. It brings a shortlist; you pick one and confirm.
- **Airline booking.** You describe dates, destination, and how many stops you'll tolerate. The agent finds and ranks the options; you confirm one - reviewing a recommendation, not scrolling through 200 results.

@figure(_diagrams/filed-binder.webp, "Filed - notice how an AI agent was the first 'user': it signed off the documents and drafted the review, while the human comes in next as the supervisor.")

> **If you were to delegate this task to someone you trust and you are only allowed to communicate using this interface - how should the interface look so you can explain it well? How would you correct them when they did something wrong?**

That question reframes everything. It's not "how does the user do the task?" It's "how does the user hand the task off?"

When you delegate to a person, you explain what you want and how, set expectations, give enough context for good decisions, and correct them when they're wrong - by adjusting their understanding, not by redoing the work yourself.

That's the interface you need to build. Not a screen for doing the work - a screen for teaching, instructing, and staying informed. In practice, your product needs four things:

@figure(_diagrams/four-pillars.svg, "The four things every Level 3 product needs.")

**1. Delegate.** The user hands off a task - sets it up, defines what done looks like, and lets the agent run without being present. Not a one-time prompt but an instruction that persists: "Do this every morning." "Whenever X happens, do Y." The best way to enable this is predefined tasks - end-to-end workflows already built and tuned before the user touches them. The baseline experience: pick a task, kick it off, go home.

At [Filed](https://www.filed.com/), this looks like prebuilt workflows for tax prep, tax review, and tax planning. These are tasks we've tuned to work well for the vast majority of firms - 80% of the time, they run end to end without intervention. The tax pro doesn't need to configure anything. They start the workflow and the agents handle it. That's what delegation-first design actually looks like in production.

**2. Teach.** Predefined tasks get you 80% of the way. The remaining 20% is what's specific to this firm, this team - their rules, preferences, and quirks. In the Claude world these are skills; call them whatever fits your domain. **A delegation agent is only as good as what it's been taught**, so the interface should make it easy to capture that knowledge and refine it over time. When the agent gets something wrong, the user corrects the *instruction* - and the product remembers, so it doesn't happen again.

**3. Monitor.** Tasks must run completely in the background - if the user has to stay glued to the screen, you've just built a slightly more automated version of the old product. But they still need somewhere to come back to: what the agent did, what it's working on, what's done, where it got stuck. **The monitor view is not where work happens. It's where trust is maintained.**

**4. Stay in control.** When something needs the user's judgement, they must be able to stop and step in. And this is the important bit - **your Level 3 product has to include the Level 2 interface.** Users need to drop down, do the work manually, and hand it back - not as a workaround, but as a first-class part of the product. Stepping in should feel like taking the wheel, not abandoning the car.

## The fallback matters as much as the delegation

Just as physical banking didn't disappear when Level 2 arrived, the manual interface doesn't disappear in Level 3. Users still need to drop down and do the work themselves. That's not a concession - it's by design, for two reasons:

- **Trust.** A user only delegates if they believe they can always take back control. If it feels like handing the keys over permanently, people won't delegate at all. **The ability to step in manually is what makes delegation feel safe.**
- **Irreversibility.** Some actions should never happen without explicit human approval. **The irreversible step always requires a human in the loop:**
  - Ecommerce - the agent can filter, search, and rank, but the *checkout* is yours.
  - Flight booking - it can find the best options, but *confirming the ticket* is yours.
  - Finance - it can flag, analyse, and recommend, but *moving money* is yours.

The interface needs to make that boundary clear: what the agent handles, what you decide, and how to move between the two without friction.

## From doing to delegating

The shift from Level 2 to Level 3 is not about adding AI to your product. It's about rethinking what your product fundamentally is.

| | **Level 2 · Doing** | **Level 3 · Delegating** |
|---|---|---|
| User's role | Operator | Supervisor |
| Why they show up | To complete the task | To set up, teach, review, decide |
| Measure of success | How fast they can do the work | How little they need to show up - and how much they trust what runs in their absence |

That's a completely different product - a different interface, onboarding, and relationship with the user. You're not trying to make the work easier. You're trying to make yourself unnecessary for most of it.

At [Filed](https://www.filed.com/), this is what we're building towards. We're not a tool tax professionals use to do their work faster. We're a platform they use to delegate their work - and step in when their judgement is needed. The software is less like a desk and more like a team.

One small signal of how seriously we take this: **we don't measure weekly active users. We measure weekly active sessions.** A session, for us, is a task completed - by either a human or an AI agent. If the agent did the work while the user was sleeping, that counts. That's the metric that reflects what we're actually building.

All AI-native products need to make this shift. Stop designing for the user who comes in to do the task. Start designing for the supervisor who checks in, teaches, and stays informed. The interface follows from that. So does everything else.

---

**If there is one key takeaway from this post, it is this:**

> **If you were to delegate this task to someone you trust and you are only allowed to communicate using this interface - how should the interface look so you can explain it well? How would you correct them when they did something wrong?**

Every product decision in the agent era flows from that question.
