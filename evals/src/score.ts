import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, rmSync } from "node:fs"
import path from "node:path"
import { ESLint } from "eslint"
import tsParser from "@typescript-eslint/parser"
import { parse } from "@typescript-eslint/parser"
import type { TSESTree } from "@typescript-eslint/utils"
import blankui from "../../packages/eslint-plugin/src/index.ts"
import { screenPath, type Suite, type Task } from "./tasks.ts"

/** Lint rules measured on both suites. They count design-system drift, not BlankUI API usage. */
export const scoredRules = [
  "no-palette-colors",
  "no-arbitrary-values",
  "no-inline-color",
  "prefer-component",
  "prefer-layout-primitives",
] as const

export interface Score {
  task: string
  suite: Suite
  /** The agent wrote the screen file. */
  created: boolean
  typecheck: { pass: boolean; errors: number }
  lint: Record<(typeof scoredRules)[number], number>
  /** Share of the expected shared components that the screen renders (0 to 1). */
  intendedComponents: number
  missingComponents: string[]
  /** Share of expected BlankUI-only parts used. Only for the blankui suite. */
  blankuiParts?: number
  axe: { rendered: boolean; violations: number; ids: string[] }
}

/** JSX element names used in a file, for example ["Button", "Dialog", "div"]. */
export function jsxNames(source: string): Set<string> {
  const ast = parse(source, { jsx: true, range: false, loc: false })
  const names = new Set<string>()
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return
    const n = node as TSESTree.Node
    if (n.type === "JSXOpeningElement") {
      if (n.name.type === "JSXIdentifier") names.add(n.name.name)
      else if (n.name.type === "JSXMemberExpression" && n.name.object.type === "JSXIdentifier")
        names.add(n.name.object.name)
    }
    for (const [key, value] of Object.entries(n)) {
      if (key === "parent") continue
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === "object" && "type" in value) visit(value)
    }
  }
  visit(ast)
  return names
}

export async function lintCounts(source: string): Promise<Score["lint"]> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ["**/*.tsx"],
        languageOptions: { parser: tsParser },
        plugins: { blankui: blankui as unknown as ESLint.Plugin },
        rules: Object.fromEntries(scoredRules.map((r) => [`blankui/${r}`, "error"])),
      },
    ],
  })
  const [result] = await eslint.lintText(source, { filePath: "screen.tsx" })
  const counts = Object.fromEntries(scoredRules.map((r) => [r, 0])) as Score["lint"]
  for (const m of result?.messages ?? []) {
    const rule = m.ruleId?.replace("blankui/", "") as (typeof scoredRules)[number] | undefined
    if (rule && rule in counts) counts[rule]++
  }
  return counts
}

export function componentScore(names: Set<string>, expected: string[]) {
  const missing = expected.filter((c) => !names.has(c))
  return {
    share: expected.length ? (expected.length - missing.length) / expected.length : 1,
    missing,
  }
}

function typecheck(dir: string) {
  const result = spawnSync("npx", ["tsc", "--noEmit", "-p", "."], { cwd: dir, encoding: "utf8" })
  const errors = (result.stdout.match(/error TS\d+/g) ?? []).length
  return { pass: result.status === 0, errors }
}

function axe(dir: string, screen: string) {
  const out = path.join(dir, ".axe.json")
  rmSync(out, { force: true })
  spawnSync("npx", ["vitest", "run"], {
    cwd: dir,
    encoding: "utf8",
    env: { ...process.env, SCREEN: path.join(dir, screen), AXE_OUT: out },
  })
  if (!existsSync(out)) return { rendered: false, violations: 0, ids: [] }
  const data = JSON.parse(readFileSync(out, "utf8")) as {
    rendered: boolean
    violations: { id: string; nodes: number }[]
  }
  return {
    rendered: data.rendered,
    violations: data.violations.reduce((n, v) => n + v.nodes, 0),
    ids: data.violations.map((v) => v.id),
  }
}

/** Score one finished run folder. */
export async function scoreRun(dir: string, task: Task, suite: Suite): Promise<Score> {
  const file = path.join(dir, screenPath(task))
  const empty = Object.fromEntries(scoredRules.map((r) => [r, 0])) as Score["lint"]
  if (!existsSync(file)) {
    return {
      task: task.id,
      suite,
      created: false,
      typecheck: { pass: false, errors: 0 },
      lint: empty,
      intendedComponents: 0,
      missingComponents: task.expect.shared,
      axe: { rendered: false, violations: 0, ids: [] },
    }
  }
  const source = readFileSync(file, "utf8")
  const names = jsxNames(source)
  const shared = componentScore(names, task.expect.shared)
  const score: Score = {
    task: task.id,
    suite,
    created: true,
    typecheck: typecheck(dir),
    lint: await lintCounts(source),
    intendedComponents: shared.share,
    missingComponents: shared.missing,
    axe: axe(dir, screenPath(task)),
  }
  if (suite === "blankui") score.blankuiParts = componentScore(names, task.expect.blankuiOnly).share
  return score
}
