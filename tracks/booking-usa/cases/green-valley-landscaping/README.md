# Green Valley Landscaping LLC — TRAINING ONLY

**Booking USA / CP-01B.** Полностью вымышленная компания и оригинальные синтетические документы. Не бухгалтерская база клиента, не банковская выписка реального банка, не налоговая консультация.

- Dataset: **`GVL-2026-09-v1.0.0`**; дата подготовки 2026-10-15.
- USA; landscaping and garden maintenance; **USD**; **Accrual basis**, **double-entry**.
- Период операций: **2026-09-01–2026-09-30**; отчётная дата **2026-09-30**.
- Два банковских актива: `1000 Operating Checking`, `1010 Savings Account`; одно обязательство `2100 Credit Card Payable`.
- Payroll, Sales Tax, Inventory и любые налоговые обязательства **исключены**, а не признаны равными нулю в реальном бизнесе.
- **Machine validation: PASS. Independent methodology: METHODOLOGY REVIEW PENDING.** Публикация для учащихся условна до проверки US bookkeeper/CPA.

## Один источник проводок

**`JOURNAL.csv` — единственный источник бухгалтерских проводок.** Его нельзя заменять рассчитанными отчётами. Скрипт никогда не переписывает журнал, документы или выписки.

```text
Оригинальные документы → TRANSACTIONS (реестр событий) → JOURNAL (проводки)
                                                        ↓
                     Opening balances / Ledger / TB / P&L / BS / AR / AP
                                                        ↓
Независимые statements + подтверждения cutoff → Reconciliation
```

`documents/DOCUMENTS.csv` — первичные документы (одна строка = один синтетический документ): количество, цена, сумма, завершение услуги, срок оплаты, связь оплаты со счётом. Это независимые доказательства, **не второй журнал**. `TRANSACTIONS.csv` содержит описание, даты и ожидаемый эффект; суммы проводок находятся в журнале. Машина сравнивает эффект с журналом, а журнал — с первичными документами. Совпавший, но неверно классифицированный TB не является достаточной проверкой.

## Воспроизведение без зависимостей

Из корня репозитория, Python 3.10+ / standard library:

```sh
python3 tracks/booking-usa/cases/green-valley-landscaping/validate.py --check
python3 -m unittest discover -s tracks/booking-usa/cases/green-valley-landscaping -p 'test_*.py' -v
# Только после сознательного изменения и проверки исходных данных:
python3 tracks/booking-usa/cases/green-valley-landscaping/validate.py --write
```

`--check` (также режим по умолчанию) ничего не записывает; возвращает ненулевой exit code при расхождении. `--write` сначала проверяет источники, затем воспроизводит **девять** производных файлов. Повторный запуск даёт те же байты. При изменении дат/методологии/исходных сумм требуется новая версия набора, новый review и обновление проверяемых answer keys — не подгонка отчётов.

## Состав пакета

| Файлы | Роль |
| --- | --- |
| `ACCOUNTING_POLICIES.md` | Допущения, периоды, методология и review gate |
| `CHART_OF_ACCOUNTS.csv` | 20 счетов; EN name, RU explanation, type, normal balance, direct-posting policy |
| `documents/DOCUMENTS.csv`, `documents/opening-history.csv`, `documents/README.md` | 61 первичный документ, историческая увязка капитала и денег, правила чтения |
| `TRANSACTIONS.csv` | 46 уникальных событий: 1 opening + 45 September events |
| `JOURNAL.csv` | 46 entry IDs / 102 строки, включая opening AR/AP по отдельным документам |
| `OPENING_BALANCES.csv` | **Производный** срез начала 1 сентября; не независимый ввод |
| `GENERAL_LEDGER.csv`, `TRIAL_BALANCE.csv` | Производные регистры; TB до closing entries |
| `PNL.csv`, `BALANCE_SHEET.csv` | Производные финансовые отчёты |
| `AR_AGING.csv`, `AP_AGING.csv` | Производные по invoice/bill reference; даты из документов, суммы только из журнала |
| `statements/operating-checking.csv`, `statements/savings.csv`, `statements/credit-card.csv` | Независимо заданные выписки, всего 25 transaction lines; opening/closing повторены в каждой строке как metadata |
| `OUTSTANDING_ITEMS.csv` | 3 документированных расхождения cutoff, не дополнительные проводки |
| `RECONCILIATION.md` | Производный Bank Reconciliation Report; все 25 индивидуальных соответствий |
| `mistakes/README.md`, `SCENARIOS.csv`, `JOURNAL_PATCHES.csv`, `CORRECTIONS.csv` | 5 изолированных неправильных вариантов, точный эффект, исправления и правила обнаружения |
| `lessons/01-invoice-and-payment.md`, `02-bank-reconciliation.md`, `03-month-end-reporting.md` | 3 полных урока, без подключения к приложению |
| `ANSWER_KEY.md` | Общий подробный ключ, контрольные суммы и проводки |
| `validate.py`, `test_validate.py` | Локальная проверка fixture; не новый бухгалтерский runtime |
| `VALIDATION_REPORT.md`, `CP-01B_REPORT.md` | Машинное evidence и отчёт checkpoint/delivery/review |

