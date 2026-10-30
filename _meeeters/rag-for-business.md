# SEO settings (meeeters)

- Article title (H1): RAG for Business: How an SME Turns Its Documents Into an AI Assistant
- SEO title (58/60): RAG for Business: Turn Your Documents Into an AI Assistant
- Meta description (154/160): What RAG means for a small business, where it pays off and where it does not, and how to get your documents ready for an assistant that cites its sources.
- URL ending: blog/rag-for-business/
- Target keyword: rag for business
- Media: rag-for-business-og.png
- Alt: Pixel-art library on a coral background: a book is missing from its shelf and a dotted trail leads to it, lying open below a game-style dialog box that answers a warranty question and names the document and the page as its source.

---

RAG for business means connecting a language model to your company's own documents, so that it answers questions from your procedures, product sheets and contracts instead of from memory, and shows where each answer comes from. Here RAG stands for retrieval-augmented generation, not the red-amber-green status of project reports. For a small or medium business, the technology is the easy part. What decides whether the team trusts the assistant is the state of the documents behind it.

Every SME has someone everyone asks: the person who knows which price list is current, how the warranty works on an older model, where the supplier contract is filed. A RAG assistant can take part of that load off them, but only if what they know is written down somewhere it can read. This guide explains how RAG works, where it pays off in an SME, where it does not, and how we build it at OptimizIA.xyz: documents first, tools second.

## How RAG Works, in Four Moves

