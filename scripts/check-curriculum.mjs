import { readFileSync } from "node:fs";

const roadmap = readFileSync(
  "docs/curriculum/ACCOUNTING_KZ_CURRICULUM_ROADMAP.md",
  "utf8",
);
const ledger = readFileSync("docs/curriculum/LESSON_STATUS.md", "utf8");
const sessionPlan = readFileSync(
  "docs/curriculum/ACCOUNTING_KZ_SESSION_PLAN.md",
  "utf8",
);
const lessonPattern = /AKZ-M\d{2}-L\d{2}/g;

const roadmapIds = [...new Set(roadmap.match(lessonPattern) ?? [])].sort();
const ledgerRows = ledger
  .split(/\r?\n/)
  .filter((line) => /^\| AKZ-M\d{2}-L\d{2} \|/.test(line));
const ledgerIds = ledgerRows
  .map((line) => line.match(lessonPattern)?.[0])
  .filter(Boolean)
  .sort();
const uniqueLedgerIds = [...new Set(ledgerIds)];
const sessionTableLines = sessionPlan
  .split(/\r?\n/)
  .filter((line) => /^\| \d{2} \|/.test(line));
const sessionIds = sessionTableLines.flatMap(
  (line) => line.match(lessonPattern) ?? [],
);
const uniqueSessionIds = [...new Set(sessionIds)].sort();
const moduleHeadings = [
  ...roadmap.matchAll(/^### M(\d{2}) .* — (\d+) lessons$/gm),
].map(([, moduleId, declaredCount]) => ({
  moduleId,
  declaredCount: Number(declaredCount),
}));

const missing = roadmapIds.filter((id) => !uniqueLedgerIds.includes(id));
const extra = uniqueLedgerIds.filter((id) => !roadmapIds.includes(id));
const problems = [];

if (roadmapIds.length !== 77)
  problems.push(
    `roadmap has ${roadmapIds.length} unique lesson IDs instead of 77`,
  );
if (!roadmap.includes("15 sections / 77 lessons"))
  problems.push("roadmap summary does not declare 15 sections / 77 lessons");
if (moduleHeadings.length !== 15)
  problems.push(
    `roadmap has ${moduleHeadings.length} module headings instead of 15`,
  );
for (const { moduleId, declaredCount } of moduleHeadings) {
  const actualCount = roadmapIds.filter((id) =>
    id.startsWith(`AKZ-M${moduleId}-`),
  ).length;
  if (actualCount !== declaredCount)
    problems.push(
      `M${moduleId} declares ${declaredCount} lessons but contains ${actualCount} unique IDs`,
    );
}
if (ledgerIds.length !== uniqueLedgerIds.length)
  problems.push("lesson ledger contains duplicate ID rows");
if (missing.length) problems.push(`missing from ledger: ${missing.join(", ")}`);
if (extra.length) problems.push(`not present in roadmap: ${extra.join(", ")}`);
if (sessionTableLines.length !== 29)
  problems.push(
    `session plan has ${sessionTableLines.length} learner sessions instead of 29`,
  );
if (sessionIds.length !== uniqueSessionIds.length)
  problems.push("session plan maps one or more lesson IDs more than once");
const missingFromSessions = roadmapIds.filter(
  (id) => !uniqueSessionIds.includes(id),
);
const extraInSessions = uniqueSessionIds.filter(
  (id) => !roadmapIds.includes(id),
);
if (missingFromSessions.length)
  problems.push(
    `missing from session plan: ${missingFromSessions.join(", ")}`,
  );
if (extraInSessions.length)
  problems.push(`unknown in session plan: ${extraInSessions.join(", ")}`);
if (!ledger.includes("Current lesson: `AKZ-M03-L01`"))
  problems.push("current lesson marker is missing or unexpected");
if (!ledger.includes("Current gate: `OWNER_REVIEW_PENDING`"))
  problems.push("current owner gate marker is missing or unexpected");
if (!/^\| AKZ-M03-L01 \| Customer card \| OWNER_REVIEW \|/m.test(ledger))
  problems.push("current lesson row does not match the owner-review gate");
if (!ledger.includes("## Active resume record — AKZ-M03-L01"))
  problems.push("active lesson resume record is missing");

if (problems.length) {
  console.error(`Curriculum check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Curriculum roadmap, ledger and ${sessionTableLines.length}-session learner plan agree: ${roadmapIds.length} skill units, no duplicate or missing IDs.`,
);
