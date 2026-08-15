# INTERFACE PASSPORT TEMPLATE

## Identity
- `id`:
- `configuration`:
- `edition`:
- `version`:
- `workflow_id`:
- `observed_at`:
- `reviewed_at`:
- `status`: draft / verified / superseded

## Sources
- source ids:
- evidence ids:
- access notes:

## Environment
- client: web / thin / desktop / unknown
- UI family:
- viewport / scaling:
- language/locale:
- enabled functionality that affects the screen:

## Navigation path
1.
2.
3.

## Screens
For each screen:
- stable screen id:
- observed title:
- purpose:
- parent/entry point:
- key layout regions:

## Commands
For each command:
- command id:
- observed label:
- screen:
- placement relationship:
- enabled conditions:
- resulting state/navigation:

## Fields / table parts
For each control:
- field id:
- observed label:
- type:
- required/optional if verified:
- default/selection behavior:
- validation/error behavior:

## State transitions
```text
state A --command/action--> state B
```

## Errors / warnings
- trigger:
- observed behavior:
- source/evidence:

## Tutor fidelity decisions
- behavior that must match:
- visual relationships that must match:
- safe simplifications:
- deliberate differences:
- prohibited official branding/assets:

## Confidence
- overall: A/B/C/D
- unresolved gaps:

## Regression checklist
- [ ] navigation labels checked
- [ ] command labels checked
- [ ] required fields checked
- [ ] state transitions checked
- [ ] mobile adaptation does not teach a contradictory workflow
