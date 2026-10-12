---
title: "Using Jev to make your agents write the code and design the app the way you do: Moving beyond tests and lints"
date: 2026-10-12T00:00:00.000Z
description: Tests and lints tell you the code works. They don't tell you it's written the way your team writes code. Here's how we use a decision model to close that gap at Filed.
keywords: agents, ai, coding, code review, jev, lint, tests, design
slug: agents-code-your-way
---

I'm going to be honest with you: your coding agent passes lint, passes tests, goes green in CI, and still writes code you would reject in review. Every single day. If you've been told that a good enough test suite is all you need to let agents loose on your codebase, I'm sorry, but someone sold you a slightly smaller version of the truth.

Tests check what the code *does*. Lint checks a few things about how it *looks*. Nobody is checking whether it's written *the way we write things here*. Up until recently that job rested on a few senior devs, in review, saying "...yeah, no" to the same five mistakes over and over again.

I'm Atul, cofounder at [Filed](https://www.filed.com/). We build agents for tax professionals, and a lot of our code is now written by other agents. A while back I wrote about [how far you can push delegation to coding agents](./scaling-agentic-development.html) and said the third leg of the stool was "codifying your best practices and having an agentic reviewer check them". This post is about what that turned into once we actually built it, and all the ways the first versions didn't work.

## Preface

This is not a "tests are dead" post. Tests and lints are still the first thing you reach for, and if a script can decide it, a script should decide it. Everything below is about the leftovers: the stuff that's obviously wrong to a human on your team and invisible to every tool you own.

Also, a confession about the title. Jev, from TypeSafe, is the decision model that got me hooked on this idea, but what we actually run in production is Perplexity's decider (`pplx-decider`). Same kind of API, one big difference: the Perplexity decider can look at **images**, which turns out to be great for checking that UI follows your design rules (more on that below). So I'm going to say "Perplexity decider / Jev" interchangeably in this post. Read it as "a decision model".

Here's what a decision model does: you give it some state and a list of yes-or-no questions, and it gives you back a probability per question. That's it. No essays. Hold onto that, it matters later.

## The stuff that slips through is not exotic

*It's boring. That's the problem.*

Here's the kind of thing that goes green through every pipeline we have:

- An `except Exception: return None` that turns a real failure into an empty screen and a very confused user.
- A tool registered on an agent twice, because the agent was already getting it from another toolset. Works fine. Tests pass. The model now sees the same tool twice and gets to guess which one you meant. Lovely.
- Shared code that grows another `if`/`else` branch every time a new case shows up, instead of that case getting its own module. Each branch looks harmless on its own. Ten of them later, the shared code is a pile of special cases nobody wants to touch.
- Every new frontend page, even after you've written down your design guidelines and rules, coming out looking like a generic Claude-generated UI. Good at first glance. Clean, modern, nothing obviously wrong. It just doesn't look like *your* app. It lacks its soul.

None of these break anything today. Every one of them makes the codebase a bit worse to work in tomorrow. And agents, being agents, will happily repeat the pattern the moment they see it in two places.

@figure(_diagrams/review-gap.svg, "Lint and tests catch what they were built to catch. Everything else walks straight past them into main.")

## We tried writing it down. The agents skimmed it.

The obvious move is to write your conventions down. So we did. In `AGENTS.md`. In `CLAUDE.md`. In a best-practices doc. In skills. In review notes. Probably in a Notion page somewhere too.

Here's what happens with that: the agent reads some of it, the context window eats the rest, and six months later you have four documents that disagree with each other about whether errors should bubble up. Prose drifts. Nobody tests prose. And a "do / don't" sentence buried in paragraph nine of a README is basically a suggestion.

## "Just ask an LLM to review the PR" is a vibes machine

*Ask it twice, get two reviews.*

The next obvious move is to throw the diff at a chat model and say "review this against our standards". We tried this too. You get back a nicely formatted essay. It flags a variable name. It praises your error handling. It suggests adding a docstring to a one-line function. Run it again and it flags a *different* variable name.

