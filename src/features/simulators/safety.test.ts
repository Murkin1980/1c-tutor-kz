import { describe, expect, it } from "vitest";
import { officialPortalVersionSchema, validationRuleSchema } from "./model";
import { assertTrainingIdentifier, isSimulationNetworkAllowed } from "./safety";

describe("simulator safety", () => {
  it("rejects identifier-shaped real values", () => {
    expect(() => assertTrainingIdentifier("123456789012")).toThrow(/запрещён/);
    expect(assertTrainingIdentifier("TRAINING-OWNER")).toBe("TRAINING-OWNER");
  });

  it("blocks government and external network targets", () => {
    expect(isSimulationNetworkAllowed("/training-events", "https://tutor.example")).toBe(true);
    expect(isSimulationNetworkAllowed("https://esf.gov.kz/send", "https://tutor.example")).toBe(false);
    expect(isSimulationNetworkAllowed("https://tracker.example/send", "https://tutor.example")).toBe(false);
  });

  it("rejects unknown portal versions and malformed rules", () => {
    expect(officialPortalVersionSchema.safeParse({
      portal: "UNKNOWN",
      sourceUrl: "https://example.test",
      observedAt: "2026-07-31",
      interfaceVersion: "draft",
      viewport: "1440x900",
      browserZoom: "100%",
      methodicalStatus: "draft",
    }).success).toBe(false);
    expect(validationRuleSchema.safeParse({ type: "format", field: "period" }).success).toBe(false);
  });
});