The term comes from a 2020 research paper by Facebook AI Research. The idea is simple: instead of retraining a model on your data, you look up the relevant passages at the moment of the question and give them to the model, with the instruction to answer from them only. It is level two of the six levels of AI use we teach in our [AI training workshop](https://www.optimizia.xyz/case-studies/ai-training/).

| Move | What happens | What it needs from you |
|---|---|---|
| 1. Index | Documents are split into passages and stored in an index that finds text by meaning, not only by keyword | Readable files, current versions only |
| 2. Retrieve | The question is matched with the most relevant passages, filtered by who is asking | Access rights that mirror the source folders |
| 3. Generate | The model writes an answer from those passages only | A clear rule: no source, no answer |
| 4. Cite | The answer links back to the passage and the document | Documents with a title, an owner and a date |

Because the model reads your documents at question time, changing an answer means changing the document. There is no retraining, which is why RAG suits a business whose procedures and prices move during the year.

## Where RAG Pays Off in an SME

| Use case | Source documents | Who asks | Good first project? |
|---|---|---|---|
| Internal procedures (HR, quality, IT) | Staff handbook, procedures, quality manual | Employees | Yes: internal audience, low risk |
| Onboarding | Procedures, glossary, recorded explanations | New hires | Yes |
| Customer service answers | Product sheets, manuals, terms of sale, past tickets | The support team first, customers later | Yes, with a person reviewing each draft |
| Field technical support | Maintenance manuals, spec sheets, intervention reports | Technicians | Yes, once scanned manuals have been converted to text |
| Sales answers and quotes | Catalogue, price list, past proposals | Sales team | Only once there is one current price list |
| Contracts and compliance | Contracts, regulations, internal policies | Management | Later: every answer must be checked |

Our rule for a first project: an internal audience, a question that comes back every week, and documents that one person owns. Customer-facing assistants come second, once the team has seen how the assistant behaves on its own documents. In our look at [IBM intelligent automation](https://www.optimizia.xyz/blog/ibm-intelligent-automation/), retrieval is one of the five steps of a customer care workflow; this guide looks at it on its own.

## When RAG Is Not the Answer

- **The answer sits in a database, not a document.** Stock levels, order status, a customer's balance: a workflow should query the ERP or CRM directly. RAG reads text, it does not look up live figures reliably.
- **The documents fit in one prompt.** If everything relevant is a twenty-page handbook, current models can read it whole. A search index adds moving parts for nothing.
- **The knowledge is not written down.** RAG retrieves, it does not invent what nobody wrote. If the answer lives in one person's head, the first job is to capture it.
- **You want a style, not facts.** Fine-tuning a model on your texts changes how it writes, not what it knows. For an SME, a few examples in the prompt usually cover the tone, and fine-tuning is rarely worth its cost.
- **A plain search would do.** If people know which file they need and only struggle to find it, a cleaner folder structure may be enough.

## Your Documents Decide the Quality

Most RAG projects that disappoint fail on the documents, not on the model. If two procedures contradict each other, the assistant will quote both. If last year's price list sits next to this year's, it may pick the wrong one. Our guide to [intelligent process automation](https://www.optimizia.xyz/blog/intelligent-process-automation-ipa/) makes the same point: an assistant needs a curated knowledge base, not raw files. That is why we start with knowledge management, the discipline of keeping a business's know-how findable, current and owned.

Before indexing anything, check six points:

- **One current version.** Move outdated documents out of the indexed folders instead of leaving them next to the new ones.
- **An owner per document.** Someone who updates it when the process changes, and whose name appears with the answer.
- **A title and a date that say what it is.** "Procedure_v3_final2.docx" helps neither the person nor the assistant.
- **Readable formats.** Scanned PDFs need text recognition first, tables pasted as images are lost, and spreadsheets often work better through a workflow than through RAG.
- **Access rights decided upfront.** What sales may see, what only management may see. The assistant must never answer someone from a document they could not open themselves.
- **Tacit knowledge captured.** Short structured interviews with the people everyone asks, turned into written answers that they validate.

This method comes from knowledge management programmes run at industrial scale. Before OptimizIA.xyz was founded, [Rémy Ginoux](https://www.optimizia.xyz/about.html) created and ran 244 expert communities at Volvo Group, with 30,000 unique users a month. The discipline is the same for a twenty-person business, with fewer folders.

## How We Build a RAG Assistant in Five Steps

### 1. Pick one family of questions

"Questions about our warranty terms" or "what new hires ask in their first month". Collect fifty real ones from emails, tickets and the people everyone asks: they become the test set. Our [AI readiness assessment](https://www.optimizia.xyz/blog/ai-readiness-assessment/) helps choose which family to start with.

### 2. Clean the documents that answer them

Only the documents those questions need, in their current version, each with an owner. That is often a few dozen files, not the whole shared drive.

### 3. Index them with their access rights

We build the pipeline on [n8n](https://www.optimizia.xyz/blog/n8n-workflow-automation/), which has native building blocks for indexes, embeddings and language models, hosted on your infrastructure or on our servers located in France. The index mirrors the permissions of the source folders.

### 4. Test against a pass mark

Run the fifty questions and review each answer with the document owner: right, wrong, or "I don't know". A confident wrong answer weighs far more than an honest "I don't know". This is the proof of concept described in our [AI proof of concept guide](https://www.optimizia.xyz/blog/ai-proof-of-concept/), with the pass mark written before the test.

### 5. Put it where people already work

In Teams, Slack, email or the intranet, not in one more tool. Every answer shows its sources, a negative rating goes to the document owner, and a scheduled workflow updates the index when a document changes.

## Security and Confidentiality

- **Access rights.** The assistant answers each person only from documents they are allowed to open.
- **Where the data lives.** The documents and the index stay on your infrastructure or on servers located in France. With a hosted model, only the passages needed for a question are sent to it.
- **The model provider.** On their business offers, the main providers state that they do not train their models on customer data by default. Check the retention period and the processing region in their terms.
- **Traceability.** Questions, answers and the sources used are logged, so you can see what the assistant said and why.

Our page on how we [secure and capitalise on your know-how](https://www.optimizia.xyz/levers.html#capitalise) details the governance side.

## What a RAG Assistant Costs

At OptimizIA.xyz, the three service levels are published on our [services page](https://www.optimizia.xyz/services.html):

- **AI & Knowledge Diagnostic**, from €1,000 excl. VAT, one to three weeks. Scoping workshops, analysis of how knowledge flows in your business and a list of priority use cases with gain estimates. It tells you whether your documents are ready.
- **PoC and MVP**, from €1,500 excl. VAT as a fixed fee, two to five weeks. The five steps above on one family of questions; a validated proof of concept becomes a working MVP in 13 days on average.
- **Copiloting and continuous improvement**, from €100 excl. VAT a month. Monitoring, fixes and new families of questions added from a prioritised backlog.

Running costs are usually small: hosting and AI usage come to a few tens of euros a month for an SME volume. Before committing, our [automation ROI calculator](https://www.optimizia.xyz/tools/automation-roi-calculator/) shows whether the time saved covers the build.

## Why RAG Projects Disappoint

- **Indexing the whole drive.** Old versions, drafts and duplicates come back in the answers.
- **No test set.** Without fifty real questions and a pass mark, nobody knows whether it works.
- **Answers without sources.** Users cannot check them, so they stop trusting the assistant after its first mistake.
- **Ignoring access rights.** One answer quoting a salary file is enough to end the project.
- **Nobody owns the documents.** The assistant is right in month one and wrong in month six.

## Take the Next Step

Write down the ten questions your team asks most often and where the answers live. If they are in documents someone keeps current, you are ready for a proof of concept: [book a call](https://www.optimizia.xyz/contact.html) and we will tell you what to test first. If they are mostly in people's heads, start with a [diagnostic](https://www.optimizia.xyz/levers.html#diagnose).

## Frequently asked questions

### What does RAG mean in business?

In AI, RAG stands for retrieval-augmented generation: a language model answers from passages retrieved in the company's own documents and cites them. In project reporting, RAG also means a red-amber-green status, which is unrelated.

### Is RAG better than fine-tuning for a small business?

Usually, yes. RAG gives the model your facts at question time, so updating a document updates the answer. Fine-tuning changes how a model writes, has to be redone when facts change, and is rarely worth its cost for an SME.

### How much does a RAG assistant cost for an SME?

At OptimizIA.xyz, a first assistant is built within the PoC and MVP engagement, from €1,500 excl. VAT as a fixed fee. Running costs are usually a few tens of euros a month in hosting and AI usage.

### Is our data safe with RAG?

It can be, if the design is right: the documents and the index stay on your infrastructure or on servers located in France, the assistant respects the access rights of the source folders, and the model provider's business terms exclude training on your data.

### Does RAG work on scanned documents?

Yes, once they have been converted to text. The result depends on the scan quality: tables and handwritten notes often need checking by hand.