## Как читать CSV

- UTF-8, comma-separated, LF; header в первой строке; **без** специальных comment-строк.
- `training_label=TRAINING ONLY`, `dataset_version`, `currency=USD` — в каждой строке каждого CSV.
- Все поля `*_cents` — **целые центы**, без float и без локализованного форматирования: `18575` = **$185.75**. Знак в `expected_normal_balance_effect_cents` относится к увеличению/уменьшению **normal balance** указанного счёта, например `1000:+140000|1100:-140000`.
- `transaction_id` уникален в реестре событий, но закономерно повторяется в строках проводки, документах и двух сторонах банковского перевода. `entry_id`, `line_id`, `document_id`, invoice IDs устойчивы; строки журнала не являются самостоятельными событиями.
- `bank_posting_dates`: `account_code=YYYY-MM-DD`, разделитель `|`; оплата карты может иметь две разные даты проведения. Например `GVL-CARDPAY`: checking 2026-09-21, card 2026-09-22, book 2026-09-18.
- Opening entry записана 2026-09-01 с `entry_kind=opening`, документированное состояние — на конец 2026-08-31. Не включать её в доходы/расходы сентября.
- GL: `running_debit_minus_credit_cents` отрицателен у обычного кредитового остатка. BS: накопленная амортизация отрицательна внутри Assets. Credit Card Statement: обязательство положительно, charge увеличивает, payment/credit уменьшает.
- В отчётных CSV явно указаны period/as_of, Accrual, USD, version, formula, source и IDs. В reconciliation первичные источники — также отдельные выписки. `amount_cents` в итоговой строке — ожидаемый результат, а не дополнительная проводка.

## Ожидаемый общий результат

| Показатель | USD |
| --- | ---: |
| Opening Assets / Liabilities / Equity | $41,700 / $3,500 / $38,200 |
| September Revenue / Expenses / Net Income | $18,000 / $5,601 / $12,399 |
| Closing AR / AP | $6,500 / $1,540 |
| Book Operating / Savings / Card Payable | $16,909 / $10,500 / $1,270 |
| Closing Assets / Liabilities / Equity incl. September income | $53,409 / $2,810 / $50,599 |
| TB debit and credit balances | $65,510 each |
| TB / BS / three reconciliation differences | $0.00 each |

Формулы, раскрытие каждой суммы и машинно проверяемая контрольная таблица: [ANSWER_KEY.md](ANSWER_KEY.md). Cash Flow Statement намеренно не включён: это необязательный результат, не критерий CP-01B.

## Учебный цикл и границы

Контекст → цель → документы → действия в worksheet/разрешённой внешней учебной среде → проверяемый числовой результат → объяснение ошибки → повтор на другом документе этого же набора → сверка регистров. Это существующая концепция 1C Tutor; не новая модель уроков/runtime.

Нет изменений KZ routes, KZT/ru-KZ, schemas, progress, demo auth или screenshot verification. Нет parser contract для приложения, API, bank feeds, migrations, новых npm packages, SaaS, deploy или live QBO. Доступ/права на QBO относятся только к отдельно разрешённому CP-01C. **STOP after CP-01B.**
