import type { CustomerCardTrainingState } from "../domain/customerCardScenario";
import { CUSTOMER_CARD_EXPECTED } from "../domain/customerCardScenario";

export interface GuidanceStep {
  id: string;
  targetId: string;
  instruction: string;
  why: string;
  hint1: string;
  hint2: string;
}

export function getCustomerCardGuidance(
  state: CustomerCardTrainingState,
): GuidanceStep | null {
  if (state.screen === "home") {
    return {
      id: "open-sales",
      targetId: "nav.sales",
      instruction: "Откройте раздел «Продажи».",
      why: "Здесь собраны операции и справочники, связанные с покупателями.",
      hint1: "Ищите раздел в левой панели учебной рабочей области.",
      hint2: "Нажмите кнопку «Продажи».",
    };
  }

  if (state.screen === "sales") {
    return {
      id: "open-counterparties",
      targetId: "sales.counterparties",
      instruction: "Откройте список контрагентов.",
      why: "Карточка покупателя хранится в справочнике контрагентов и затем используется в документах продаж.",
      hint1: "На стартовой странице раздела есть команда перехода к справочнику.",
      hint2: "Нажмите «Контрагенты».",
    };
  }

  if (state.screen === "counterparties") {
    const expectedExists = state.counterparties.some(
      (item) =>
        item.name === CUSTOMER_CARD_EXPECTED.name &&
        item.city === CUSTOMER_CARD_EXPECTED.city &&
        item.saved,
    );
    if (expectedExists) return null;
    return {
      id: "create-counterparty",
      targetId: "counterparties.create",
      instruction: "Создайте новую карточку контрагента.",
      why: "Покупатель должен существовать в справочнике до использования в счёте и других документах.",
      hint1: "Ищите основную команду над списком.",
      hint2: "Нажмите «Создать».",
    };
  }

  if (state.screen === "counterparty-form" && state.draft.name !== CUSTOMER_CARD_EXPECTED.name) {
    return {
      id: "fill-name",
      targetId: "counterparty.name",
      instruction: `Введите название «${CUSTOMER_CARD_EXPECTED.name}».`,
      why: "Название позволяет однозначно выбрать учебного покупателя в следующих операциях.",
      hint1: "Используйте данные из карточки задания справа.",
      hint2: `Точное значение: ${CUSTOMER_CARD_EXPECTED.name}`,
    };
  }

  if (state.screen === "counterparty-form" && state.draft.city !== CUSTOMER_CARD_EXPECTED.city) {
    return {
      id: "fill-city",
      targetId: "counterparty.city",
      instruction: `Укажите город «${CUSTOMER_CARD_EXPECTED.city}».`,
      why: "Дополнительный реквизит делает проверку состояния содержательной, а не просто проверкой названия.",
      hint1: "Город указан в исходных данных задания.",
      hint2: `Точное значение: ${CUSTOMER_CARD_EXPECTED.city}`,
    };
  }

  if (state.screen === "counterparty-form") {
    return {
      id: "save-counterparty",
      targetId: "counterparty.save",
      instruction: "Сохраните карточку.",
      why: "Введённые в форму данные ещё не являются завершённой операцией, пока объект не сохранён.",
      hint1: "Ищите основную команду формы.",
      hint2: "Нажмите «Сохранить и закрыть».",
    };
  }

  return null;
}
