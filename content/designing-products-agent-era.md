---
title: Designing products in the agent era
date: 2026-06-02T10:00:00.000Z
keywords: products, agents, ai, design, ux, delegation, engineering
slug: designing-products-agent-era
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
.hw { font-family: 'Caveat', 'Comic Sans MS', cursive; }
.exdraw { width: 100%; height: auto; display: block; margin: 0 auto; }
figure.dwg { margin: 2.25rem 0; }
figure.dwg figcaption { text-align: center; font-size: 0.85rem; color: #777; margin-top: 0.5rem; font-style: italic; }
</style>

In my [last post](/scaling-agentic-development.html) I wrote about *building* software in the agent era. This one is about the other half of the job: what we actually build, and who we build it for.

For the last 10 to 15 years, every app we designed rested on one quiet assumption: a human being comes to your platform and does the task. The whole craft of product design grew on top of that single premise. You build a destination, you teach people your map, and they do the work by clicking through your screens. Onboarding, navigation, empty states, the perfectly placed button — all of it exists to walk a human through your layout to the thing they came for.

That premise just broke. And I don't think most product teams have internalised how completely.

## Three eras of getting something done

Take any real task — let's say doing your taxes. It has lived through three eras.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three eras: physical, digital, agentic">
  <defs>
    <filter id="rough-e" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/>
    </filter>
  </defs>

  <!-- shapes (wobbled) -->
  <g filter="url(#rough-e)" fill="none" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="20"  y="80" width="210" height="200" rx="12" fill="#ffec99"/>
    <rect x="275" y="80" width="210" height="200" rx="12" fill="#a5d8ff"/>
    <rect x="530" y="80" width="210" height="200" rx="12" fill="#d0bfff"/>

    <!-- physical: person + paper -->
    <circle cx="100" cy="140" r="11" fill="#fff"/>
    <path d="M100 151 L100 196 M84 168 L116 168 M100 196 L88 219 M100 196 L112 219"/>
    <rect x="142" y="150" width="46" height="60" rx="4" fill="#fff"/>
    <path d="M150 166 L180 166 M150 178 L180 178 M150 190 L172 190"/>

    <!-- digital: person + monitor -->
    <circle cx="345" cy="140" r="11" fill="#fff"/>
    <path d="M345 151 L345 196 M329 168 L361 168 M345 196 L333 219 M345 196 L357 219"/>
    <rect x="378" y="150" width="72" height="52" rx="4" fill="#fff"/>
    <path d="M388 164 L432 164 M388 176 L424 176 M414 202 L414 214 M398 214 L430 214"/>

    <!-- agentic: small supervisor + robot worker -->
    <circle cx="572" cy="132" r="9" fill="#fff"/>
    <path d="M572 141 L572 176 M560 155 L584 155 M572 176 L563 196 M572 176 L581 196"/>
    <rect x="625" y="150" width="46" height="40" rx="7" fill="#fff"/>
    <path d="M648 150 L648 140"/>
    <circle cx="648" cy="136" r="3" fill="#1e1e1e"/>
    <circle cx="638" cy="168" r="3.2" fill="#1e1e1e"/>
    <circle cx="658" cy="168" r="3.2" fill="#1e1e1e"/>
    <path d="M633 190 L633 210 L663 210 L663 190 M625 196 L617 206 M671 196 L679 206"/>

    <!-- arrows between panels -->
    <path d="M234 180 L271 180 M271 180 L263 175 M271 180 L263 185"/>
    <path d="M489 180 L526 180 M526 180 L518 175 M526 180 L518 185"/>
  </g>

  <!-- crisp text -->
  <g class="hw" fill="#1e1e1e" text-anchor="middle">
    <text x="125" y="58" font-size="30" font-weight="700">Physical</text>
    <text x="380" y="58" font-size="30" font-weight="700">Digital</text>
    <text x="635" y="58" font-size="30" font-weight="700">Agentic</text>

    <text x="125" y="305" font-size="21" fill="#555">go there, do it yourself</text>
    <text x="380" y="305" font-size="21" fill="#555">log in, do it yourself</text>
    <text x="635" y="305" font-size="21" fill="#555">delegate &amp; verify</text>

    <text x="380" y="352" font-size="24" font-weight="700">Every leap changed the medium — this one changes the doer.</text>
  </g>
</svg>
<figcaption>Physical → digital → agentic. The first jump moved atoms to bits. The second moves the work off your hands.</figcaption>
</figure>

**Physical.** You gathered paper, drove to an office, sat across from someone, signed forms. The work was slow and located somewhere.

**Digital.** Apps took that physical task and made a clean digital copy of it. No commute, no paper, instant manipulation, and you could do it from wherever you were. This is the era we spent the last decade and a half perfecting. But notice what actually changed and what didn't: we digitised the *task*, and the human was still the one doing it. TurboTax never did your taxes — it gave you a faster surface to do them yourself. The form moved from paper to screen. The doer never moved.

So naturally, the interfaces we built were interfaces for *humans to talk to computers* and do the task. We even automated significant chunks along the way. But the shape was always the same: a person, sitting in front of your product, doing the work.

## The agent era changes the doer, not the medium

This is the part that is genuinely crazy, and it's why it isn't just the next incremental step. Every previous improvement made it *easier for the human to do the work*. This one removes the human from doing the work at all.

The agent era is a layer of abstraction *over* the digital world. The processes are still mapped out underneath — the digital platforms still exist. But you are now one step ahead of the human doing the task. You describe what you want, an agent does it, and you step in only when you need to.

Digital was a change of *medium* (atoms → bits). Agents are a change of *doer* (you → an agent acting for you). Those are not the same kind of shift. And here's the uncomfortable bit: our entire product playbook — destinations, navigation, onboarding, engagement metrics — was written for the change-of-medium era. It assumed the human stays the doer. So when the doer changes, the playbook isn't a little out of date. It's pointed at the wrong person.

## So we built a UI for agents, right? No.

This is where I think a lot of teams take a wrong turn. You hear "build a UI for agents." That's incorrect. **UI is always built for humans.** Agents don't need tooltips and layouts — they need a clean contract.

The right way to see it is as a stack of levels.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three levels: core systems, the digital app, AI-native delegation">
  <defs>
    <filter id="rough-l" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/>
    </filter>
  </defs>

  <g filter="url(#rough-l)" fill="none" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="120" y="50"  width="520" height="95" rx="12" fill="#d0bfff"/>
    <rect x="120" y="170" width="520" height="95" rx="12" fill="#a5d8ff"/>
    <rect x="120" y="290" width="520" height="95" rx="12" fill="#e9ecef"/>

    <circle cx="80" cy="97"  r="26" fill="#fff" stroke="#6741d9"/>
    <circle cx="80" cy="217" r="26" fill="#fff" stroke="#1971c2"/>
    <circle cx="80" cy="337" r="26" fill="#fff" stroke="#495057"/>

    <!-- supervisor on the right of level 3 -->
    <circle cx="700" cy="74" r="10" fill="#fff"/>
    <path d="M700 84 L700 112 M688 96 L712 96 M700 112 L692 130 M700 112 L708 130"/>
    <path d="M686 97 L646 97 M646 97 L654 92 M646 97 L654 102"/>

    <!-- manual fallback arrow, level 3 -> level 2 -->
    <path d="M380 150 L380 166 M380 166 L375 158 M380 166 L385 158" stroke-dasharray="5 5"/>
  </g>

  <g class="hw" fill="#1e1e1e">
    <text x="80"  y="107" font-size="34" font-weight="700" text-anchor="middle">3</text>
    <text x="80"  y="227" font-size="34" font-weight="700" text-anchor="middle">2</text>
    <text x="80"  y="347" font-size="34" font-weight="700" text-anchor="middle">1</text>

    <text x="140" y="90"  font-size="25" font-weight="700">Level 3 · AI-native delegation</text>
    <text x="140" y="122" font-size="20" fill="#444">chat · skills · workflows · integrations</text>

    <text x="140" y="210" font-size="25" font-weight="700">Level 2 · the digital app</text>
    <text x="140" y="242" font-size="20" fill="#444">human UI  +  MCP / tools for agents</text>

    <text x="140" y="330" font-size="25" font-weight="700">Level 1 · core systems, data &amp; rails</text>

    <text x="650" y="150" font-size="19" fill="#555">you supervise</text>
    <text x="392" y="163" font-size="18" fill="#555">drop down to do it yourself</text>
  </g>
</svg>
<figcaption>Physical → digital built levels 1 and 2. The agent era adds level 3 on top.</figcaption>
</figure>

**Level 1** is the core — the systems, data and rails underneath everything.

**Level 2** is the digital app: the platform humans have logged into for years. The new part is that level 2 now also needs to expose an interface for *agents* — something like MCP. The underlying digital platforms (neo-banks, ecommerce, banks, airlines) are the ones who need to build that. Their human UI is still for humans; the MCP surface is for agents.

**Level 3** is the new layer — the AI-native product. It's chat, skills, workflows and integrations. The latter two reach down into those base platforms, which are now open to both humans and AI. This is where the value is for an AI-native company: your job is to build agents that work one level up and take on the job like another employee.

The implication is concrete. If you're building a bank today, you don't get to build just level 2 anymore — you build levels 1, 2 *and* 3, with your users primarily living on level 3 and dropping down to level 2 only when they need to. And if your product *only* lives on level 3, the level-2 UI that humans use should change accordingly. It stops being the main event and becomes the fallback.

## A chatbot is not the answer

The lazy version of level 3 is to bolt a chat box onto your existing app and call it agent-ready. It doesn't get you there, because a chatbot alone is missing a couple of crucial things.

It doesn't convey what's actually possible — a blank text box gives you no sense of the space of things you can ask for. And it answers in a stream of text that takes real time to read. That's the opposite of what delegation is supposed to buy you.

What you actually need is two things:

- The ability to **delegate** work — to teach a task to an agent and have it get the thing done.
- The ability for the user to **step in and do it themselves**, and make modifications, when they want to.

## The mental model: how would you hand this to a person?

Whenever I'm designing one of these surfaces, this is the question I keep coming back to:

> If you were to delegate the task you're trying to do to another person through this interface — how would you do it, and how would you correct them if they understood it wrong?

That single question does a lot of work. It forces you to think about how intent is communicated, how progress is made visible, and how a human takes back the wheel mid-task. It's a much better north star than "where do the buttons go."

## You are the supervisor now

The role the human plays changes. You're not the worker anymore — you're the supervisor.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A supervisor watching agent workers on a conveyor belt">
  <defs>
    <filter id="rough-s" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="11" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/>
    </filter>
  </defs>

  <g filter="url(#rough-s)" fill="none" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <!-- supervisor on a small platform -->
    <circle cx="90" cy="120" r="13" fill="#fff"/>
    <path d="M90 133 L90 182 M70 152 L110 152 M90 182 L76 210 M90 182 L104 210"/>
    <rect x="60" y="212" width="70" height="12" rx="3" fill="#ffec99"/>
    <!-- speech bubble -->
    <path d="M120 60 q0 -16 18 -16 l86 0 q18 0 18 16 l0 28 q0 16 -18 16 l-70 0 l-18 16 l2 -16 q-18 0 -18 -16 Z" fill="#fff"/>

    <!-- conveyor belt -->
    <circle cx="250" cy="250" r="20" fill="#fff"/>
    <circle cx="700" cy="250" r="20" fill="#fff"/>
    <path d="M250 230 L700 230 M250 270 L700 270"/>
    <!-- items on belt -->
    <rect x="300" y="206" width="24" height="24" rx="3" fill="#a5d8ff"/>
    <rect x="430" y="206" width="24" height="24" rx="3" fill="#a5d8ff"/>
    <rect x="560" y="206" width="24" height="24" rx="3" fill="#a5d8ff"/>

    <!-- three robot workers -->
    <g>
      <rect x="298" y="150" width="38" height="32" rx="6" fill="#d0bfff"/>
      <path d="M317 150 L317 142"/><circle cx="317" cy="139" r="2.6" fill="#1e1e1e"/>
      <circle cx="309" cy="166" r="2.6" fill="#1e1e1e"/><circle cx="325" cy="166" r="2.6" fill="#1e1e1e"/>
    </g>
    <g>
      <rect x="428" y="150" width="38" height="32" rx="6" fill="#d0bfff"/>
      <path d="M447 150 L447 142"/><circle cx="447" cy="139" r="2.6" fill="#1e1e1e"/>
      <circle cx="439" cy="166" r="2.6" fill="#1e1e1e"/><circle cx="455" cy="166" r="2.6" fill="#1e1e1e"/>
    </g>
    <g>
      <rect x="558" y="150" width="38" height="32" rx="6" fill="#d0bfff"/>
      <path d="M577 150 L577 142"/><circle cx="577" cy="139" r="2.6" fill="#1e1e1e"/>
      <circle cx="569" cy="166" r="2.6" fill="#1e1e1e"/><circle cx="585" cy="166" r="2.6" fill="#1e1e1e"/>
    </g>
  </g>

  <g class="hw" fill="#1e1e1e">
    <text x="138" y="78" font-size="20">looks good —</text>
    <text x="138" y="100" font-size="20">tweak number 2</text>
    <text x="95" y="245" font-size="18" fill="#555" text-anchor="middle">you</text>
    <text x="475" y="312" font-size="21" fill="#555" text-anchor="middle">the conveyor = repetitive workflows · the workers = agents</text>
  </g>
</svg>
<figcaption>The supervisor takes a peek when needed and mostly just gives instructions. The workers are agents now.</figcaption>
</figure>

Think of an industrial belt. The workflows are the belt — the repetitive tasks that just need to get done. A supervisor can peek in when needed, but mostly they give instructions and talk to the workers. In this era, the workers are agents.

And this is exactly why chat stays crucial. The supervisor role is *communication* at its core. It has to be text or voice. So the interface isn't a chatbot bolted on — it's a way to talk to an agent on one side, while seeing the work being done on the other. The UX still matters enormously; it's just no longer arranging a form for someone to fill in by hand.

In general, we need interfaces geared toward running a task *for* you, while handing you control when you want it. These tasks should be able to run while you're asleep — and get done the way *you* would do them.

## What this looks like

The abstract stuff gets concrete fast once you sketch the actual product. The pattern repeats across domains: a way to delegate, a live view of the work, and a manual fallback for when you want to drive.

**Neo-bank.** Instead of logging in to eyeball your transactions, you set an agent to do it every morning and flag anything off. You still keep the ability to go look yourself.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Neo-bank agent UI mockup">
  <defs>
    <filter id="rough-m1" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="5" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2"/>
    </filter>
  </defs>
  <g filter="url(#rough-m1)" fill="none" stroke="#1e1e1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="30" y="20" width="700" height="390" rx="14" fill="#fff"/>
    <path d="M30 62 L730 62"/>
    <circle cx="55" cy="41" r="5"/><circle cx="74" cy="41" r="5"/><circle cx="93" cy="41" r="5"/>
    <rect x="600" y="30" width="110" height="24" rx="6" fill="#f1f3f5"/>
    <!-- chat panel -->
    <rect x="48" y="78" width="270" height="315" rx="10" fill="#f8f9fa"/>
    <rect x="120" y="110" width="184" height="48" rx="10" fill="#d0bfff"/>
    <rect x="62"  y="176" width="170" height="44" rx="10" fill="#fff"/>
    <rect x="62"  y="356" width="244" height="28" rx="14" fill="#fff"/>
    <!-- work panel -->
    <rect x="336" y="78" width="378" height="315" rx="10" fill="#fff"/>
    <rect x="352" y="118" width="346" height="120" rx="8" fill="#f8f9fa"/>
    <rect x="372" y="262" width="120" height="34" rx="8" fill="#b2f2bb"/>
    <rect x="508" y="262" width="120" height="34" rx="8" fill="#ffc9c9"/>
  </g>
  <g class="hw" fill="#1e1e1e">
    <text x="62" y="100" font-size="20" font-weight="700">Delegate</text>
    <text x="620" y="47" font-size="17">Manual &#9656;</text>
    <text x="380" y="50" font-size="20" font-weight="600" text-anchor="middle">neo-bank · agent</text>
    <text x="132" y="130" font-size="17">Check my account every</text>
    <text x="132" y="150" font-size="17">morning. Flag anything shady.</text>
    <text x="74" y="195" font-size="17">On it. I will review daily &amp; ping you.</text>
    <text x="74" y="375" font-size="17" fill="#888">Tell it what to do…</text>
    <text x="352" y="104" font-size="20" font-weight="700">Work being done &#8594;</text>
    <text x="368" y="143" font-size="17" fill="#555">Today, 9:00am</text>
    <text x="368" y="172" font-size="18">&#10003; 23 transactions look normal</text>
    <text x="368" y="200" font-size="18">&#9888; 1 flagged — $420, unknown merchant</text>
    <text x="432" y="284" font-size="18" text-anchor="middle">Review</text>
    <text x="568" y="284" font-size="18" text-anchor="middle">Ignore</text>
    <text x="352" y="330" font-size="17" fill="#888">you get the final say</text>
  </g>
</svg>
<figcaption>Set it once, it runs every morning while you sleep — and you still hold the approve / ignore button.</figcaption>
</figure>

**Ecommerce.** You *can* search yourself, but instead you tell a chat-like surface what you're after and it filters the catalogue down for you. You keep the final say on the destructive action — checkout — while the searching and filtering is done by the agent.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ecommerce agent UI mockup">
  <defs>
    <filter id="rough-m2" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="9" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2"/>
    </filter>
  </defs>
  <g filter="url(#rough-m2)" fill="none" stroke="#1e1e1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="30" y="20" width="700" height="390" rx="14" fill="#fff"/>
    <path d="M30 62 L730 62"/>
    <circle cx="55" cy="41" r="5"/><circle cx="74" cy="41" r="5"/><circle cx="93" cy="41" r="5"/>
    <rect x="585" y="30" width="125" height="24" rx="6" fill="#f1f3f5"/>
    <rect x="48" y="78" width="270" height="315" rx="10" fill="#f8f9fa"/>
    <rect x="120" y="110" width="184" height="48" rx="10" fill="#d0bfff"/>
    <rect x="62"  y="176" width="160" height="44" rx="10" fill="#fff"/>
    <rect x="62"  y="356" width="244" height="28" rx="14" fill="#fff"/>
    <rect x="336" y="78" width="378" height="315" rx="10" fill="#fff"/>
    <!-- product grid 2x2 -->
    <rect x="356" y="120" width="160" height="105" rx="8" fill="#a5d8ff"/>
    <rect x="534" y="120" width="160" height="105" rx="8" fill="#a5d8ff"/>
    <rect x="356" y="240" width="160" height="105" rx="8" fill="#a5d8ff"/>
    <rect x="534" y="240" width="160" height="105" rx="8" fill="#a5d8ff"/>
  </g>
  <g class="hw" fill="#1e1e1e">
    <text x="62" y="100" font-size="20" font-weight="700">Delegate</text>
    <text x="605" y="47" font-size="17">Browse all &#9656;</text>
    <text x="380" y="50" font-size="20" font-weight="600" text-anchor="middle">shop · agent</text>
    <text x="132" y="130" font-size="17">Running shoes, under $100,</text>
    <text x="132" y="150" font-size="17">size 10, blue.</text>
    <text x="74" y="202" font-size="17">Found 4 that fit. Pick one?</text>
    <text x="74" y="375" font-size="17" fill="#888">Refine your ask…</text>
    <text x="436" y="178" font-size="18" text-anchor="middle">Shoe A</text>
    <text x="436" y="202" font-size="17" text-anchor="middle">$89</text>
    <text x="614" y="178" font-size="18" text-anchor="middle">Shoe B</text>
    <text x="614" y="202" font-size="17" text-anchor="middle">$95</text>
    <text x="436" y="298" font-size="18" text-anchor="middle">Shoe C</text>
    <text x="436" y="322" font-size="17" text-anchor="middle">$72</text>
    <text x="614" y="298" font-size="18" text-anchor="middle">Shoe D</text>
    <text x="614" y="322" font-size="17" text-anchor="middle">$99</text>
    <text x="525" y="380" font-size="17" fill="#888" text-anchor="middle">agent filters · checkout needs your OK</text>
  </g>
</svg>
<figcaption>The agent does the filtering and searching; the only thing it can&apos;t do without you is the irreversible part.</figcaption>
</figure>

**Airline booking.** Same shape. You go in, say what you need, and it does it according to your needs. As the aggregator platform, your job is to provide the tools for exactly this.

<figure class="dwg">
<svg class="exdraw" viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Airline booking agent UI mockup">
  <defs>
    <filter id="rough-m3" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="14" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2"/>
    </filter>
  </defs>
  <g filter="url(#rough-m3)" fill="none" stroke="#1e1e1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="30" y="20" width="700" height="390" rx="14" fill="#fff"/>
    <path d="M30 62 L730 62"/>
    <circle cx="55" cy="41" r="5"/><circle cx="74" cy="41" r="5"/><circle cx="93" cy="41" r="5"/>
    <rect x="580" y="30" width="130" height="24" rx="6" fill="#f1f3f5"/>
    <rect x="48" y="78" width="270" height="315" rx="10" fill="#f8f9fa"/>
    <rect x="120" y="110" width="184" height="48" rx="10" fill="#d0bfff"/>
    <rect x="62"  y="176" width="170" height="44" rx="10" fill="#fff"/>
    <rect x="62"  y="356" width="244" height="28" rx="14" fill="#fff"/>
    <rect x="336" y="78" width="378" height="315" rx="10" fill="#fff"/>
    <!-- 3 flight rows -->
    <rect x="352" y="120" width="346" height="58" rx="8" fill="#b2f2bb"/>
    <rect x="352" y="190" width="346" height="58" rx="8" fill="#f8f9fa"/>
    <rect x="352" y="260" width="346" height="58" rx="8" fill="#f8f9fa"/>
    <rect x="560" y="350" width="120" height="34" rx="8" fill="#a5d8ff"/>
  </g>
  <g class="hw" fill="#1e1e1e">
    <text x="62" y="100" font-size="20" font-weight="700">Delegate</text>
    <text x="600" y="47" font-size="17">Search flights &#9656;</text>
    <text x="380" y="50" font-size="20" font-weight="600" text-anchor="middle">flights · agent</text>
    <text x="132" y="130" font-size="17">Cheapest direct to Tokyo</text>
    <text x="132" y="150" font-size="17">next Fri, aisle seat.</text>
    <text x="74" y="195" font-size="17">3 options. Best: $610, 11h, aisle.</text>
    <text x="74" y="375" font-size="17" fill="#888">Adjust the trip…</text>
    <text x="368" y="155" font-size="18">JL · direct · 11h · $610 · aisle &#10003;</text>
    <text x="368" y="225" font-size="18" fill="#555">NH · direct · 11h · $645 · window</text>
    <text x="368" y="295" font-size="18" fill="#555">UA · 1 stop · 14h · $520</text>
    <text x="620" y="372" font-size="18" text-anchor="middle">Book</text>
    <text x="540" y="372" font-size="17" fill="#888" text-anchor="end">you confirm &#8594;</text>
  </g>
</svg>
<figcaption>State the intent, get ranked options, confirm the one irreversible step yourself.</figcaption>
</figure>

## Build for teaching, not doing

So here's the gist. When you're building on level 3, the design questions change. Think about how the UX supports *delegation* and *teaching* — and how you still give people manual controls so they can drop down and do a level-2 task themselves when they want to.

At Filed we work solely on level 3. We leave the level-2 work to the incumbents. What that gives our users is the ability to hire an extra digital delegation platform — to delegate the work in their firm, instead of grinding through every task by hand.

And that flips the whole orientation of the product. For 15 years we built platforms for *doing*. The platforms that win in this era are built for *teaching* — surfaces where you hand off the work, watch it happen, and step in only when it matters.

If there's one line to take away, it's this: **every AI-native product needs to go from doing the task to being a delegation platform.** The doer changed. Design for that.
