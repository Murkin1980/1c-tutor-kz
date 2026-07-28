import type { Verification } from "../../entities/course";

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru-KZ");
export function verifyAnswer(verification: Verification, answer: unknown): boolean {
  switch (verification.type) {
    case "self_confirm": return answer === true;
    case "single_choice": return answer === verification.expected;
    case "multiple_choice":
      return Array.isArray(answer) && [...answer].sort().join("|") === [...verification.expected].sort().join("|");
    case "text_exact": return typeof answer === "string" && normalize(answer) === normalize(verification.expected);
    case "number": {
      const parsed = typeof answer === "number" ? answer : Number(String(answer).replace(/\s/g, "").replace(",", "."));
      return Number.isFinite(parsed) && Math.abs(parsed - verification.expected) <= verification.tolerance + Number.EPSILON * Math.abs(verification.expected);
    }
    case "sequence": return Array.isArray(answer) && answer.join("|") === verification.expected.join("|");
    case "screenshot_manual": return answer instanceof File;
  }
}
