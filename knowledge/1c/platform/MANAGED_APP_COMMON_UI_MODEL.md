# 1C:Enterprise 8 — Managed Application Common UI Model

Updated: 2026-08-15
Scope: reusable platform-level knowledge for Tutor replicas
Authority: primary 1C platform materials

## Why this layer exists

Accounting KZ, ZUP, Trade, UNF, ERP and other configurations share platform-level interaction concepts. Tutor should implement these once as reusable primitives and let each configuration/version passport supply terminology, visibility and layout.

## Primary sources

- `https://v8.1c.ru/platforma/komandnyy-interfeys/` — command interface.
- `https://v8.1c.ru/platforma/redaktor-formy/` — forms, form commands, standard/global commands.
- `https://v8.1c.ru/platforma/kontseptsiya-polzovatelskogo-interfeysa/` — UI concept, sections, current-section functions, open items, system areas.
- `https://v8.1c.ru/platforma/yuzabiliti/` — lists, form customization, validation/messages, related information, history and navigation mechanisms.
- `https://its.1c.ru/db/content/v8std/src/1%C2%A0300/1%C2%A0400/i8100620.htm` — managed-form command-panel guidance.

## P1 — Application section

Node concept: `PlatformSection`

A configuration exposes functionality through sections/subsystems. The command interface may include commands for:
- opening object lists;
- creating new objects;
- opening reports;
- custom configuration actions.

Tutor primitive:
- `SectionNavItem`
- semantic ID, label, active state, availability rules.

Important: exact visible sections depend on configuration, enabled functionality, role and user customization.

## P2 — Current-section functions / navigation

Node concept: `SectionCommand`

Commands can navigate to lists, reports and creation actions. Their visibility may be affected by roles and functional options.

Tutor primitive:
- `SectionCommandList`
- supports search/lookup later;
- no fixed coordinate assumptions.

## P3 — List form

Node concept: `ObjectListScreen`

Reusable semantic behaviors:
- display multiple objects/records;
- select/open an item;
- invoke creation of a new item;
- refresh/filter/search where exposed by configuration;
- contextual row actions.

Tutor primitives:
- `ListScreen`
- `ListTable`
- `ListCommandBar`
- `CreateCommand`
- `OpenRowAction`
- optional `Filter/Search`.

The platform can customize list forms, so passport decides exact columns/commands.

## P4 — Object/card form

Node concept: `ObjectFormScreen`

Reusable behaviors:
- edit object attributes;
- invoke form commands;
- save/close;
- navigate to related information where available.

Tutor primitives:
- `ObjectForm`
- `FormSection`
- `FieldControl`
- `SelectorControl`
- `FormCommandBar`.

## P5 — Document form

Node concept: `DocumentFormScreen`

Documents are distinct from master-data cards because they may have lifecycle/actions such as save, post and related movements depending on configuration object behavior.

Tutor primitives:
- `DocumentForm`
- `DocumentHeader`
- `TabularSection`
- `DocumentTotals`
- `DocumentLifecycleCommands`.

Critical rule: `Провести`, `Отмена проведения`, `Провести и закрыть` etc. are enabled only when the exact configuration/passport says they apply. Do not assume every document posts.

## P6 — Tabular section

Node concept: `TabularSection`

Used for document lines and other repeating data. Platform guidance treats tabular-part command panels separately from the form command panel.

Tutor primitives:
- `Grid`
- `GridRow`
- `AddRow`
- `DeleteRow`
- editable column controls;
- row-derived calculations.

This is the basis for the customer-invoice item table.

## P7 — Command bar

Node concept: `CommandBar`

Platform forms can contain standard and custom commands. Some standard commands are platform-generated automatically; visibility may vary by role/configuration.

Tutor rule:
- commands are data-driven from Interface Passport;
- each command has a stable semantic ID;
- coach targets semantic command IDs, not text alone;
- layout can change without rewriting workflow state machine.

## P8 — Save state vs business state

Tutor must distinguish:
- form draft state: unsaved local edits;
- persisted object/document state: saved in training scenario store;
- posted/registered state: only for objects whose canonical workflow supports it.

This distinction enables meaningful feedback such as `Карточка заполнена, но ещё не сохранена`.

## P9 — Validation and message focus

Platform usability materials include validation/fill checks and error messaging. Tutor should emulate the learning value, not reproduce proprietary message text blindly.

Tutor behavior:
- invalid required field → field-level message + focus;
- state assertion failure → learning checklist;
- wrong business operation → explain consequence, not generic `Неверно`.

## P10 — Related information / navigation history

Platform exposes related-information/navigation/history concepts. Tutor may progressively add:
- `Show in list` behavior;
- related documents;
- breadcrumb/history stack;
- return to previous list without losing state.

These are secondary for Stage 1B but should fit the shell architecture.

## P11 — Customizable interface consequence

1C platform command interface adapts to roles, functional options and user settings. Therefore Atlas must maintain two layers:

1. `semantic canonical`: what object/workflow/command concept exists;
2. `reference layout passport`: how it appears in one selected build/profile.

Tutor fidelity target is semantic + visual familiarity, not false promise that every real installation has identical coordinates.

## Suggested component architecture

```text
TrainingWorkspaceShell
├─ SectionNavigation
├─ WorkspaceHeader
├─ ScreenHost
│  ├─ ListScreen
│  ├─ ObjectForm
│  └─ DocumentForm
│     └─ TabularSection
├─ ContextualCoachLayer
└─ TaskPanel / mobile BottomSheet
```

All interactive controls expose `data-semantic-id` (or equivalent internal ID) for guidance/testing.

Example:
- `section:sales`
- `command:counterparty:create`
- `field:counterparty:name`
- `command:form:save-close`

## Verification consequence

The guidance engine observes semantic events:
- `screen.opened`
- `command.invoked`
- `field.changed`
- `object.saved`
- `document.saved`
- `document.posted` when canonical
- `row.added`
- `selection.changed`

Lesson completion reads domain state, while guidance may also read the event stream to determine the next contextual hint.

## Confidence

A: generic platform concepts above.
B/Passport-required: which exact commands/labels/columns appear in a particular Accounting KZ/ZUP/etc. screen and where they are placed.