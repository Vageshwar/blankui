import type { Score } from "./score.ts"
import { scoredRules } from "./score.ts"
import type { Suite } from "./tasks.ts"

export interface RunResult {
  id: string
  agent: string
  startedAt: string
  scores: (Score & { seconds: number })[]
}

const pct = (n: number) => `${Math.round(n * 100)}%`
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** A Markdown summary with one column per suite. */
export function summarize(run: RunResult): string {
  const suites = [...new Set(run.scores.map((s) => s.suite))] as Suite[]
  const by = (suite: Suite) => run.scores.filter((s) => s.suite === suite)
  const row = (label: string, f: (xs: RunResult["scores"]) => string) =>
    `| ${label} | ${suites.map((s) => f(by(s))).join(" | ")} |`
  // Layout classes are normal in shadcn projects, so they are shown on their own row and left out of the total.
  const totalRules = scoredRules.filter((r) => r !== "prefer-layout-primitives")
  const lintTotal = (s: Score) => totalRules.reduce((n, r) => n + s.lint[r], 0)

  const lines = [
    `# Eval run ${run.id}`,
    "",
    `Agent: ${run.agent}. Started ${run.startedAt}. ${run.scores.length} task runs.`,
    "",
    `| Metric | ${suites.join(" | ")} |`,
    `| --- | ${suites.map(() => "---").join(" | ")} |`,
    row("Tasks", (xs) => String(xs.length)),
    row("Screen file created", (xs) => pct(avg(xs.map((s) => (s.created ? 1 : 0))))),
    row("TypeScript passes", (xs) => pct(avg(xs.map((s) => (s.typecheck.pass ? 1 : 0))))),
    row("Intended components used", (xs) => pct(avg(xs.map((s) => s.intendedComponents)))),
    row("Design-system lint issues per screen", (xs) => avg(xs.map(lintTotal)).toFixed(1)),
    ...scoredRules.map((r) => row(`  ${r}`, (xs) => avg(xs.map((s) => s.lint[r])).toFixed(1))),
    row("Rendered without crashing", (xs) => pct(avg(xs.map((s) => (s.axe.rendered ? 1 : 0))))),
    row("axe violations per screen", (xs) => avg(xs.map((s) => s.axe.violations)).toFixed(1)),
    row("Seconds per task", (xs) => avg(xs.map((s) => s.seconds)).toFixed(0)),
    "",
    "## Per task",
    "",
    "| Task | Suite | tsc | Components | Lint issues | axe | Missing |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...run.scores.map(
      (s) =>
        `| ${s.task} | ${s.suite} | ${s.typecheck.pass ? "pass" : "fail"} | ${pct(s.intendedComponents)} | ${lintTotal(s)} | ${s.axe.rendered ? s.axe.violations : "crash"} | ${s.missingComponents.join(", ")} |`,
    ),
    "",
    "Lint issues use the BlankUI rules on both suites: palette colors, arbitrary values, inline colors and raw elements where a component exists. These measure drift from a token-based design system, which applies to shadcn projects too. `prefer-layout-primitives` is shown separately and not counted in the total, because flex and gap classes are normal shadcn style.",
    "",
  ]
  return lines.join("\n")
}
