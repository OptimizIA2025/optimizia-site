# SEO settings (meeeters)

- Article title (H1): AI Proof of Concept for SMEs: How to Run One That Leads Somewhere
- SEO title (55/60): AI Proof of Concept for SMEs: How to Run One That Works
- Meta description (139/160): How to run an AI proof of concept in a small business: one question, a real sample, a pass mark written in advance, and a plan for the MVP.
- URL ending: blog/ai-proof-of-concept/
- Target keyword: ai proof of concept
- Media: ai-proof-of-concept-og.png
- Alt: A wind tunnel on a lavender background: white smoke lines flow around a small yellow model airplane on a test mount. A control panel below reads Sample 100 cases, Pass mark 90 %, Result 93 %, and a green lamp says Go MVP.

---

An AI proof of concept is a short, cheap test that answers one question: can AI do this specific task, on our real data, well enough to be worth building? For a small or medium business, a good one runs on a sample of real cases, takes days to a few weeks, and ends with a decision written down in advance: build the MVP, change the approach, or stop.

In 2024, Gartner predicted that at least 30% of generative AI projects would be abandoned after the proof of concept by the end of 2025, citing poor data quality, inadequate risk controls, escalating costs and unclear business value. None of those is a model problem. They are scoping problems, and an SME can avoid most of them before writing a single prompt. This guide shows how we run a proof of concept at OptimizIA.xyz so that it leads somewhere, including when the answer is no.

## What an AI Proof of Concept Is, and What It Is Not

A proof of concept tests one task on real data against a pass mark. It is not a demo, which shows what a tool can do on hand-picked examples, and it is not an MVP, which puts a working version in the hands of real users. Mixing them up is how projects end up stuck between the two.

| Stage | Question it answers | Data | Who uses it | Typical length |
|---|---|---|---|---|
| Demo | Can the tool do something impressive? | Hand-picked examples | Nobody | A few hours |
| Proof of concept | Can it do our task well enough? | A real sample, messy cases included | The project owner | Days to a few weeks |
| MVP | Does it hold up in daily work? | Live data, on a narrow scope | A small group of users | 13 days on average after a validated PoC, in our projects |
| Production | Does it keep paying off? | All the data in scope | The whole team | Ongoing, with monitoring |

## Before You Start: Write a One-Page Brief

