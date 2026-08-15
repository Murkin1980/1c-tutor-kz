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
      └─ local progress (server adapter later)
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
│  ├─ verification/          # theory legacy + v2 result facade
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
- Interface Passport reference.

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

Targets are registered by stable semantic IDs such as `nav.sales`, `counterparties.create`, `counterparty.name`, not by brittle CSS selectors.

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

Example counterparty assertions:
- expected counterparty exists;
- expected name matches;
- required fictional city matches;
- record is saved.

## 8. Progress

Stage 1B keeps progress behind a repository interface. Persist:
- scenario id/version;
- mode;
- completion status;
- hints/show-action count;
- retries/resets;
- verification summary;
- timestamps.

Do not introduce Supabase solely to implement the first vertical slice.

## 9. UI fidelity and Interface Passport

Every simulated workflow must reference research evidence. Build reusable primitives that resemble the selected 1C interaction model: application header, section navigation, command bar, list, form, tabs/groups, input/select, save/close commands, status indicators.

Do not claim pixel-perfect parity without an approved Interface Passport. Do not use official logos or proprietary assets unnecessarily.

## 10. Security

- CSP default self-only;
- no state-changing requests to external accounting/government systems;
- no real credentials/identifiers;
- `TrainingModeBanner` always visible in workspace;
- fixtures visibly fictional;
- no external app iframe;
- secrets check remains mandatory.

## 11. Observability events

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

Never log sensitive user/business data.

## 12. Deployment

Frontend remains Cloudflare Pages compatible:
- production branch `main`;
- `npm run build`;
- output `dist`;
- SPA fallback;
- no mandatory backend for Stage 1B vertical slice.

Server persistence, multi-user analytics and admin authoring are later stages behind an MPE gate.