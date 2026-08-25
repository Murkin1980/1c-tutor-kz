export type TrainingMode = "demo" | "guided" | "test";

export type CustomerWorkspaceScreen =
  | "home"
  | "sales"
  | "counterparties"
  | "counterparty-form";

export interface TrainingCounterparty {
  id: string;
  name: string;
  city: string;
  saved: boolean;
}

export interface CustomerCardTrainingState {
  screen: CustomerWorkspaceScreen;
  draft: {
    name: string;
    city: string;
  };
  counterparties: TrainingCounterparty[];
  actionLog: string[];
}

export const CUSTOMER_CARD_EXPECTED = {
  name: "ТОО Учебный Покупатель",
  city: "Кызылорда",
} as const;

export const createCustomerCardSeed = (): CustomerCardTrainingState => ({
  screen: "home",
  draft: { name: "", city: "" },
  counterparties: [],
  actionLog: [],
});

export type CustomerCardCommand =
  | { type: "OPEN_SALES" }
  | { type: "OPEN_COUNTERPARTIES" }
  | { type: "CREATE_COUNTERPARTY" }
  | { type: "SET_NAME"; value: string }
  | { type: "SET_CITY"; value: string }
  | { type: "SAVE_COUNTERPARTY" }
  | { type: "RESET" };

export function reduceCustomerCardState(
  state: CustomerCardTrainingState,
  command: CustomerCardCommand,
): CustomerCardTrainingState {
  const log = (event: string) => [...state.actionLog, event];

  switch (command.type) {
    case "OPEN_SALES":
      return { ...state, screen: "sales", actionLog: log("nav.sales") };
    case "OPEN_COUNTERPARTIES":
      return { ...state, screen: "counterparties", actionLog: log("counterparties.open") };
    case "CREATE_COUNTERPARTY":
      return {
        ...state,
        screen: "counterparty-form",
        draft: { name: "", city: "" },
        actionLog: log("counterparties.create"),
      };
    case "SET_NAME":
      return {
        ...state,
        draft: { ...state.draft, name: command.value },
        actionLog: log("counterparty.name.changed"),
      };
    case "SET_CITY":
      return {
        ...state,
        draft: { ...state.draft, city: command.value },
        actionLog: log("counterparty.city.changed"),
      };
    case "SAVE_COUNTERPARTY": {
      if (!state.draft.name.trim() || !state.draft.city.trim()) return state;
      const saved: TrainingCounterparty = {
        id: `training-counterparty-${state.counterparties.length + 1}`,
        name: state.draft.name.trim(),
        city: state.draft.city.trim(),
        saved: true,
      };
      return {
        ...state,
        screen: "counterparties",
        counterparties: [...state.counterparties, saved],
        actionLog: log("counterparty.saved"),
      };
    }
    case "RESET":
      return createCustomerCardSeed();
  }
}
