import { describe, expect, it } from "vitest";
import { verifyAnswer } from "./verify";

describe("number verification", () => {
  const verification = { type: "number", prompt: "Сумма?", expected: 245000, tolerance: 0.01, unit: "KZT" } as const;
  it("accepts normalized numeric input within tolerance", () => {
    expect(verifyAnswer(verification, "245 000,01")).toBe(true);
  });
  it("rejects an answer outside tolerance", () => {
    expect(verifyAnswer(verification, "244999")).toBe(false);
  });
});
