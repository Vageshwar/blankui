import { readdirSync } from "node:fs"
import path from "node:path"
import { hasBlock } from "../agents.ts"
import { log } from "../io.ts"
import { fileState, hash, readLock } from "../lock.ts"
import { Project } from "../project.ts"
import { Registry } from "../registry.ts"
import { planItem } from "./add.ts"

export interface DoctorOptions {
  cwd: string
  registry?: string
}

export interface Report {
  problems: string[]
  notes: string[]
}

/** BlankUI components in the project: .tsx files in the ui folder that start with the BlankUI header. */
export function installedComponents(project: Project): string[] {
  const config = project.componentsJson()
  if (!config) return []
  const uiDir = project.aliasToPath(config.aliases.ui)
  if (!project.exists(uiDir)) return []
  return readdirSync(project.file(uiDir))
    .filter(
      (f) => f.endsWith(".tsx") && project.read(path.join(uiDir, f)).startsWith("// BlankUI:"),
    )
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort()
}

export async function check(project: Project, registry: Registry): Promise<Report> {
  const problems: string[] = []
  const notes: string[] = []
  const config = project.componentsJson()
  if (!config) return { problems: ["No components.json. Run npx blankui init."], notes }

  const css = config.tailwind.css || project.mainCss()
  if (!css || !project.exists(css))
    problems.push("Main CSS file not found. Set tailwind.css in components.json.")
  else if (!project.read(css).includes("blankui.css"))
    problems.push(
      `${css} does not import blankui.css. Add @import "./blankui.css"; after @import "tailwindcss";`,
    )

  const agents = project.exists("AGENTS.md") ? project.read("AGENTS.md") : undefined
  if (!hasBlock(agents))
    problems.push("AGENTS.md has no BlankUI section. Run npx blankui init or npx blankui update.")
  else {
    const latest = (await registry.agentsBlock()).trim()
    if (!agents!.includes(latest))
      notes.push("The BlankUI section in AGENTS.md is out of date. Run npx blankui update.")
  }
  if (!project.exists("CLAUDE.md") || !/^@AGENTS\.md\s*$/m.test(project.read("CLAUDE.md"))) {
    notes.push(
      "CLAUDE.md does not import AGENTS.md, so Claude Code will not see the BlankUI rules. Add a line: @AGENTS.md",
    )
  }
  const eslint = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "eslint.config.cjs",
  ].find((f) => project.exists(f))
  if (!eslint || !project.read(eslint).includes("eslint-plugin-blankui"))
    problems.push(
      "The BlankUI ESLint plugin is not set up. See https://blank.vageshwar.dev/docs/lint",
    )

  const lock = readLock(project)
  for (const name of installedComponents(project)) {
    const item = await registry.item(name).catch(() => undefined)
    if (!item) {
      notes.push(`${name}: not in the registry.`)
      continue
    }
    for (const { rel, content } of planItem(project, item)) {
      const state = fileState(project, lock, rel)
      if (state === "missing")
        problems.push(`${rel} is missing. Run npx blankui add ${name} --overwrite.`)
      else if (state === "edited")
        problems.push(
          `${rel} was changed locally. Prefer adding a variant, and record why in the component's .md file.`,
        )
      else if (hash(project.read(rel)) !== hash(content)) {
        notes.push(`${rel}: a newer version is available. Run npx blankui update ${name}.`)
      }
    }
  }
  return { problems, notes }
}

export async function doctor(options: DoctorOptions): Promise<number> {
  const project = new Project(path.resolve(options.cwd))
  const { problems, notes } = await check(project, new Registry(options.registry))
  problems.forEach((p) => log.error(p))
  notes.forEach((n) => log.warn(n))
  if (problems.length === 0 && notes.length === 0) log.ok("BlankUI setup looks good.")
  return problems.length > 0 ? 1 : 0
}