You cannot put a threshold on an essay. You cannot tell whether your instructions got better or worse. You cannot tell whether it actually looked at the thing you cared about, or just felt like commenting on something.

What I actually wanted was much dumber: one question per rule, one number per question.

## Enter Perplexity decider / Jev: it only answers yes or no

This is where a decision model earns its keep. You send it two things: a `state` (everything it needs to look at) and a set of named `questions`. It sends back one number per question. Let's walk through one review end to end: the rules, what gets sent to the Perplexity decider, and what comes back. (Imaginary online shop, made-up diff, illustrative numbers. The rule wording is our real wording.)

### Step 1: the rules

It all starts with a `rules.yaml`. Each rule is one claim the model can answer yes or no to, plus what to do about it:

```yaml
# shop/docs/review/rules.yaml  (simplified: in reality these are split across folders, see below)

- id: code.errors-bubble-up
  applies: ["**/*.py", "**/*.ts"]
  mistake: The change catches an exception and then returns None, an empty list,
    a default value or a fallback instead of letting the error raise
  fix: Let the error raise; handle it only where the caller can act on it
  reference: payments/retry.py
  cases:
    violating:
      - file: orders/lookup.py
        diff: |
          +    except Exception:
          +        return None
    compliant:
      - file: orders/lookup.py
        diff: |
          +    raise OrderNotFound(order_id)

- id: code.identity-from-token
  applies: ["**/graphql/**"]
  mistake: A GraphQL field, mutation argument or input type accepts an account ID,
    user ID or role from the caller
  fix: Read the account and user from the auth token in the resolver
  reference: graphql/resolvers/me.py
  cases: ...

- id: code.no-product-branches-in-shared-code
  applies: ["**/shared/**", "orders/**"]
  mistake: The change adds an if-check or filter on a specific product, task type,
    provider, surface or flavour inside shared or generic code
  fix: Move the specific behaviour into that product's or provider's own module or class
  reference: shipping/carriers/README.md
  cases: ...

- id: code.one-code-path
  applies: ["**/*.py", "**/*.ts"]
  statement: The change keeps one code path, with no fallback, legacy,
    compatibility or workflow.patched branches for old data or old callers
  fix: Remove the old path and migrate its data or drain its runs
  reference: docs/migrations.md
  cases: ...
```

A rule is either a `mistake` (true when the change breaks it) or a `statement` (true when the change follows it). Never both. `fix` and `reference` are for the agent. `cases` are for testing the rule itself, which we'll get to.

### Step 2: what gets sent to the Perplexity decider

The CLI finds the changed files, works out which rules apply to them, and turns each rule into a question. The question is the rule's own words, prefixed with where it applies:

```text
POST https://api.perplexity.ai/v1/decisions
{
  "model": "pplx-decider-v1.1-27b",
  "state": {
    "context":  "Changes in a pull request to the codebase, with the author's
                 summary. Each question is about these changes only. references
                 holds existing files that show the codebase's established pattern
                 for a rule; use them to judge whether the change reuses or
                 duplicates what already exists.",
    "summary":  "Add a 'create order' mutation for the new checkout flow",
    "files": [
      { "repo": "shop", "file": "orders/lookup.py",
        "diff": "+    try:\n+        return repo.get(order_id)\n+    except Exception:\n+        return None" },
      { "repo": "shop", "file": "graphql/inputs/create_order.py",
        "diff": "+    account_id: str\n+    items: list[OrderItem]" },
      { "repo": "shop", "file": "orders/update.py",
        "diff": "+    if order.channel == Channel.WHOLESALE:\n+        notify_wholesale_team(order)" }
    ],
    "references": [
      { "repo": "shop", "file": "payments/retry.py", "content": "..." },
      { "repo": "shop", "file": "graphql/resolvers/me.py", "content": "..." },
      { "repo": "shop", "file": "shipping/carriers/README.md", "content": "..." }
    ]
  },
  "questions": {
    "q0": { "type": "noul", "instructions": "In the shop repository, for files matching
            **/*.py, **/*.ts: The change catches an exception and then returns None, an
            empty list, a default value or a fallback instead of letting the error raise" },
    "q1": { "type": "noul", "instructions": "In the shop repository, for files matching
            **/graphql/**: A GraphQL field, mutation argument or input type accepts an
            account ID, user ID or role from the caller" },
    "q2": { "type": "noul", "instructions": "In the shop repository, for files matching
            **/shared/**, orders/**: The change adds an if-check or filter on a specific
            product, task type, provider, surface or flavour inside shared or generic code" },
    "q3": { "type": "noul", "instructions": "In the shop repository, for files matching
            **/*.py, **/*.ts: The change keeps one code path, with no fallback, legacy,
            compatibility or workflow.patched branches for old data or old callers" }
  }
}
```

