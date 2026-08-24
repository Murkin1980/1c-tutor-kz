# ARCHITECTURE — 1C Tutor KZ

Обновлено: 2026-08-15.

## 1. Общая схема Stage 1B

```text
Browser / Cloudflare Pages
└─ React + TypeScript application
   ├─ Learning Shell
   │  ├─ course / lesson context
   │  ├─ mode selector
   │  └─ task/help drawer
   ├─ Training Workspace
   │  ├─ 1C-like navigation shell
   │  ├─ training screens/forms/tables
   │  ├─ deterministic domain state
   │  └─ reset/seed engine
   ├─ Guidance Engine
   │  ├─ target registry
   │  ├─ coach bubble
   │  ├─ spotlight
   │  ├─ condition-driven step engine
   │  └─ hints/show-action
   ├─ Verification Engine v2
   │  ├─ state assertions
   │  ├─ transparent PASS/FAIL checklist
   │  └─ assisted/unassisted result
   └─ Repository abstractions
      ├─ local training state
      └─ hybrid progress: local fallback + same-origin MiniBase proxy
```

No external 1C service is required for the Stage 1B core loop.

## 2. Architectural boundaries

### Learning Shell
Knows scenario, source data, learning mode, progress and explanations. It does not directly mutate accounting state.

### Training Workspace
Owns the simulated application UI and domain actions. It behaves like a narrow training application, not like a quiz.

### Training Domain
Pure TypeScript domain model and commands, independent of React where practical. It must be deterministic and testable.

### Guidance Engine
Observes target availability and domain/UI conditions. It never fakes a successful domain operation.

### Verification Engine v2
Reads domain state and returns structured assertions. It must not use learner-entered quiz answers as proof of a practical operation.

### Unified Accounting Knowledge Atlas
`knowledge/1c/` is the single canonical knowledge layer for 1C, local accounting, international accounting, IFRS, terminology, professional capabilities and provenance. Do not create an independent IFRS knowledge base.

## 3. Proposed source structure

```text
src/
├─ app/
├─ routes/
├─ content/
├─ entities/
│  ├─ course/
│  └─ training/
├─ features/
│  ├─ auth/
│  ├─ progress/
│  ├─ verification/
│  ├─ training-workspace/
│  │  ├─ domain/
│  │  ├─ repository/
│  │  ├─ screens/
│  │  └─ components/
│  └─ guidance/
│     ├─ engine/
│     ├─ components/
│     └─ target-registry/
└─ shared/

knowledge/1c/
├─ graph/
├─ inventory/
├─ workflows/
├─ interfaces/
├─ evidence/
├─ sources/
├─ international/
│  ├─ SOURCE_REGISTER.md
│  ├─ CURRICULUM_SKELETON.md
│  └─ TOPIC_BRIDGES.md
└─ ...
```

Do not create a second frontend or separate repository.

## 4. Training domain v1

First entities:
- `TrainingCounterparty`;
- `TrainingInvoice`;
- `TrainingInvoiceLine`;
- `TrainingPayment`;
- `TrainingScenarioState`;
- `TrainingActionEvent`.

First commands:
- create/update/save counterparty;
- create/update/save invoice;
- add/update/remove invoice line;
- register payment;
- reset scenario.

Stage 1B vertical slice implements only the counterparty subset first.

## 5. Scenario model

A practical scenario declares:
- id/version;
- business goal;
- seed state;
- allowed workspace capabilities;
- Demo script;
- Guided steps with target + advance condition;
- Independent Test task text;
- state assertions;
- hint ladder;
- expected result;
- Interface Passport reference where application UI fidelity matters;
- Atlas topic/capability references where professional capability matters.

Content remains data-driven where possible; do not hard-code lesson logic into one giant page component.

## 6. Guidance Engine

A `GuidanceStep` contains:
- `targetId`;
- instruction;
- optional why-text;
- hint1/hint2;
- `advanceWhen(state, uiState)`;
- optional `showAction` implementation for Demo/Guided;
- recovery rule.

Targets are registered by stable semantic IDs such as `nav.sales`, `counterparties.create`, `counterparty.name`, not brittle CSS selectors.

Coach positioning must use actual element bounds and recalculate on resize/scroll.

## 7. Verification Engine v2

```ts
type AssertionResult = {
  id: string;
  label: string;
  passed: boolean;
  feedback?: string;
};

type PracticalVerificationResult = {
  passed: boolean;
  assertions: AssertionResult[];
  assistance: 'none' | 'hints' | 'shown-action';
};
```

Verifier is a pure function over scenario + training state whenever possible.

For future international modules, the same verifier pattern applies to work products such as:
- reconciliation differences resolved;
- supporting schedule totals agree to ledger;
- journal entry balances;
- trial balance after adjustments;
- financial-statement classification;
- case assumptions documented;
- required source-backed IFRS treatment selected.

## 8. Progress and capability evidence

Stage 1B keeps progress behind a repository interface. Persist:
- scenario id/version;
- mode;
- completion status;
- hints/show-action count;
- retries/resets;
- verification summary;
- timestamps.

