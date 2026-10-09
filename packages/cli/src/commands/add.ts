import path from "node:path"
import { log, run, writeFile } from "../io.ts"
import { fileState, hash, lockFile, lockJson, readLock } from "../lock.ts"
import { Project, rewriteImports } from "../project.ts"
import { Registry, type RegistryItem } from "../registry.ts"

export interface AddOptions {
  cwd: string
  registry?: string
  install: boolean
  overwrite: boolean
}

export interface WritePlan {
  rel: string
  content: string
}

/** Where each file of a registry item goes in this project, with imports rewritten. */
export function planItem(project: Project, item: RegistryItem): WritePlan[] {
  const config = project.componentsJson()!
  if (item.type !== "registry:ui") return []
  const uiDir = project.aliasToPath(config.aliases.ui)
  return item.files.map((f) => ({
    rel: path.join(uiDir, path.basename(f.path)),
    content: f.path.endsWith(".tsx") ? rewriteImports(f.content, config.aliases) : f.content,
  }))
}

export async function add(names: string[], options: AddOptions): Promise<number> {
  const project = new Project(path.resolve(options.cwd))
  const registry = new Registry(options.registry)
  if (!project.componentsJson()) {
    log.error("No components.json found. Run npx blankui-cli init first.")
    return 1
  }
  if (names.length === 0) {
    log.error(
      `Name the components to add, for example: npx blankui-cli add button dialog. Available: ${(await registry.names()).join(", ")}`,
    )
    return 1
  }
  const wanted = names.includes("all") ? await registry.names() : names
  const items = await registry.resolve(wanted)
  const lock = readLock(project)
  const deps = new Set<string>()

  for (const item of items) {
    item.dependencies.forEach((d) => deps.add(d))
    for (const { rel, content } of planItem(project, item)) {
      const state = fileState(project, lock, rel)
      if (state !== "missing" && !options.overwrite) {
        log.skip(
          `${rel} already exists${state === "edited" ? " and has local changes" : ""}. Use --overwrite to replace it.`,
        )
        continue
      }
      writeFile(project, rel, content)
      lock.files[rel] = hash(content)
      log.ok(rel)
    }
  }
  writeFile(project, lockFile, lockJson(lock))

  const missing = [...deps].filter((d) => !project.hasDependency(d.replace(/@[^@/]*$/, "")))
  if (missing.length > 0) {
    const command = project.installCommand(missing)
    if (!options.install || !run(project, command))
      log.info(`\nInstall the dependencies:\n  ${command}`)
  }

  const added = items.filter((i) => i.type === "registry:ui" && wanted.includes(i.name))
  if (added.length > 0) {
    log.info(
      `\nAgents: read the .md file next to each component before using it (${added.map((i) => `${i.name}.md`).join(", ")}).`,
    )
  }
  return 0
}
