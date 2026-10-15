# Booking USA / CP-01B Report — TRAINING ONLY

Date: **2026-10-15**. Dataset: **GVL-2026-09-v1.0.0**. Period: **September 2026**, as of **2026-09-30**. **Accrual / USD / double-entry**. Все документы и контрагенты полностью вымышленные.

**RESULT: PARTIAL** — content, fixtures и machine gate завершены; окончательная методическая готовность к публикации условна: **METHODOLOGY REVIEW PENDING**. Нет известных технических/числовых расхождений. Это не CPA opinion и не утверждение о налоговом соответствии.

## Repository / delivery boundary

- Repository: `Murkin1980/1c-tutor-kz`.
- Working branch: **`arena/a33bef3c-1c-tutor-kz`**, единственная разрешённая session branch.
- Target branch: **`booking-usa`**, не `main`.
- Initial session HEAD: `18094672bbbcdd124c9917ae61e27ba98b39ad80`; целевая ветка существует, inspected/fetched HEAD: `23c41f2920990e38868e072af78f4f8196cafbac`.
- Before edits: clean worktree; session была на 11 documentation commits позади target, собственных commits не имела (left/right `0 / 11`). `git rebase origin/booking-usa` выровнял **эту же** session branch без merge, переключения, cherry-pick или изменения target.
- При начальной проверке нет open PR в `booking-usa`; параллельные open PR #1/#2 направлены в `main`, не затрагиваются. Target HEAD повторно проверяется перед delivery.
- Доставка разрешена только push session branch и PR **из неё в booking-usa**. Commit SHA / PR number фиксируются в финальном Arena response и GitHub PR (самоссылочный SHA этого документа не требуется).
- **Не выполнялись merge, push target/main, deploy или CP-01C.** Если доставка PR блокируется, сообщить BLOCKED delivery отдельно; локальные fixtures сохранены на session branch.

## Approved scope / reuse evidence

Прочитаны AGENTS, scope-change-control policy, FOUNDATION, README, relevant KZ roadmap/checklists, все перечисленные Booking USA documents и case outline. MPE decision **EXTEND_EXISTING**; **CONTENT + TEST FIXTURES ONLY**. Текущее owner assignment разрешает CP-01B и имеет приоритет над историческим статусом PROPOSED / примерным лимитом 10–20 events в scaffold CP-01.md. Минимум 12 invoices с receipts, bills, banking и adjustments обоснованно требует больше 20 событий: **46 total / 45 September events + opening**, но лишь **25 statement transaction lines ≤ 45**. Никаких искусственных balancing events ради выручки не введено.

CP-01A report в tracked target files и найденных PR отсутствует; его PASS и выводы приняты **из текущего owner assignment**, не объявлены заново независимо проведённым аудитом:

- существующий lesson loop пригоден для повторного использования;
- US course не подключён к runtime;
- verification money model привязан к KZT, progress не course-scoped;
- auth демонстрационная, screenshot verification не настоящая бухгалтерская проверка;
- runtime integration требует отдельного архитектурного разрешения.

Все эти механизмы **не изменялись**. Markdown lesson packages сохраняют цикл context → goal → sources → action → check → feedback → repeat → reconcile. Нет нового parser/lesson schema contract. Локальная Python standard-library utility — fixture generator/validator, не самостоятельная бухгалтерская система или QuickBooks clone.

Общие KZ SESSION_NOTES/VISUAL_PROGRESS намеренно не редактировались: owner scope ограничен Booking USA; evidence и progression находятся здесь и в track index. USD существует только в изолированном пакете; FOUNDATION KZT/ru-KZ неизменна.

## Accounting Results

| Metric | Expected USD |
| --- | ---: |
| Opening Assets, net of accumulated depreciation | $41,700.00 |
| Opening Liabilities | $3,500.00 |
| Opening Equity | $38,200.00 |
| Opening Debits / Credits | $47,700.00 / $47,700.00 |
| September Revenue (12 invoices) | $18,000.00 |
| September Expenses | $5,601.00 |
| September Net Income | $12,399.00 |
| Closing Accounts Receivable | $6,500.00 |
| Closing Accounts Payable | $1,540.00 |
| Closing Operating Checking, book | $16,909.00 |
| Closing Savings, book | $10,500.00 |
| Closing Credit Card Payable, book liability | $1,270.00 |
| Trial Balance debit / credit balances | $65,510.00 / $65,510.00 |
| Trial Balance Difference | $0.00 |
| Closing Assets | $53,409.00 |
| Closing Liabilities + Equity | $2,810.00 + $50,599.00 |
| Balance Sheet Difference | $0.00 |
| Operating / Savings / Card reconciliation differences | $0.00 / $0.00 / $0.00 |

AR: $2,500 + $18,000 − $14,000 − $0 credits/write-offs = $6,500; AP: $1,500 + $3,590 − $3,550 − $0 vendor credits = $1,540. Cash, all invoices/bills и aging согласованы по конкретным документам. Дебиторская задолженность не погашается статусом Paid без remittance.

Operating statement $15,809 + $1,500 deposit in transit − $400 outstanding check = $16,909 book; savings $10,500 = $10,500; card liability $1,200 + $70 unposted September charge = $1,270. **25 индивидуальных matches**, **3** документированных timing items, **0** необъяснённых разниц. Fee $35 уже в эталоне; пропуск и duplicate-feed matching вынесены отдельно.

## Deliverables

Все новые материалы внутри `tracks/booking-usa/cases/green-valley-landscaping/`:

