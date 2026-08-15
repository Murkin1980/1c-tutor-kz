# DATA MODEL — 1C Tutor KZ

Обновлено: 2026-08-15.

## 1. Принцип

Практическая истина хранится в состоянии Training Workspace, а не в ответе на вопрос.

Теоретические `Verification`/`Submission` могут существовать отдельно, но не могут доказывать выполнение бухгалтерской операции.

## 2. Domain entities Stage 1B

```ts
type TrainingCounterparty = {
  id: string;
  name: string;
  city?: string;
  isSaved: boolean;
};

type TrainingInvoiceLine = {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
};

type TrainingInvoice = {
  id: string;
  counterpartyId: string;
  lines: TrainingInvoiceLine[];
  status: 'draft' | 'saved';
};

type TrainingPayment = {
  id: string;
  counterpartyId: string;
  invoiceId?: string;
  amount: number;
  status: 'draft' | 'registered';
};

type TrainingScenarioState = {
  scenarioId: string;
  seedVersion: number;
  counterparties: TrainingCounterparty[];
  invoices: TrainingInvoice[];
  payments: TrainingPayment[];
};
```

В первом вертикальном срезе реализуется только `TrainingCounterparty` + минимальный `TrainingScenarioState`.

## 3. Scenario definition

```ts
type TrainingScenario = {
  id: string;
  version: number;
  title: string;
  objective: string;
  businessContext: string;
  sourceData: Record<string, string>;
  interfacePassportId: string;
  seed: TrainingScenarioState;
  capabilities: string[];
  demo: GuidanceStep[];
  guided: GuidanceStep[];
  testTask: string;
  assertions: StateAssertion[];
  hints: HintDefinition[];
};
```

## 4. Guidance model

```ts
type GuidanceStep = {
  id: string;
  targetId: string;
  instruction: string;
  why?: string;
  hint1?: string;
  hint2?: string;
  advanceCondition: string;
  recoveryCondition?: string;
  allowShowAction?: boolean;
};
```

`advanceCondition` представляет именованную детерминированную проверку, а не произвольный код из контента.

## 5. Verification v2

```ts
type StateAssertion = {
  id: string;
  label: string;
  evaluator: string;
  params?: Record<string, unknown>;
  failureMessage: string;
};

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

Пример для контрагента:
- `counterparty.exists`;
- `counterparty.name_equals`;
- `counterparty.city_equals`;
- `counterparty.saved`.

## 6. Progress model

```ts
type ScenarioProgress = {
  scenarioId: string;
  scenarioVersion: number;
  mode: 'demo' | 'guided' | 'test';
  status: 'not_started' | 'in_progress' | 'completed_assisted' | 'completed_unassisted';
  currentGuidanceStep?: string;
  hintsUsed: number;
  showActionsUsed: number;
  resetCount: number;
  attemptCount: number;
  lastVerification?: PracticalVerificationResult;
  startedAt?: string;
  completedAt?: string;
};
```

## 7. Training action events

Минимальный диагностический event:

```ts
type TrainingActionEvent = {
  scenarioId: string;
  action: string;
  targetId?: string;
  timestamp: string;
};
```

Не помещать в telemetry реальные реквизиты или чувствительные значения полей.

## 8. Persistence

Stage 1B:
- domain state: локальный repository adapter;
- progress: существующая browser repository abstraction;
- scenario definitions: TypeScript/JSON content in repo.

Позже адаптеры могут быть заменены серверными, не меняя domain/verification API.

## 9. Legacy types

Существующие типы `self_confirm`, `single_choice`, `multiple_choice`, `text_exact`, `number`, `sequence`, `screenshot_manual` считать `KnowledgeVerification`.

Они разрешены для теории/рефлексии. Они не должны устанавливать `completed_*` для practical scenario без успешного `PracticalVerificationResult`.

Поле `external_app_url` считается legacy и должно быть удалено из обязательной модели практического урока. Если позднее появится transfer-to-real-1C stage, ссылка хранится в отдельной сущности/конфигурации этого этапа.

## 10. Будущая серверная схема

Когда MPE разрешит server persistence, сервер хранит scenario progress и analytics, но не превращается в бухгалтерскую базу. Seed training state может синхронизироваться как учебное состояние пользователя, однако реальные бухгалтерские документы запрещены.