That's the whole prompt. No "you are a senior engineer", no rubric, no "think step by step". Just the change, the files that show the right pattern, and four claims.

### Step 3: what comes back

```text
{
  "answers": {
    "q0": { "noul": 0.96 },
    "q1": { "noul": 0.93 },
    "q2": { "noul": 0.88 },
    "q3": { "noul": 0.94 }
  },
  "usage": { "input_tokens": 9412 }
}
```

Each number is the probability that the claim is true. For the three `mistake` rules, a high number is bad news. For the one `statement` rule, a high number is good news. So before showing anything to anyone, the CLI flips the mistakes (`1 - p`), so that every result reads the same way: the chance the change *follows* the rule.

| Rule | Kind | Raw answer | Compliance | |
|---|---|---|---|---|
| errors-bubble-up | mistake | 0.96 | 4% | hint |
| identity-from-token | mistake | 0.93 | 7% | hint |
| no-product-branches-in-shared-code | mistake | 0.88 | 12% | hint |
| one-code-path | statement | 0.94 | 94% | quiet |

Anything under 80% becomes a hint, sorted worst first, with the rule's `fix` and `reference` attached. Everything else stays quiet. And here's what the agent actually gets back in its terminal:

```text
filed review: 3 hints (1 calls, 9412 input tokens)
  4%  code.errors-bubble-up  shop/orders/lookup.py
      fix: Let the error raise; handle it only where the caller can act on it
      see: shop/payments/retry.py
  7%  code.identity-from-token  shop/graphql/inputs/create_order.py
      fix: Read the account and user from the auth token in the resolver
      see: shop/graphql/resolvers/me.py
 12%  code.no-product-branches-in-shared-code  shop/orders/update.py
      fix: Move the specific behaviour into that product's or provider's own module or class
      see: shop/shipping/carriers/README.md
compliance 1/4 rules at 80% or above
```

Because it's a number and not a paragraph, a bunch of things suddenly become possible:

- You can **threshold** it. Under 80% is a hint, everything else stays quiet.
- You can **compare** it. Same rule, same diff, different wording: which one separates good from bad better?
- You can **test** it. More on that in a minute, because it's the part that made the whole thing work.

## Rules live next to the code they judge

In step 1 I showed all four rules in one file to keep things simple. In reality, rules are not one giant flat file. They're **nested**, and they live next to the code they judge.

Any folder that cares can have its own `docs/review/rules.yaml`. A rule applies to its folder and everything below it. So the general stuff sits at the top, and the specific stuff sits right beside the code it's about:

```text
shop/
├── docs/review/rules.yaml                 errors bubble up, one code path      (everything)
├── graphql/
│   ├── docs/review/rules.yaml             identity comes from the token        (only GraphQL)
│   └── inputs/create_order.py
├── orders/
│   ├── docs/review/rules.yaml             no N+1 queries on the order list     (only orders)
│   └── update.py
└── shipping/
    ├── docs/review/rules.yaml             one module per carrier               (only shipping)
    └── carriers/
        ├── docs/review/rules.yaml         every carrier implements prepare()   (only carriers)
        └── fedex.py
```

