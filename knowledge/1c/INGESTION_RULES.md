# INGESTION RULES — 1C Knowledge Atlas

## Goal

Convert external 1C information into small, versioned, reviewable facts that can safely drive training implementation.

## 1. Start with a knowledge question

Never crawl broadly without purpose. Write a bounded question, for example:
- Where is creation of a counterparty located in Accounting KZ 3.0?
- What controls and states are required to create a customer invoice?
- What is the current navigation model of ZUP KZ for employee hiring?

## 2. Discover primary sources first

Priority:
1. exact Kazakhstan configuration documentation;
2. Kazakhstan official product/release pages;
3. platform documentation for generic mechanics;
4. analogous official RU documentation only for generic or comparative clues;
5. secondary sources for discovery/usability signals.

## 3. Record provenance

For every extracted fact capture:
- source id/url;
- title;
- configuration;
- edition/version;
- publication/observation date when available;
- date Atlas observed it;
- access class;
- fact summary in our own words;
- confidence grade;
- whether fact was directly observed or inferred.

## 4. Normalize, do not mirror

Do NOT bulk-copy:
- ITS articles;
- books/manuals;
- screenshots;
- training videos/transcripts;
- proprietary icons/assets.

Store structured facts and short summaries. Keep source links for human verification.

## 5. Interface evidence

For a UI-sensitive workflow create/update an Interface Passport containing:
- exact configuration/edition;
- observed UI family (for example Taxi);
- navigation labels;
- screens/forms;
- command labels;
- fields/table parts;
- important placement relationships;
- state transitions;
- warnings/errors;
- differences in Tutor replica;
- evidence ids.

Screenshots may be used locally for research/regression only when legally permitted; repository inclusion requires explicit review of rights and necessity.

## 6. Contradictions

If two sources conflict:
- do not pick silently;
- create both evidence records;
- mark relevant node `conflicted`;
- prefer exact configuration + newer exact version + primary source;
- if still unresolved, require manual observation before fidelity implementation.

## 7. Version changes

Never overwrite history. Add new version/passport/evidence and connect with `SUPERSEDES`.

## 8. Regulatory/high-risk knowledge

Tax, payroll, statutory forms, postings and legal deadlines require:
- current primary source;
- exact KZ localization;
- explicit validation by accountant/methodologist before course publication.

Atlas can store unvalidated research but must mark it `research_only`.

## 9. Done condition for an ingestion task

An ingestion task is DONE when:
- source registered;
- required nodes/edges exist;
- evidence records support them;
- confidence is assigned;
- workflow record exists if relevant;
- Interface Passport exists if UI fidelity matters;
- gaps/unknowns are explicit;
- retrieval query now returns READY or a clear bounded remaining gap.

## 10. Automation later

A future ingestion agent may automate discovery and draft records, but publication to canonical Atlas must remain schema-validated and reviewable. Automatic web text ingestion must not bypass copyright/provenance rules.