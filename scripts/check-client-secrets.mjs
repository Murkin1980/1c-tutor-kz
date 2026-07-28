import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const forbidden = ["SUPABASE_SERVICE_ROLE_KEY", "AI_API_KEY", "service_role"];
const files = [];
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk("dist");
const violations = files.filter((file) =>
  forbidden.some((token) => readFileSync(file, "utf8").includes(token)),
);
if (violations.length) {
  console.error(`Forbidden server secret markers found: ${violations.join(", ")}`);
  process.exit(1);
}
console.log("Client bundle contains no forbidden server secret markers.");
