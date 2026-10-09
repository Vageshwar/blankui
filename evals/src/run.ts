// Runs agents on eval tasks and scores the results.
// Usage (from the repo root): pnpm eval:run --agent claude --suite blankui,shadcn --tasks login-form,invoice-table
import { spawnSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, symlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"
import { summarize, type RunResult } from "./report.ts"
import { scoreRun } from "./score.ts"
import { buildPrompt, evalsRoot, loadTasks, suites, workDir, type Suite } from "./tasks.ts"

const agents = {
  claude: (prompt: string) => [
    "claude",
    "-p",
    prompt,
    "--permission-mode",
    "acceptEdits",
    "--allowedTools",
    "Read,Edit,Write,Glob,Grep,Bash(npx tsc:*),Bash(npx eslint:*)",
    "--output-format",
    "json",
  ],
  codex: (prompt: string) => ["codex", "exec", "--full-auto", "--skip-git-repo-check", prompt],
} as const

type AgentName = keyof typeof agents

// pnpm passes a literal "--" when the user writes one, so drop it before parsing.
const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: {
    agent: { type: "string", default: "claude" },
    suite: { type: "string", default: "blankui,shadcn" },
    tasks: { type: "string", default: "all" },
    timeout: { type: "string", default: "600" },
  },
})

const agent = values.agent as AgentName
if (!(agent in agents))
  throw new Error(`Unknown agent "${agent}". Use: ${Object.keys(agents).join(", ")}`)
if (spawnSync(agent, ["--version"], { encoding: "utf8" }).error) {
  throw new Error(
    `The "${agent}" CLI is not installed or not on PATH. Install it and log in, then run again.`,
  )
}
const runSuites = (values.suite === "all" ? suites : values.suite!.split(",")) as Suite[]
for (const s of runSuites)
  if (!suites.includes(s)) throw new Error(`Unknown suite "${s}". Use: ${suites.join(", ")} or all`)
const allTasks = loadTasks()
const tasks =
  values.tasks === "all"
    ? allTasks
    : allTasks.filter((t) => values.tasks!.split(",").includes(t.id))

const id = new Date().toISOString().replace(/[:.]/g, "-")
const result: RunResult = { id, agent, startedAt: new Date().toISOString(), scores: [] }

for (const suite of runSuites) {
  const fixture = path.join(workDir, "fixtures", suite)
  if (!existsSync(path.join(fixture, "node_modules")))
    throw new Error(
      `Run "pnpm --filter @blankui/evals eval:setup" first (${suite} fixture missing).`,
    )
  for (const task of tasks) {
    const dir = path.join(workDir, "runs", id, suite, task.id)
    mkdirSync(path.dirname(dir), { recursive: true })
    cpSync(fixture, dir, {
      recursive: true,
      filter: (src) => !src.includes(`${path.sep}node_modules`),
    })
    symlinkSync(path.join(fixture, "node_modules"), path.join(dir, "node_modules"), "dir")

    const [cmd, ...args] = agents[agent](buildPrompt(task))
    console.log(`[${suite}] ${task.id}: running ${agent}...`)
    const started = Date.now()
    const run = spawnSync(cmd!, args, {
      cwd: dir,
      encoding: "utf8",
      timeout: Number(values.timeout) * 1000,
    })
    writeFileSync(path.join(dir, ".agent-output.txt"), `${run.stdout ?? ""}\n${run.stderr ?? ""}`)
    const seconds = Math.round((Date.now() - started) / 1000)

    const score = await scoreRun(dir, task, suite)
    result.scores.push({ ...score, seconds })
    console.log(
      `[${suite}] ${task.id}: tsc ${score.typecheck.pass ? "pass" : "fail"}, components ${Math.round(score.intendedComponents * 100)}%, axe ${score.axe.violations}`,
    )
  }
}

const out = path.join(evalsRoot, "results", id)
writeFileSync(`${out}.json`, `${JSON.stringify(result, null, 2)}\n`)
writeFileSync(`${out}.md`, summarize(result))
console.log(`\n${summarize(result)}\nSaved ${out}.json and ${out}.md`)
