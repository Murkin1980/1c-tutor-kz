import { describe, expect, it } from "vitest";
import {
  createCustomerCardSeed,
  CUSTOMER_CARD_EXPECTED,
  reduceCustomerCardState,
} from "./customerCardScenario";
import { verifyCustomerCardState } from "./customerCardVerification";
import { getCustomerCardGuidance } from "../guidance/customerCardGuidance";

describe("customer-card training scenario", () => {
  it("cannot pass without creating state in the workspace", () => {
    const state = createCustomerCardSeed();
    const result = verifyCustomerCardState(state);
    expect(result.passed).toBe(false);
    expect(result.assertions.every((item) => item.passed)).toBe(false);
  });

  it("passes only after the expected counterparty is saved", () => {
    let state = createCustomerCardSeed();
    state = reduceCustomerCardState(state, { type: "OPEN_SALES" });
    state = reduceCustomerCardState(state, { type: "OPEN_COUNTERPARTIES" });
    state = reduceCustomerCardState(state, { type: "CREATE_COUNTERPARTY" });
    state = reduceCustomerCardState(state, { type: "SET_NAME", value: CUSTOMER_CARD_EXPECTED.name });
    state = reduceCustomerCardState(state, { type: "SET_CITY", value: CUSTOMER_CARD_EXPECTED.city });

    expect(verifyCustomerCardState(state).passed).toBe(false);

    state = reduceCustomerCardState(state, { type: "SAVE_COUNTERPARTY" });
    const result = verifyCustomerCardState(state);
    expect(result.passed).toBe(true);
    expect(result.assertions.every((item) => item.passed)).toBe(true);
  });

  it("reports a field-level failure for wrong city", () => {
    let state = createCustomerCardSeed();
    state = reduceCustomerCardState(state, { type: "OPEN_SALES" });
    state = reduceCustomerCardState(state, { type: "OPEN_COUNTERPARTIES" });
    state = reduceCustomerCardState(state, { type: "CREATE_COUNTERPARTY" });
    state = reduceCustomerCardState(state, { type: "SET_NAME", value: CUSTOMER_CARD_EXPECTED.name });
    state = reduceCustomerCardState(state, { type: "SET_CITY", value: "Алматы" });
    state = reduceCustomerCardState(state, { type: "SAVE_COUNTERPARTY" });

    const result = verifyCustomerCardState(state);
    expect(result.passed).toBe(false);
    expect(result.assertions.find((item) => item.id === "counterparty.city")?.passed).toBe(false);
  });

  it("advances guidance from navigation to form fields by state", () => {
    let state = createCustomerCardSeed();
    expect(getCustomerCardGuidance(state)?.targetId).toBe("nav.sales");
    expect(getCustomerCardGuidance(state)?.hint1).toBe("Ищите раздел в меню учебной рабочей области.");
    state = reduceCustomerCardState(state, { type: "OPEN_SALES" });
    expect(getCustomerCardGuidance(state)?.targetId).toBe("sales.counterparties");
    state = reduceCustomerCardState(state, { type: "OPEN_COUNTERPARTIES" });
    expect(getCustomerCardGuidance(state)?.targetId).toBe("counterparties.create");
    state = reduceCustomerCardState(state, { type: "CREATE_COUNTERPARTY" });
    expect(getCustomerCardGuidance(state)?.targetId).toBe("counterparty.name");
  });

  it("reset returns deterministic seed state", () => {
    let state = createCustomerCardSeed();
    state = reduceCustomerCardState(state, { type: "OPEN_SALES" });
    state = reduceCustomerCardState(state, { type: "RESET" });
    expect(state).toEqual(createCustomerCardSeed());
  });
});
