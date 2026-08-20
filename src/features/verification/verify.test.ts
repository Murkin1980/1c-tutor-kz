import { describe, expect, it } from "vitest";
import { verifyAnswer } from "./verify";

describe("number verification", () => {
  const verification = {
    type: "number",
    prompt: "Сумма?",
    expected: 245000,
    tolerance: 0.01,
    unit: "KZT",
  } as const;
  it("accepts normalized numeric input within tolerance", () => {
    expect(verifyAnswer(verification, "245 000,01")).toBe(true);
  });
  it("rejects an answer outside tolerance", () => {
    expect(verifyAnswer(verification, "244999")).toBe(false);
  });
  it.each(["", "не число", Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid numeric input %s",
    (answer) => {
      expect(verifyAnswer(verification, answer)).toBe(false);
    },
  );
  it("accepts a negative expected value", () => {
    expect(verifyAnswer({ ...verification, expected: -10 }, "-10")).toBe(true);
  });
  it("rejects an empty answer even when zero is expected", () => {
    expect(verifyAnswer({ ...verification, expected: 0 }, "")).toBe(false);
  });
});

describe("collection verification", () => {
  it("rejects an empty multiple choice answer when choices are expected", () => {
    expect(
      verifyAnswer(
        {
          type: "multiple_choice",
          prompt: "Выберите",
          options: ["A"],
          expected: ["A"],
        },
        [],
      ),
    ).toBe(false);
  });
  it("accepts multiple choices regardless of selection order", () => {
    expect(
      verifyAnswer(
        {
          type: "multiple_choice",
          prompt: "Выберите",
          options: ["A", "B"],
          expected: ["A", "B"],
        },
        ["B", "A"],
      ),
    ).toBe(true);
  });
  it("rejects an empty sequence when items are expected", () => {
    expect(
      verifyAnswer(
        { type: "sequence", prompt: "Порядок", items: ["A"], expected: ["A"] },
        [],
      ),
    ).toBe(false);
  });
  it("requires exact sequence order", () => {
    expect(
      verifyAnswer(
        {
          type: "sequence",
          prompt: "Порядок",
          items: ["A", "B"],
          expected: ["A", "B"],
        },
        ["B", "A"],
      ),
    ).toBe(false);
  });
});