Every proof of concept we run starts with the same page. If it cannot be filled in, the test is not ready, and our [AI readiness assessment](https://www.optimizia.xyz/blog/ai-readiness-assessment/) will tell you what is missing.

- **The question, in one sentence.** "Can a model extract the supplier, amount and due date from our incoming invoices?" If it takes a paragraph, the scope is too wide.
- **The sample.** Fifty to a hundred real cases, including the awkward ones: the scanned invoice, the email with three attachments, the customer who writes in another language.
- **The pass mark.** A number decided before the test: share of cases handled correctly, time per case, errors you can live with.
- **The fallback.** What happens when the AI is unsure. In a sound design, a low-confidence case goes to a person instead of guessing, as our guide to [intelligent process automation](https://www.optimizia.xyz/blog/intelligent-process-automation-ipa/) explains.
- **The owner.** The person who reviews the output and has the authority to decide.
- **The decision date.** The day you choose between building the MVP, changing the approach and stopping.

## How to Run It in Five Steps

### 1. Narrow the task

One document type, one request category, one team. "Automate customer service" is a program; "draft replies to delivery-date questions" is a proof of concept.

### 2. Collect the real sample

Take the cases from last month, not the ones that look good. The messy ones are where the test is decided, and they are also the ones a demo never shows.

### 3. Build the thinnest version that touches real tools

A proof of concept that lives in a slide proves nothing. We build it the way the MVP will run: a workflow on [n8n](https://www.optimizia.xyz/blog/n8n-workflow-automation/) or [Make](https://www.optimizia.xyz/blog/make-workflow-automation/), one narrow call to a language model, connected to a copy of the real data source. That way the test also checks access to the data, which is where many projects stall later.

### 4. Measure against the pass mark

Run the sample, then review it case by case with the owner. Count what was right, what was wrong and what was escalated. Wrong answers matter more than missing ones: a case sent to a person costs a minute, a confident mistake can cost a customer.

### 5. Decide, in writing

Build the MVP, change the approach, or stop. A proof of concept that ends in "stop" after two weeks and a fixed budget is a success: it saved you the cost of a project that would not have paid off.

## A Real Example: Lead Monitoring

Our [lead monitoring](https://www.optimizia.xyz/case-studies/lead-monitoring/) system started as a proof of concept for a talent manager who read a sector's trade press by hand every morning. The question fit in one sentence: can a model read a day of trade press and keep only the brands worth contacting?

The first end-to-end test read 85 articles and kept 8 signals. The owner reviewed them, and his review changed the brief: he preferred a broad filter that he would sort himself to the risk of missing a lead, and the categories were renamed with the words he already used. That is the proof of concept doing its job, correcting the design before the MVP rather than after. In his own words: "In just a few days, he had set up a system that saves me over 2 hours a day and surfaces far better-qualified opportunities." Today it runs every weekday morning, for under ten euros a month in AI usage.

## From Proof of Concept to MVP: What Changes

The model rarely changes between the two. Everything around it does:

- **Live data** instead of a sample, with the volumes of a normal week.
- **Error handling and alerts**: a failed run must be noticed the same day, not at the end of the month.
- **Measurement**: time saved, volume processed and error rate, visible in a simple dashboard.
- **Users and documentation**: a short onboarding guide, so the team knows what the system does and what it leaves to them.

We aim to go from a validated proof of concept to a working MVP in 13 days on average, on a deliberately narrow scope, so the value can be checked before anything is scaled up. Our page on how we [automate what slows you down](https://www.optimizia.xyz/levers.html#automate) describes that step.

## What an AI Proof of Concept Costs

At OptimizIA.xyz, the [PoC and MVP](https://www.optimizia.xyz/services.html) engagement starts from €1,500 excl. VAT, as a fixed fee that depends on the complexity of the use case, and runs two to five weeks. It covers the detailed scoping, the proof of concept definition with its objectives and acceptance criteria, the move to an MVP on a controlled scope, and a user onboarding guide.

Running costs are usually small: software subscriptions and AI usage come to a few tens of euros a month for an SME workload. Before you commit, our [automation ROI calculator](https://www.optimizia.xyz/tools/automation-roi-calculator/) shows whether the time saved covers the build. If you do not know yet which process to test, start with a [diagnostic](https://www.optimizia.xyz/levers.html#diagnose) instead.

## Why Proofs of Concept Stall

- **Testing on hand-picked examples.** That is a demo. It will look great and prove nothing.
- **No pass mark written in advance.** Without it, every result is "promising" and nobody decides.
- **Scope creep.** "While we are at it" turns a two-week test into a three-month project.
- **No owner and no decision date.** The test never ends; it just stops being looked at.
- **Ignoring the road to production.** Data access, security and running costs are part of the test, not a problem for later. They are exactly the reasons Gartner gave for abandoned projects.

## Take the Next Step

Write the one-page brief for the task you have in mind. If you can fill it in, [book a call](https://www.optimizia.xyz/contact.html): we will tell you whether it is ready for a proof of concept, what the pass mark should be, and what it would cost.

## Frequently asked questions

### How long does an AI proof of concept take?

The test itself takes days to a few weeks. At OptimizIA.xyz, the PoC and MVP engagement runs two to five weeks, and a validated proof of concept becomes a working MVP in 13 days on average.

### How much does an AI proof of concept cost?

At OptimizIA.xyz, the PoC and MVP engagement starts from €1,500 excl. VAT, as a fixed fee. Running costs are usually a few tens of euros a month in software subscriptions and AI usage.

### What is the difference between a proof of concept and an MVP?

A proof of concept answers whether AI can do the task well enough, on a sample of real data. An MVP answers whether it holds up in daily work, on live data, with real users, error handling and measurement.

### What if the proof of concept fails?

Then it did its job at a known, limited cost. You keep the brief, the sample and the measured results, which tell you whether to change the approach, choose another process or stop.
