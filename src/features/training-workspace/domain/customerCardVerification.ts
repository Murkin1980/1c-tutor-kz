import type { CustomerCardTrainingState } from "./customerCardScenario";
import { CUSTOMER_CARD_EXPECTED } from "./customerCardScenario";

export interface AssertionResult {
  id: string;
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  hint: string;
}

export interface PracticalVerificationResult {
  passed: boolean;
  assertions: AssertionResult[];
}

export function verifyCustomerCardState(
  state: CustomerCardTrainingState,
): PracticalVerificationResult {
  const saved = state.counterparties.find(
    (item) => item.name === CUSTOMER_CARD_EXPECTED.name,
  );

  const assertions: AssertionResult[] = [
    {
      id: "counterparty.exists",
      label: "Контрагент создан",
      passed: Boolean(saved),
      expected: CUSTOMER_CARD_EXPECTED.name,
      actual: saved?.name ?? "Не найден",
      hint: "Создайте карточку покупателя и сохраните её.",
    },
    {
      id: "counterparty.name",
      label: "Название покупателя",
      passed: saved?.name === CUSTOMER_CARD_EXPECTED.name,
      expected: CUSTOMER_CARD_EXPECTED.name,
      actual: saved?.name ?? "Нет сохранённой карточки",
      hint: "Проверьте поле названия перед сохранением.",
    },
    {
      id: "counterparty.city",
      label: "Город",
      passed: saved?.city === CUSTOMER_CARD_EXPECTED.city,
      expected: CUSTOMER_CARD_EXPECTED.city,
      actual: saved?.city ?? "Нет сохранённой карточки",
      hint: "Используйте город из исходных данных задания.",
    },
    {
      id: "counterparty.saved",
      label: "Карточка сохранена",
      passed: saved?.saved === true,
      expected: "Сохранена",
      actual: saved?.saved ? "Сохранена" : "Не сохранена",
      hint: "Нажмите «Сохранить и закрыть» в учебной форме.",
    },
  ];

  return {
    passed: assertions.every((assertion) => assertion.passed),
    assertions,
  };
}