Long-term, progress may additionally reference `Capability` and `Assessment` IDs from Atlas. A capability must not be marked proven solely from a multiple-choice answer when a practical work product can be verified.

Do not introduce Supabase solely to implement the first vertical slice.

## 9. UI fidelity and Interface Passport

Every simulated 1C workflow must reference research evidence. Build reusable primitives that resemble the selected 1C interaction model: application header, section navigation, command bar, list, form, tabs/groups, input/select, save/close commands, status indicators.

Do not claim pixel-perfect parity without an approved Interface Passport. Do not use official logos or proprietary assets unnecessarily.

International accounting simulators are not required to imitate 1C. They may use purpose-built work surfaces such as reconciliation workspaces, working-paper grids, close checklists or financial-statement builders, while reusing the same Learning/Guidance/Verification engines.

## 10. International Accountant Track — additive architecture

Long-term progression:

`1C Practice → Accounting Logic → Economic Substance → IFRS Treatment → Financial Statements → International Practice → Capability Assessment`.

No new runtime is required by the architecture pass.

Future domain surfaces may include:
- bank reconciliation workspace;
- AP/AR reconciliation workspace;
- accrual/prepayment schedule;
- fixed asset register;
- inventory reconciliation;
- trial balance / journal-adjustment workspace;
- month-end close checklist;
- financial-statement builder;
- IFRS case evidence pack;
- audit-supporting working papers.

These are future stages behind MPE gates.

## 11. Unified Atlas requirements for international knowledge

The Atlas schema supports:
- `Topic`;
- `KnowledgeLayer`;
- `Jurisdiction`;
- `Standard`;
- `StandardParagraphReference`;
- `AccountingConcept`;
- `BusinessProcess`;
- `TransactionType`;
- `1COperation`;
- `AccountingTreatment` for local or IFRS treatment;
- `FinancialStatementImpact`;
- `AccountingEntry`;
- `Terminology`;
- `Example`;
- `Case`;
- `Exercise`;
- `Assessment`;
- `DifficultyLevel`;
- `Prerequisite`;
- `LearningOutcome`;
- `Capability`;
- `Source`;
- `SourceVersion`;
- `EffectiveDate`.

This is backward-compatible with current 1C graph records.

## 12. Normative IFRS boundary

IFRS treatment is time/version-sensitive normative knowledge.

Any authoritative treatment must link to source/version/effective-date metadata. AI-generated explanations may assist learning but cannot be the source of truth.

Do not bulk-copy IFRS Standard text into the repository/product. Store structured identifiers, references, provenance, bounded summaries where appropriate and Tutor-authored explanations/cases. Re-check licensing before commercial embedding of licensed IFRS content.

## 13. Security

- CSP default self-only;
- no state-changing requests to external accounting/government systems;
- no real credentials/identifiers in core training fixtures;
- `TrainingModeBanner` always visible in 1C-like workspace;
- fictional data by default;
- no external app iframe;
- secrets check remains mandatory.

Future international case packs may contain synthetic English-language source documents. Real client documents are out of scope unless a separate privacy/data-handling architecture is approved.

## 14. Observability events

Add/retain:
- `scenario_started`;
- `training_action`;
- `guidance_step_advanced`;
- `hint_opened`;
- `show_action_used`;
- `verification_requested`;
- `assertion_failed`;
- `scenario_reset`;
- `scenario_completed`.

Future capability events may include:
- `work_product_created`;
- `reconciliation_completed`;
- `capability_assessed`;
- `source_reference_opened`.

Never log sensitive user/business data.

## 15. Deployment

Frontend remains Cloudflare Pages compatible:
- production branch `main`;
- `npm run build`;
- output `dist`;
- SPA fallback;
- no mandatory backend for Stage 1B vertical slice.

Owner decision 2026-08-24: when server persistence is introduced, the required database platform is the existing **MiniBase on Cloudflare Workers + D1**, not Supabase and not a second custom backend. The browser may receive only MiniBase URL and `mb_publishable_*`; management/secret keys and Cloudflare tokens remain server-only.

Implementation checkpoint 2026-08-25: progress writes use `/api/progress` in Cloudflare Pages Functions. The Function verifies the signed `Cf-Access-Jwt-Assertion` against the configured Access issuer/audience, restricts the owner email, then calls MiniBase with a server-only `mb_secret_*`. Direct browser writes with a publishable key are forbidden. The local repository remains the offline/failure fallback and conflicts resolve per lesson by `updatedAt`.

Current deployment evidence and the safe rollout sequence are recorded in `docs/deployment/CLOUDFLARE_MINIBASE_DEPLOYMENT_ASSESSMENT.md`. Server persistence, multi-user analytics and admin authoring remain separate gated stages; selecting MiniBase does not authorize premature implementation.

## 16. Sequencing rule

The International Accountant Track is architecturally prepared now but implemented only after the core 1C/Accounting KZ learning engine reaches a sustainable level and a new MPE gate confirms priority.

The international architecture must strengthen the existing system, never become a parallel product by default.
