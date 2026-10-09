import { describe, expect, it } from "vitest"
import { summarize, type RunResult } from "../src/report.ts"
import { componentScore, jsxNames, lintCounts, type Score } from "../src/score.ts"
import { buildPrompt, loadTasks } from "../src/tasks.ts"

describe("tasks", () => {
  const tasks = loadTasks()

  it("has 20 valid tasks with unique ids", () => {
    expect(tasks).toHaveLength(20)
    expect(new Set(tasks.map((t) => t.id)).size).toBe(20)
  })

  it("covers every shared component at least once", () => {
    const used = new Set(tasks.flatMap((t) => t.expect.shared))
    for (const c of [
      "Button",
      "Input",
      "Textarea",
      "Checkbox",
      "Select",
      "Dialog",
      "AlertDialog",
      "Sheet",
      "Popover",
      "Tooltip",
      "Card",
      "Table",
      "Tabs",
    ]) {
      expect(used.has(c as never), c).toBe(true)
    }
  })

  it("gives every agent the same prompt with the screen path", () => {
    const prompt = buildPrompt(tasks[0]!)
    expect(prompt).toContain(`src/screens/${tasks[0]!.id}.tsx`)
    expect(prompt).toContain("export default function Screen()")
    expect(prompt).not.toMatch(/blankui|shadcn/i)
  })
})

const goodScreen = `
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
export default function Screen() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Edit</Button></DialogTrigger>
      <DialogContent title="Edit"><Field label="Name"><Input /></Field></DialogContent>
    </Dialog>
  )
}`

const driftScreen = `
export default function Screen() {
  return (
    <div className="flex flex-col gap-4 bg-blue-500 mt-[13px]" style={{ color: "red" }}>
      <button>Save</button>
      <input type="text" />
    </div>
  )
}`

describe("scoring", () => {
  it("finds the JSX components a screen uses", () => {
    const names = jsxNames(goodScreen)
    expect([...names]).toEqual(
      expect.arrayContaining(["Dialog", "DialogContent", "Button", "Field", "Input"]),
    )
    expect(componentScore(names, ["Dialog", "Input", "Select"])).toEqual({
      share: 2 / 3,
      missing: ["Select"],
    })
  })

  it("counts design-system drift per rule", async () => {
    expect(await lintCounts(goodScreen)).toEqual({
      "no-palette-colors": 0,
      "no-arbitrary-values": 0,
      "no-inline-color": 0,
      "prefer-component": 0,
      "prefer-layout-primitives": 0,
    })
    expect(await lintCounts(driftScreen)).toEqual({
      "no-palette-colors": 1,
      "no-arbitrary-values": 1,
      "no-inline-color": 1,
      "prefer-component": 2,
      "prefer-layout-primitives": 1,
    })
  })
})

describe("report", () => {
  it("summarizes suites side by side", () => {
    const base: Score & { seconds: number } = {
      task: "login-form",
      suite: "blankui",
      created: true,
      typecheck: { pass: true, errors: 0 },
      lint: {
        "no-palette-colors": 0,
        "no-arbitrary-values": 0,
        "no-inline-color": 0,
        "prefer-component": 0,
        "prefer-layout-primitives": 2,
      },
      intendedComponents: 1,
      missingComponents: [],
      axe: { rendered: true, violations: 0, ids: [] },
      seconds: 40,
    }
    const run: RunResult = {
      id: "test",
      agent: "claude",
      startedAt: "2026-10-09T00:00:00Z",
      scores: [
        base,
        {
          ...base,
          suite: "shadcn",
          typecheck: { pass: false, errors: 2 },
          lint: { ...base.lint, "prefer-component": 3 },
          intendedComponents: 0.5,
          missingComponents: ["Checkbox"],
        },
      ],
    }
    const md = summarize(run)
    expect(md).toContain("| Metric | blankui | shadcn |")
    expect(md).toContain("| TypeScript passes | 100% | 0% |")
    expect(md).toContain("| Design-system lint issues per screen | 0.0 | 3.0 |")
    expect(md).toContain("| login-form | shadcn | fail | 50% | 3 | 0 | Checkbox |")
  })
})
