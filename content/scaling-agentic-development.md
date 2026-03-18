---
title: How far can you push delegation to coding agents and still have control over the codebase?
date: 2026-03-18T17:12:03.284Z
keywords: agents, ai, coding, engineering, speed, vibe
slug: scaling-agentic-development
---

This Saturday I built https://vibes-sdk.a7ul.com in 5 hours. I wanted to test and see how far I can push delegation to coding agents.
I wanted to build a fully featured AI Agents SDK for TypeScript (ironically using AI agents). But I wanted it to be production ready and better than anything else out there for TypeScript.
We at Filed use Pydantic AI and it has been a game changer. The flexibility and durability it gives us is unmatched. So I thought, why not build a port of Pydantic AI? But the challenge was that it's a huge library with tons of features.

If I tell an AI agent to simply port over a complex library in one shot it would definitely hallucinate - and how would I even know if it did a good job? Turns out it's definitely possible if we go back to basics.

The future of software development is already here. Background agents are real - have a look at [background-agents.com](https://background-agents.com). Cursor recently used agents to build a web browser from scratch. Software timelines that used to take months are collapsing into days (or even hours).

This is genuinely exciting. Traditionally, startups move much faster than larger companies because of lower communication overhead. With coding agents, that velocity has 100x'd. But behind this velocity we encounter new problems that we never had to deal with before.

## Andrew and Stelios and their 6 Claude Code terminals

But that's not the interesting part. The interesting part is what happened at work the week before.

I walked over to Andrew and Stelios's desks. Andrew is one of our founding engineers at Filed and Stelios is our Head of AI. It's tax season, which means bugs coming in, tax pros waiting, deadlines that don't move.

They each had 6 Claude Code terminals open at once. One firefighting a bug. Another shipping a feature they'd been wanting to build for days. A couple more handling smaller things in parallel. These guys were each single-handedly operating like a small engineering team.

Watching them work got me thinking. Not about Andrew or Stelios, but about the pattern itself. When you're orchestrating 6 parallel workstreams, you're naturally operating at a higher level of abstraction. You're steering, not reading every line. That's the right call for moving fast. But it made me wonder: as a team, how do we make sure this kind of velocity stays sustainable? What's the safety net?

## My Saturday

This Saturday I decided to try something for fun. I was building Vibes SDK.

I built [vibes-sdk.a7ul.com](https://vibes-sdk.a7ul.com) in 5 hours. Full feature parity, complete docs, logo, everything. Everything you see on that website was built exclusively by coding agents - including the logo, the docs, automations. I made the decisions and glanced through the code to make sure it was following best practices.

To ensure that I could trust the code, I followed a simple process. I asked agents to look at the Pydantic AI library and first write the test cases - basically TDD. I reviewed the test cases and then asked the agents to design the architecture, add docs for best practices, and plan the work. I used parallel agents and a Claude skill called [GSD (Get Shit Done)](https://github.com/pcarion/gsd) to orchestrate the work. I then let the agents run for a solid 3 to 4 hours while I went out for a walk and bought some groceries.

When I came back, I ran the test cases and they all passed - the agents had used the test cases as a way to validate the code they generated. Then all I had to do was skim the codebase to see if the structure felt readable. That was it. I did not read every line. I could not have in 5 hours. Eventually I added more test cases to check if it was handling edge cases correctly. In the end, I had 600+ test cases as my safety net, and that was enough to trust what was shipping.

I do have to admit - after the agents finished, they did a better job at a faster pace than what I would have done manually in a week. The result is a production-ready SDK that can be used for real world applications. That experience is what made the solution click for me.

## The old problem, amplified

When companies like Google scaled to hundreds of engineers, they ran into a specific set of coordination problems. Too many people merging changes at once, knowledge getting siloed, bugs slipping through because nobody had the full picture. Their answer was heavy gating: PR reviews, DevOps signoffs, release cycles, automated checks, test suites.

Agentic coding brings the same coordination overhead to a 5-person startup. Andrew and Stelios with 6 Claude Code terminals each are producing the change volume of a small engineering team. The knowledge concentration, the single points of failure, the black-box features - these are big-tech problems, now landing on every small team that is moving fast with agents.

But the flip side is also true. Agents bring big-tech-scale solutions without the headcount or the ceremony. Large-scale test generation is now cheap. Automatic code style and practice reviews are now cheap. Automatic documentation is now cheap. All the discipline, without burning your engineers on process overhead.

## At Filed, we ship features in days thanks to coding agents. Here is why we are doubling down on basics

The answer is not more tooling. It is fundamentals.

**Test-driven development at scale.** Codegen made test generation cheap too. Every PR should come with its own test cases. When that happens, the reviewer does not need to read every line of implementation. They scrutinize the test cases in depth and skim the rest. The person orchestrating the agents focuses their energy on the test suite, not on reading AI-generated code line by line. This is exactly how I reviewed Vibes SDK. It works.

**Tests as institutional memory.** AI agents are narrow-scoped by nature. They do not carry the historical context of your codebase. When an agent makes a change without proper test coverage, you end up with silently broken features that nobody catches until a tax pro calls you in the middle of tax season. Test suites have always solved this for large organisations. The cost of writing them has now collapsed for everyone.

**Automated coding skills.** The third piece is codifying your best practices and having an agentic PR reviewer check whether those practices were actually followed. Agents validating their own work against your team's standards. This closes the loop between fast generation and safe shipping.

Together these do two things: they introduce historical context through test cases, and they put constraints in place that make fast work safe work - for humans and agents both.

The teams that win will not be the ones deploying the most agents. They will be the ones using agents to enforce discipline too. Andrew and Stelios can have their 6 terminals each. The test suite is what makes that safe.

**The fundamentals did not change. They just got more important.**
