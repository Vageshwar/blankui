import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { z } from "zod"

export const evalsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const repoRoot = path.resolve(evalsRoot, "..")
export const workDir = path.join(evalsRoot, ".work")

/** Components both libraries have, so the comparison is fair. */
export const sharedComponents = [
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
] as const

export const taskSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  title: z.string().min(3),
  prompt: z.string().min(20),
  expect: z.object({
    /** Components the screen should use, from the shared list. */
    shared: z.array(z.enum(sharedComponents)).min(1),
    /** BlankUI-only parts (Field, Stack, Inline, Grid, Container). Scored for BlankUI runs only. */
    blankuiOnly: z.array(z.enum(["Field", "Stack", "Inline", "Grid", "Container"])),
  }),
})

export type Task = z.infer<typeof taskSchema>
/** blankui, shadcn/ui on Radix (what most training data shows), and shadcn/ui on Base UI (its current default). */
export type Suite = "blankui" | "shadcn" | "shadcn-base"
export const suites: Suite[] = ["blankui", "shadcn", "shadcn-base"]

export function loadTasks(dir = path.join(evalsRoot, "tasks")): Task[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const task = taskSchema.parse(JSON.parse(readFileSync(path.join(dir, f), "utf8")))
      if (`${task.id}.json` !== f) throw new Error(`${f}: id must match the file name`)
      return task
    })
}

export function screenPath(task: Task) {
  return `src/screens/${task.id}.tsx`
}

/** The same prompt goes to every agent and both suites. */
export function buildPrompt(task: Task): string {
  return [
    `You are working in a Vite app with React 19, TypeScript and Tailwind CSS v4. UI components are in src/components/ui.`,
    ``,
    `Task: ${task.title}. ${task.prompt}`,
    ``,
    `Write the screen in ${screenPath(task)} and export it as \`export default function Screen()\`.`,
    `Use the components that already exist in src/components/ui. Do not install packages. Only create or edit files in src/screens.`,
    `When you are done, make sure \`npx tsc --noEmit -p .\` passes.`,
  ].join("\n")
}
