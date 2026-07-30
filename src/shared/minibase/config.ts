import { z } from "zod";

const miniBaseEnvSchema = z.object({
  VITE_MINIBASE_URL: z.string().url().optional(),
  VITE_MINIBASE_PUBLISHABLE_KEY: z.string().startsWith("mb_publishable_").optional(),
}).superRefine((value, context) => {
  const configuredValues = [value.VITE_MINIBASE_URL, value.VITE_MINIBASE_PUBLISHABLE_KEY]
    .filter(Boolean).length;
  if (configuredValues === 1) {
    context.addIssue({
      code: "custom",
      message: "MiniBase URL and publishable key must be configured together",
    });
  }
});

export type MiniBaseRuntimeConfig =
  | { mode: "local"; reason: "not_configured" | "invalid_configuration" }
  | { mode: "remote"; baseUrl: string; publishableKey: string };

export function getMiniBaseConfig(
  env: Record<string, string | boolean | undefined> = import.meta.env,
): MiniBaseRuntimeConfig {
  const result = miniBaseEnvSchema.safeParse(env);
  if (!result.success) return { mode: "local", reason: "invalid_configuration" };
  if (!result.data.VITE_MINIBASE_URL || !result.data.VITE_MINIBASE_PUBLISHABLE_KEY) {
    return { mode: "local", reason: "not_configured" };
  }
  return {
    mode: "remote",
    baseUrl: result.data.VITE_MINIBASE_URL,
    publishableKey: result.data.VITE_MINIBASE_PUBLISHABLE_KEY,
  };
}

export const miniBaseConfig = getMiniBaseConfig();