When the agent is about to change `shop/graphql/inputs/create_order.py`, the CLI walks up from that file and collects every `rules.yaml` on the way: the one in `shop/graphql/` and the one in `shop/`. It never sees the shipping rules or the carrier rules, because it isn't touching that code. If it later wanders into `shipping/carriers/fedex.py`, it asks again and gets a different, equally short list.

This matters for three reasons:

- **The agent only reads what's relevant.** A flat file of 200 rules is 200 rules the agent has to read, mostly ignore, and still be distracted by. A nested set gives it the five that apply to the folder it's in.
- **Rules live with their owners.** The people who own the shipping code own the shipping rules, in the shipping folder. When the code moves or gets deleted, the rules go with it instead of rotting in a doc somewhere.
- **It keeps review cheap.** Every rule that applies is one more question per review, and (as we'll see in the cost section) one more question makes the whole request more expensive. Scoping a rule to its folder is the cheapest optimisation there is.

Ours are spread across about 27 of these files in six repositories right now, from repo-wide ones at the top down to a single folder of database code.

The trick is that the *same file* has two readers.

@figure(_diagrams/review-two-readers.svg, "One file, two readers. The agent reads the rule before it writes. The decider judges the change against the exact same words afterwards.")

### First, build your agent a CLI

None of this works if it lives in a doc the agent is supposed to remember to read. The agent needs a *tool* it can call. So you build a CLI.

Ours is called `filed` (or `filed.exe`, for the poor souls on Windows). It's the one front door for everything an agent needs to build and verify a change in our codebase: start the local stack, sign into the app, take screenshots, record what was verified, and, the part this post is about, a command called `review`:

```text
filed review rules --files <paths...>    which rules apply to the files I'm about to change?
filed review run --summary <pr.md>       judge my changes against those rules
filed review test [--rule <id>]          is each rule actually worded well enough to work?
filed review dismiss <rule> "<reason>"   this hint is a false alarm, and here's why
```

This CLI is your **harness**. The agent doesn't need to know where the rules files live, how to pack a diff into a request, which model to call, or what to do when the provider is down. It runs one command and reads the output. And because it's a CLI, it works the same for Claude Code, Codex, a background agent, or a human at 2am.

### What the agent actually sees: before code, code, after code

The whole thing is one loop the agent runs on its own, in three phases. The agent's instructions (`AGENTS.md`, in our case) say two things: always ask the CLI for the rules before you touch a file, and always run review before you call it done.

The important bit is where the model actually gets called:

| Phase | What the agent runs | Perplexity decider / Jev calls |
|---|---|---|
| Before code | `filed review rules --files ...` | **None.** It just reads YAML. |
| Code | lint and tests | **None.** |
| After code (review) | `filed review run --summary ...` | **One call.** All the rules, one request. |

So the agent gets the rules for free, as often as it wants, and only pays for the model once, at the end.

@figure(_diagrams/review-agent-loop.svg, "Before code: ask for the rules. Code: lint and tests on every edit. After code: review, then fix or dismiss each hint.")

**1. Before code: the agent asks for the rules.** This is the proactive half. Before editing anything, the agent runs the CLI with the files it's planning to change, and gets back something like this:

```text
$ filed review rules --files shop/orders/update.py shop/graphql/inputs/create_order.py

code.errors-bubble-up  (docs/review/rules.yaml)
  avoid: The change catches an exception and then returns None, an empty list,
         a default value or a fallback instead of letting the error raise
  do: Let the error raise; handle it only where the caller can act on it
  see: payments/retry.py
code.no-product-branches-in-shared-code  (docs/review/rules.yaml)
  avoid: The change adds an if-check or filter on a specific product, task type,
         provider, surface or flavour inside shared or generic code
  do: Move the specific behaviour into that product's or provider's own module or class
  see: shipping/carriers/README.md
code.identity-from-token  (shop/graphql/docs/review/rules.yaml)
  avoid: A GraphQL field, mutation argument or input type accepts an account ID,
         user ID or role from the caller
  do: Read the account and user from the auth token in the resolver
  see: graphql/resolvers/me.py
```

Three rules, not three hundred. Only the ones whose `applies` match those two files, from every `rules.yaml` on their path. Each one says what to avoid, what to do instead, and which existing file shows the right way. That last bit matters more than it looks: "see `payments/retry.py`" gives the agent a real example in your codebase to copy, which beats any amount of prose about error handling.

**There is no Perplexity decider / Jev call here.** It's just the CLI reading YAML files off disk, so it costs nothing and takes milliseconds, so the agent runs it every time it moves to a new set of files. If it's halfway through a task and realises it also needs to touch the GraphQL layer, it asks again for those files.

**2. Code: lint and tests, every edit.** Nothing new here. This is the inner loop, it's fast, and it stays exactly as it was.

**3. After code: the agent asks for a review.** This is the reactive half. When the agent thinks it's done, it writes a short summary of the change and runs `filed review run`. **This is the one place the model gets called: one Perplexity decider / Jev call** with the whole change and every rule that applies to it, all asked at once. (Only a really big change gets split into a couple of calls to fit the request limits.) What comes back is a short list of hints, worst first:

```text
$ filed review run --summary pr.md

filed review: 2 hints (1 calls, 48210 input tokens)
  9%  code.identity-from-token  shop/graphql/inputs/create_order.py
      fix: Read the account and user from the auth token in the resolver
      see: shop/graphql/resolvers/me.py
 31%  code.no-product-branches-in-shared-code  shop/orders/update.py
      fix: Move the specific behaviour into that product's or provider's own module or class
      see: shop/shipping/carriers/README.md
compliance 3/5 rules at 80% or above
```

Every hint has three parts, and each one is there so the agent can fix the problem without a human:

- **Which rule and which file.** Not "the PR has issues", but "this rule, in this file".
- **The fix.** The same "do" line it was shown before writing, so it's not learning anything new, just being reminded.
- **The reference.** The file that shows the right pattern. The agent opens it, sees how the rest of the codebase does it, and copies that.

Then the agent does one of two things with each hint. If it's a real problem, it fixes it and runs review again. If it's a false alarm, it records why with `filed review dismiss <rule> "<reason>"`, and that reason ends up in the PR for a human to sanity-check. After three rounds on the same change, it stops and hands over to a human, because at that point you're paying one model to argue with another.

The nice thing about this split is that the same words show up at both ends. The agent was told "avoid X, do Y, see Z" before it wrote a line. If review flags X anyway, the hint says the exact same thing back. There's no new opinion to interpret, just a reminder of a rule it already agreed to.

We also keep it on a diet. A file sees at most 15 of the repo-wide rules, and there's a test that fails if someone adds a rule that applies to `**/*` because they couldn't be bothered to scope it.

## Your rules are wrong. Test them like code.

*This is the part I didn't see coming.*

My first rules were terrible. Not wrong exactly, just useless. They read beautifully and the model couldn't tell a good change from a bad one with them.

The best example: we had a PR that registered a tool twice (the one from the list above). My first rule said "the change reuses existing helpers". It scored **0.97 on the broken PR and 0.97 on the fix**. Of course it did. Everything "reuses existing helpers" if you squint. The rule was describing a virtue, and the model was happy to agree that yes, this code is very virtuous.

The version that worked named the actual mechanism: "no tool is added to a toolset when the agent already gets it from another toolset". **0.17 on the broken PR, 0.82 on the fix.**

@figure(_diagrams/review-margin.svg, "Same PR, same fix, two wordings. Only one of them is a rule. The other is a compliment.")

So now every judged rule has to carry labelled cases: at least one diff (or screenshot) that breaks it and one that follows it. Here's what the cases look like for our "no product branches in shared code" rule (simplified, with made-up code from an imaginary online shop). The mistake is "the change adds an if-check or filter on a specific product, task type, provider, surface or flavour inside shared or generic code":

```diff
# violating: orders/update.py
 def update_order(order, status):
     order.status = status
+    if order.channel == Channel.WHOLESALE:
+        notify_wholesale_team(order)
     save(order)

# violating: shared/shipping/dispatch.py
 async def dispatch(carrier, parcels):
+    if carrier.name == "fedex":
+        parcels = repack_for_fedex(parcels)
     return await carrier.ship(parcels)

# compliant: the same behaviour, moved into the carrier that owns it
 class FedexCarrier(Carrier):
+    def prepare(self, parcels):
+        return sorted(parcels, key=lambda p: p.weight)

 async def dispatch(carrier, parcels):
-    return await carrier.ship(parcels)
+    return await carrier.ship(carrier.prepare(parcels))

# compliant: a change to shared code that has nothing to do with any product
 def update_order(order, status, notes):
     order.status = status
+    order.notes = [*order.notes, *notes]
     save(order)
```

Notice the compliant cases aren't just "code that doesn't have the mistake". One of them is the *fix* for the violating case, and one is an innocent change to the very same shared file. That's what forces the rule to be about the if-check and not about "someone touched shared code". That rule currently separates its cases by 0.96. `filed review test` scores each case on its own and computes a margin: the lowest compliant score minus the highest violating score. Under 0.5 and the rule fails. You reword it, keeping the meaning, until it passes. When it passes, the result gets written back into the YAML with a hash of the wording and the cases, so if someone edits a rule later without retesting it, the validator notices.

Here's how far rewording moved some of ours:

| Rule | First wording | After tuning |
|---|---|---|
| no product branches in shared code | 0.24 | 0.92 |
| identity comes from the token, not the input | 0.45 | 1.00 |
| instructions live in one place | 0.24 | 0.82 |
| copy a tax professional would write | 0.16 | 0.89 |

Two things fell out of this that I now believe pretty strongly:

1. **Write the mistake, not the virtue.** The model is much better at noticing that something is *there* than noticing that something is *missing*. "The change catches an exception and returns None" beats "errors are handled properly" every time. Almost every rule that tuned well ended up phrased as a mistake.
2. **Your cases will overfit.** You tune the wording until your three examples separate nicely, and then a real PR shows up that looks nothing like them. Every false alarm and every miss becomes a new case. The cases are the actual asset here. The wording is just the current best guess.

## The UI side: it looks at screenshots

*This is why we run the Perplexity decider and not plain Jev.*

Code is half the story. The other half is the agent building a page that technically works and looks like a ransom note. Three primary buttons fighting for attention. Every heading in ALL CAPS. A cute little icon next to every label, doing absolutely nothing. Copy that sounds like a developer wrote it, because a developer (well, an agent) did.

You can't lint that. You can't really unit test it either. You can write a Playwright test that checks there's a button with the text "Save", but not one that checks the page *feels* like the rest of your app. That was always a human squinting at a screenshot in review. And that human was, again, one of those same few senior devs.

The Perplexity decider reads images, so design rules work exactly like code rules, except the state is screenshots instead of diffs:

@figure(_diagrams/review-design.svg, "UI conformance: the changed page, captured at desktop and phone width, goes to the decider with one question per design rule. (Numbers here are illustrative.)")

Review opens each changed page in a signed-in browser, captures it at desktop (1440x900) and phone (390x844) width, and sends both screenshots along with the design rules that apply to the files that changed:

```text
POST
  state:      [ the PR summary + the page + the design guidance,
                desktop.png,
                phone.png ]
  questions:  q0: "Several filled, dark primary buttons appear side by side
                   in the same area of the page"
              q1: "List or table rows show their own visible Edit, Duplicate
                   or Delete buttons"
              q2: "Rows or cards carry extra colourful decorative symbols such as
                   stars, dots or shapes that add no meaning"
->
  answers:    q0: 0.92   <- that's a hint
              q1: 0.03
              q2: 0.11
```

And a design rule lives in the same `rules.yaml`, with screenshots as its cases instead of diffs. This is the real one from our frontend repo:

```yaml
- id: design.one-primary-action
  applies:
    - apps/web/src/**/*.tsx
    - packages/ui/src/**/*.tsx
  mistake: Several filled, dark primary buttons appear side by side in the same area of the page
  fix: Keep one primary action per area; make the others secondary or move them into a menu
  reference: docs/design/README.md
  cases:
    violating:
      - images: [cases/primary-buttons-routines.png]
      - images: [cases/primary-buttons-clients.png]
    compliant:
      - images: [cases/clean-routines.png]
      - images: [cases/clean-clients.png]
      - images: [cases/clean-templates.png]
  tested:
    margin: 0.99
```

Where do the cases come from? Real local pages. We take a clean page, screenshot it, then break exactly one rule by injecting a bit of DOM or CSS and screenshot it again. Here's the actual pair behind that rule (cropped to the top of the page):

@figure(_diagrams/case-clean-routines.webp, "Compliant: one primary action, 'New routine task', top right.")

@figure(_diagrams/case-primary-buttons-routines.webp, "Violating: same page, four extra filled buttons injected next to the title. Across all its cases, this rule separates with a margin of 0.99.")

The two screenshots differ in exactly one way, which is precisely what you want the model to notice. We have the same kind of pairs for ALL CAPS headings, Edit/Delete buttons sitting on every table row, decorative icons, a crowded bar of pills under the title, and boxed text buttons in headers. (Tip: look at every one of those broken screenshots with your own eyes. If the injection missed, you've just labelled a clean page as broken and the rule will never pass.)

The design rules tuned just as dramatically as the code ones:

| Rule | First wording | After tuning |
|---|---|---|
| one primary action per page | 0.63 | 0.99 |
| secondary actions show on hover | 0.57 | 0.91 |
| header actions are icons, not text buttons | 0.64 | 0.98 |
| no decorative icons | 0.13 | 0.94 |

Same lesson as before: "the page has a clear visual hierarchy" is a compliment. "Several filled, dark primary buttons appear side by side in the same area of the page" is a rule.

Anything you can *measure* (sizes, spacing, contrast) still goes to a plain old design-check script. The decider only gets the questions a script can't answer, the ones that used to need a pair of human eyes.

## A hint is a pointer, not a verdict

```text
filed review: 1 hints (1 calls, 125613 input tokens)
 13%  code.no-product-branches-in-shared-code  shop/agents/shared/assistant.py, ...
      fix: Move the specific behaviour into that product's or provider's own module or class
      see: shop/shipping/carriers/README.md
compliance 4/5 rules at 80% or above
```

That one is based on a real hint (names changed to protect the guilty): a shared agent was quietly filtering its tools based on which product was calling it. The model gave it 13%, and it was right.

But "13%" is not a measurement of anything. It's the model saying "look here". Read every hint that way. Most are real. Some aren't. That's why dismissing with a written reason is a first-class part of the loop and not an embarrassing escape hatch.

## What it costs, and how long you wait

*Spoiler: way less than you think in dollars, more than you'd like in seconds.*

Here are real numbers from our last batch of reviews on actual feature branches:

| What was reviewed | Rules asked | Calls | Input tokens | Cost |
|---|---|---|---|---|
| one page, design rules only | 5 | 1 | 15k | $0.0003 |
| a small backend change | 5 | 1 | 126k | $0.003 |
| a page plus its code | 10 | 1 | 203k | $0.004 |
| a medium branch across two repos | 17 | 1 | 333k | $0.007 |
| a branch plus two pages | 23 | 3 | 834k | $0.02 |
| a big branch | 26 | 1 | 2.2M | $0.04 |

Yes, you're reading that right. The biggest review in that table cost about four cents. The Perplexity decider (`pplx-decider-v1.1`) is listed at about $0.02 per million input tokens, and output is free, because the output is a handful of numbers. Jev is in the same ballpark at about $0.042 per million. For comparison, sending that same 2.2M-token review through a frontier chat model would cost dollars, not cents, and you'd get an essay back. (Prices are from public listings as of October 2026; check before you budget.)

So the money is not the problem. Latency and attention are. Still, the shape of the bill is worth understanding, because it's the same shape as the latency.

The thing that surprised me: tokens don't scale with the size of your diff. They scale with **the size of your diff times the number of questions**. As far as we can tell from the usage numbers, the state gets counted once per question answered, so a big diff with 26 rules is 2.2M input tokens in a single call. Every rule you add to a widely-applied folder makes *every* review that touches that folder more expensive. That's the real reason we scope `applies` tightly and cap repo-wide rules at 15 per file. It's not about the bill so much as the wait, and the noise.

Latency is fine for the end of a feature and terrible for the inner loop:

- **One question on one case** comes back in about a second or two. `filed review test` on a single design rule with five screenshot cases takes six to eight seconds.
- **A full review** of a real branch, around 1.7M tokens over two calls, took about a minute. Add screenshot capture time if pages are involved.
- **A bad day** looks like a 504 from the provider after a minute of waiting. Two of our recorded runs ended exactly like that, and review reported "did not run" and got out of the way.

So the rule of thumb is: lint and tests run on every edit, review runs near the end of a feature and once more after fixing its hints, and that's it. If a run would send more than 5M tokens, it refuses and tells you to narrow it down with a folder or a closer base branch.

## Now the unglamorous bits

It wouldn't be fair to sell this as all upside, so here is what it actually costs:

- **It's cheap, but it's not free.** A few cents a review is nothing until an agent decides to run it after every edit, on every branch, in a loop. Put a budget on it anyway.
- **It sends your code to a third party.** Summary, diffs, reference files and screenshots go to the provider. That's fine for our code. It is *not* fine for anything near taxpayer data, so review never runs on fixtures or production payloads. Decide where that line is for you before you wire it up.
- **The provider will go down.** Credits run out, keys expire, rate limits happen. When that happens review exits cleanly, prints "review did not run", and the PR says so. A flaky reviewer that blocks merges is worse than no reviewer.
- **The plumbing is not free.** Six repos, diffs with three levels of context, splitting files and questions so every request fits under the limits, PNG size checks for screenshots. None of it is hard. All of it is code you now own.
- **It doesn't replace your judgement.** It replaces the *repetition* of your judgement. The first time you see a new kind of mistake, that's still you. The job is to make sure it's the last time you have to say it out loud.

## Where does a rule go?

Most of the value turned out to be in deciding where *not* to put a rule. We use a simple ladder, top step first:

@figure(_diagrams/review-ladder.svg, "Always try the top step first. A model is the second-to-last resort, not the first.")

1. **Can code make the mistake impossible?** Do that. A type, an API shape, a helper that's the only way in.
2. **Can a lint or test catch it?** Do that. The duplicate tool registration is now caught by a plain test. No model required.
3. **Can a model judge it from a diff or a screenshot?** Now it's a decider rule, with cases.
4. **Otherwise** it's a guide entry: shown to the agent before it writes, never judged.

## So what now?

If you're running agents on a real codebase and you keep leaving the same review comments, you probably have rules. You just haven't written them in a form anything can check.

Before you write one, ask yourself two questions:

1. **Can a script decide this?** If yes, stop reading this post and go write the lint rule or the test. It's cheaper, faster, and it'll never have a bad day.
2. **Can you write it as one mistake that names the mechanism, with a diff that breaks it and a diff that doesn't?** If you can't, it isn't a rule yet. It's a vibe. Vibes are fine in a guide for the agent, but no model is going to enforce them for you.

If you can answer both, put it next to the code, test the wording until the model can actually tell the cases apart, and let the agent read it before it writes. That's the closest I've found to cloning the voice of your senior devs that says "...that's not how we do it here", and making it show up on every PR without them.