1. `README.md`, `ACCOUNTING_POLICIES.md`, `CHART_OF_ACCOUNTS.csv`: модель, 20 accounts с normal balances/direct-posting policies, точность и methodology gate.
2. `documents/README.md`, `documents/DOCUMENTS.csv`, `documents/opening-history.csv`: **61** synthetic source document, prior revenue/expense/cash bridge, completion/remittance evidence и подтверждения cutoff.
3. `TRANSACTIONS.csv`, **`JOURNAL.csv`**: **46** stable events / **102** journal lines; журнал — единственный источник postings, opening AR/AP имеют отдельные open_item references.
4. `OPENING_BALANCES.csv`, `GENERAL_LEDGER.csv`, `TRIAL_BALANCE.csv`, `PNL.csv`, `BALANCE_SHEET.csv`, `AR_AGING.csv`, `AP_AGING.csv`: воспроизводимые outputs с reporting metadata, формулой, version и source IDs. Aging amounts из журнала, due dates из документов.
5. `statements/operating-checking.csv`, `statements/savings.csv`, `statements/credit-card.csv`, `OUTSTANDING_ITEMS.csv`, `RECONCILIATION.md`: независимые statement facts и полный matching report.
6. `mistakes/README.md`, `mistakes/SCENARIOS.csv`, `mistakes/JOURNAL_PATCHES.csv`, `mistakes/CORRECTIONS.csv`: **5** изолированных ошибок, наблюдаемые report deltas, failed controls, исправления. Неправильные варианты никогда не пишутся в canonical Journal.
7. `lessons/01-invoice-and-payment.md`, `lessons/02-bank-reconciliation.md`, `lessons/03-month-end-reporting.md`: **3** полных RU/EN урока, документные inputs, actions, amounts/postings, hints, mistakes, detailed answers и success criteria.
8. `ANSWER_KEY.md`: все monthly entries, opening journal, ending TB, P&L/BS formulas, AR/AP по документам, reconciliation и lesson answers; ключевые суммы/45 monthly entries сверяются машиной.
9. `validate.py`, `test_validate.py`, `.gitignore`: offline Python standard-library validation, negative/mutation tests, защита от добавления bytecode; нет новых dependencies.
10. `VALIDATION_REPORT.md`, `CP-01B_REPORT.md`: детальное числовое evidence, input hashes, reproducibility и publication/delivery limitations. Cash Flow Statement намеренно не включён (optional).

Минимальные изменения старых track documents — только ссылки и актуальный bounded status: track README, CHECKPOINTS, checkpoint CP-01 и исходный case outline. Нет правок вне `tracks/booking-usa/`.

## Verification — Machine Validation

| Проверка | Результат |
| --- | --- |
| `python3 …/validate.py --write`, затем `--check` | PASS — 9 derived files, read-only sources, byte-for-byte recomputation |
| `python3 -m unittest discover -s tracks/booking-usa/cases/green-valley-landscaping -p 'test_*.py' -v` | PASS — 36 tests, включая negative/mutation/reproducibility и 5 scenario/correction pairs |
| Accounting checks | PASS — opening, every entry, TB, BS, revenue, AR/AP, prepaid/depreciation, three reconciliations |
| Data integrity | PASS — IDs, references, dates/cutoffs, cents, USD, version/labels, quantities/rates и allocations |
| Educational checks | PASS — 3 complete lessons / 5 explained mistakes / checked numeric key; structural + author editorial review, не CPA review |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 4 test files / 6 existing application tests |
| `npm run build` | PASS |
| `npm run check:secrets` | PASS |
| Existing application browser E2E | **NOT RUN** — required Chrome channel отсутствует; browser downloads/изменение Playwright config вне content-only scope не выполнялись |
| `git diff --check` / changed-path boundary | PASS — только Booking USA; no runtime/dependency/config/migration changes |

Воспроизводимость проверяется двумя regeneration runs в temporary copy; source bytes не меняются. Negative tests ловят balanced duplicate revenue, transfer classification, пропуск fee, card-vs-cash, ошибочный partial receipt, missing docs/accounts, date/currency/label violations, stale report, self-consistent wrong prepaid allocation и **неверные references при неизменных bank balances**.

Counter-entries для ошибок доказывают восстановление каждого account balance и AR/AP. Они не подменяют полный canonical gate смесью erroneous/reversal lines: audit trail и нормализованные действительные matches требуются отдельно, как описано в mistakes/README.md. Новый reversal-chain runtime не создавался.

## Independent Accounting Methodology Review

**PENDING — METHODOLOGY REVIEW PENDING.** Доступа к квалифицированному независимому US bookkeeper/CPA в этом выполнении нет; reviewer/date/signature отсутствуют. Machine validation отдельно пересчитывает арифметику и связи **по первичным данным**, но не является независимым профессиональным подтверждением методологии.

До публикации требуется review revenue recognition, expense classification, insurance/software prepayments, book depreciation, accrual assumptions, opening support, AR/AP, reconciliation и answer keys. Полный checklist — ACCOUNTING_POLICIES.md §8. Ни tax advice, ни US GAAP compliance, ни профессиональная квалификация учащегося не подтверждаются.

## Next / STOP

**Технический корректирующий CP-01B.1 не требуется по найденным данным.** Числовой пакет готов служить входом для последующего отдельно разрешённого CP-01C (доступ/права/terms), без исполнения CP-01C сейчас. Публикация и окончательный методический PASS остаются условными; замечания независимого reviewer потребуют отдельно порученного CP-01B.1, перевыпуска version и повторения gate.

**STOP after CP-01B.** Не начинать runtime integration, multi-course currency/progress refactor, auth/screenshot changes, migrations, API integrations, merge или deploy.
