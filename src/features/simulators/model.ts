import { z } from "zod";

export const portalTypeSchema = z.enum(["KNP", "ISNA", "IS_ESF"]);
export const trainingDocumentStatusSchema = z.enum([
  "draft",
  "validated",
  "ready_for_training_signature",
  "training_submitted",
  "training_accepted",
  "training_rejected",
]);

export const officialPortalVersionSchema = z.object({
  portal: portalTypeSchema,
  sourceUrl: z.string().url().startsWith("https://"),
  observedAt: z.iso.date(),
  interfaceVersion: z.string().min(1),
  viewport: z.string().regex(/^\d+x\d+$/),
  browserZoom: z.literal("100%"),
  methodicalStatus: z.enum(["draft", "reviewed", "approved"]),
});

export const portalElementSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["navigation", "field", "button", "table", "status", "message"]),
  label: z.string().min(1),
  required: z.boolean().default(false),
  trainingDifference: z.string().min(1),
});

export const portalScreenSchema = z.object({
  id: z.string().min(1),
  version: officialPortalVersionSchema,
  title: z.string().min(1),
  elements: z.array(portalElementSchema),
});

export const simulationActionSchema = z.enum([
  "navigate",
  "edit",
  "save",
  "validate",
  "training_sign",
  "training_submit",
]);

export const simulationStepSchema = z.object({
  id: z.string().min(1),
  screenId: z.string().min(1),
  action: simulationActionSchema,
  instruction: z.string().min(1),
});

export const simulationScenarioSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["fno", "esf"]),
  title: z.string().min(1),
  portalVersion: officialPortalVersionSchema,
  steps: z.array(simulationStepSchema).min(1),
});

export const validationRuleSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("required"), field: z.string().min(1), message: z.string().min(1) }),
  z.object({ type: z.literal("identifier_safety"), field: z.string().min(1), message: z.string().min(1) }),
  z.object({ type: z.literal("format"), field: z.string().min(1), pattern: z.string().min(1), message: z.string().min(1) }),
]);

export const simulationSubmissionSchema = z.object({
  scenarioId: z.string().min(1),
  status: trainingDocumentStatusSchema,
  answers: z.record(z.string(), z.unknown()),
  occurredAt: z.iso.datetime(),
});

export type OfficialPortalVersion = z.infer<typeof officialPortalVersionSchema>;
export type PortalScreen = z.infer<typeof portalScreenSchema>;
export type PortalElement = z.infer<typeof portalElementSchema>;
export type SimulationScenario = z.infer<typeof simulationScenarioSchema>;
export type SimulationStep = z.infer<typeof simulationStepSchema>;
export type SimulationAction = z.infer<typeof simulationActionSchema>;
export type ValidationRule = z.infer<typeof validationRuleSchema>;
export type SimulationSubmission = z.infer<typeof simulationSubmissionSchema>;
export type TrainingDocumentStatus = z.infer<typeof trainingDocumentStatusSchema>;

export interface SimulationRepository {
  listScenarios(): Promise<SimulationScenario[]>;
  getScenario(id: string): Promise<SimulationScenario | null>;
}
