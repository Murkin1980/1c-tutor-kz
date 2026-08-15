# MPE Decision — 1C Knowledge Atlas

Date: 2026-08-15

## Decision

`EXTEND_EXISTING`

## Problem

1C Tutor will eventually need many workflows across Accounting, HR/Payroll, Trade/Warehouse and other 1C configurations. Re-researching each workflow ad hoc would produce duplicated effort, inconsistent versions and unreliable interface assumptions.

## Decision

Create a permanent `knowledge/1c/` layer inside the existing `1c-tutor-kz` repository.

The layer combines:
- source registry;
- taxonomy;
- versioned evidence;
- knowledge graph nodes/edges;
- workflow records;
- Interface Passports;
- retrieval and ingestion rules.

A future RAG/vector index is allowed only as a derivative retrieval mechanism. Git-versioned Atlas records remain canonical.

## Why not a separate repository

The knowledge directly governs this product's simulator UI, domain workflows, course sequencing and tests. A separate repository would increase synchronization risk without proven independent business value.

## Why not a separate long-lived branch

Branches are development states, not durable knowledge storage. Atlas must become part of the main source of truth after review/merge. Development may occur on normal feature/MPE branches.

## Business value

- reduce repeated web research;
- preserve version/provenance knowledge;
- make UI fidelity auditable;
- enable systematic expansion to ZUP/Trade/UNF/ERP;
- improve reuse of common platform concepts;
- prevent hallucinated workflow implementation;
- make future agent/RAG retrieval grounded.

## MVP / minimal experiment

Bootstrap Atlas now and use it for the Counterparty vertical slice.

Before broad curriculum expansion, run Stage K1 to prove retrieval across five representative queries.

## Deep-change status

This does not create a new product or repository and does not change the approved Training Workspace product goal. It strengthens the evidence/reuse layer, so no additional deep-change approval is required.

## Constraints

- do not mirror copyrighted manuals/ITS corpora;
- do not bypass licensed access;
- regulatory/payroll facts require exact KZ evidence and specialist review;
- do not attempt to model all of 1C before demand exists;
- implementation workflows must resolve to Atlas evidence before fidelity claims.
