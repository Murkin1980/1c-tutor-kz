# Source records — Accounting KZ 3.0 Stage 1B

Updated: 2026-08-15

These source IDs extend `SOURCE_REGISTER.md` for the active Stage 1B deep-ingestion path.

## KZ-ACC30-TRADE-TYPICAL
- authority: primary
- scope: Accounting KZ 3.0 `Типовые ситуации в торговой деятельности`; contains the standard acquisition/prepayment and sale/prepayment chains
- url: `https://its.1c.kz/db/acc30kz/content/56/hdoc`
- access: public-index / some deep article bodies may require ITS authorization
- freshness: edition 3.0; observed 2026-08-15
- confidence use: A for existence/order of named workflow steps; B for exact screen layout

## KZ-ACC30-CONTRACTS
- authority: primary
- scope: types of counterparty contracts and creation in Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/103697/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0; observed 2026-08-15
- confidence use: A for feature/workflow existence; B for exact controls without build observation

## KZ-ACC30-REALIZATION
- authority: primary
- scope: realization of inventory/materials and services in Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/103699/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0; observed 2026-08-15
- confidence use: A for realization workflow existence/terminology

## KZ-ACC30-CUSTOMER-REPORTS
- authority: primary
- scope: management reports / settlements with customers in Accounting KZ 3.0
- url: `https://its.1c.kz/db/accountingkz/content/104034/hdoc`
- access: public-index/mixed-detail
- freshness: edition 3.0; observed 2026-08-15
- confidence use: A for existence of customer-settlement reporting

## KZ-ACC30-METHOD-INDEX
- authority: primary
- scope: Accounting KZ methodological-support index exposing sections and detailed topics including bank/cash, purchase, sale, reports and contracts
- url: `https://its.1c.kz/db/accountingkz/`
- access: public-index/mixed-detail
- freshness: checked 2026-08-15
- confidence use: discovery only unless exact article is separately registered

## Retrieval rule

When Stage 1B is queried, retrieve this source file together with the canonical `SOURCE_REGISTER.md`. If the same source ID appears in both, the canonical register entry wins unless this file has a later explicit revision date.