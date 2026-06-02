---
title: Designing products in the agent era
date: 2026-06-02T10:00:00.000Z
keywords: products, agents, ai, design, ux, engineering
slug: designing-products-agent-era
---

For the last twenty years we designed software for one kind of user: a human with a mouse, then a human with a thumb. Every product instinct we have is downstream of that assumption. Onboarding funnels, empty states, tooltips, the perfectly placed call-to-action button. We got very good at reducing the number of clicks between intent and outcome.

Then I watched a customer at Filed try to do their taxes by typing a sentence into a box and walking away. No clicks. No funnel. They described what they wanted and let an agent go figure out the rest. And it hit me that most of the product surface I'd spent years obsessing over had just become invisible plumbing.

That is the shift. Your user is no longer only the human. Increasingly, your user is an agent acting *on behalf of* a human. And those two users want completely different things from your product.

## Two users, one product

A human wants to be guided. They want affordances - buttons that look clickable, a layout that tells them where to look next, gentle nudges when they get stuck. The whole craft of UX is making the next step obvious.

An agent wants none of that. An agent wants a clear contract. Give it a capability, a description of what that capability does, and a predictable result. It does not need a tooltip. It needs to know that `file_return(client_id, tax_year)` exists, what it expects, and what it returns when something goes wrong.

The trap I see teams fall into is treating the agent like a slightly faster human. They bolt a chat box onto an existing UI and call it agent-ready. But an agent driving your human UI through screenshots and synthetic clicks is the worst of both worlds - slow, brittle, and impossible to debug. **If your product is only reachable through pixels, you have not built for agents. You have built an obstacle course they have to solve every single time.**

## Capabilities, not screens

At Filed we deal with tax. Tax is the perfect stress test for this because the work is genuinely complex - it is not a to-do app. There are hundreds of forms, edge cases for every life event, deadlines that do not move.

The old way to ship a feature was to design a screen. "Add a screen where the tax pro reviews flagged deductions." The new way is to ship a capability: `list_flagged_deductions(return_id)` that returns structured data with reasons. Once that capability exists, the human screen is *one* consumer of it. The agent is another. A future automation is a third.

When you design capability-first, something nice happens. The same primitive that powers your agent also powers a cleaner API, a better integration story, and honestly a better human UI - because you were forced to name the actual thing the user is trying to do, instead of the screen they happen to be looking at.

**Design the verb, not the view.** The view is just one rendering of the verb.

## The interface is collapsing into intent

The most disorienting part of this era is that the interface is shrinking toward a single text box and a microphone. That feels like a loss of control to a lot of product people. It is not. It just moves the design problem.

When the user can ask for *anything*, your job is no longer arranging buttons. Your job is two things: understanding intent, and earning trust on the way to the outcome.

Understanding intent means your product has to be honest about what it can and cannot do. An agent that confidently does the wrong thing is far more dangerous than a button that is grayed out. In tax, a confidently wrong number is not a UX papercut - it is a letter from the IRS.

## Trust is the new conversion funnel

Here is the thing nobody warns you about. When you remove the clicks, you also remove all the little moments where the human used to confirm reality. Every screen they walked through was a checkpoint. They saw the number, they saw the form, they felt in control. Agents collapse all of that into a single "done."

So the new design work is putting the checkpoints back - deliberately, in the right places. Not everywhere, which would defeat the point, but at the moments that matter.

This is the same lesson I keep relearning. In my [last post](/scaling-agentic-development.html) the safety net for agent-written *code* was a test suite. For agent-driven *products*, the safety net is a trust layer:

**Show your work.** When an agent files a deduction, the human should be able to see why, traced back to the source document. Reasoning that can be inspected beats a result you have to take on faith.

**Make actions reversible, or gate them.** Anything cheap and reversible, let the agent do freely. Anything expensive or irreversible - submitting to the IRS - gets an explicit human checkpoint. Designing products now means deciding, for every action, which side of that line it sits on.

**Default to steering, not approving.** The best agent products do not stop and ask permission at every step. They run, they narrate what they are doing, and they make it trivial to interrupt and correct course. The human is a pilot with a hand near the controls, not a clerk stamping forms.

## So what does a product designer actually do now?

Less pixel-pushing. More defining the verbs, the guardrails, and the moments of trust. The questions on the table have changed:

- What are the actual capabilities this product exposes, named in plain language?
- For each capability, is it cheap-and-reversible or expensive-and-irreversible?
- Where does the human need to see reality, and where are we just adding friction?
- How does the agent find out what it is allowed to do, and what it did wrong?

None of these are visual questions. They are product questions, and they were always the real ones. The screen was just where we used to answer them.

The agent era does not kill product design. It strips away the decoration and leaves the part that was always hard: understanding what someone is actually trying to do, and getting them there safely. **The funnel is gone. The judgment is not.**
