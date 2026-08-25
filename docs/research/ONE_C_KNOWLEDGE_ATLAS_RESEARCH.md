# 1C Knowledge Atlas — source research

Date: 2026-08-15

## Findings

The official Kazakhstan 1C information system already exposes a broad structured documentation landscape rather than one monolithic manual.

The `1С:ИТС Казахстан` user-documentation index lists product families including:
- Бухгалтерия для Казахстана;
- Зарплата и Управление Персоналом для Казахстана;
- Управление нашей фирмой для Казахстана;
- ERP Управление предприятием 2 для Казахстана;
- Комплексная автоматизация для Казахстана;
- other localized products.

The same information system exposes Accounting KZ methodological material grouped into functional areas such as:
- Главное;
- Банк и касса;
- Покупка;
- Продажа;
- Номенклатура и склад;
- reports and other accounting topics.

Official Accounting KZ 3.0 material confirms use of the managed application / Taxi interface family and notes that users can configure panel placement, section commands, command bars and form attributes. This is important for Tutor fidelity: the Atlas should model semantic relationships and observed layout regions, not assume one immutable pixel coordinate layout.

Official 1C platform documentation also distinguishes generic platform behavior from configuration-specific behavior. Therefore the Atlas uses a separate `platform` layer and configuration/version layers.

Official Kazakhstan localized-solution listings show that the ecosystem extends well beyond accounting into Trade, ERP, document management, public-sector products and other localized solutions. The Tutor roadmap must select cross-configuration tracks by user value rather than trying to replicate the whole ecosystem.

## Architecture implication

Use a graph structure:

`Platform → Configuration → Edition/Version → BusinessArea → Object/Screen/Command/Field → Workflow → LearningScenario → VerificationAssertion`.

Attach Source/Evidence/InterfacePassport nodes to every implementation-sensitive fact.

## Storage implication

Canonical data remains Git-versioned Markdown/JSONL.

A future RAG index may index summaries and aliases, but every retrieved claim used for implementation must resolve to canonical node IDs and evidence/source IDs.

## Copyright implication

Do not mirror official documentation. Store normalized facts, metadata, provenance and bounded summaries. Preserve external official links for human verification.

## Initial primary sources

See `knowledge/1c/SOURCE_REGISTER.md` for canonical source IDs and URLs.