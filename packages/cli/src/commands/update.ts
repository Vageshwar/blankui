import path from "node:path"
import { upsertBlock } from "../agents.ts"
import { log, writeFile } from "../io.ts"
import { fileState, hash, lockFile, lockJson, readLock } from "../lock.ts"
import { Project } from "../project.ts"
import { Registry } from "../registry.ts"
import { planItem } from "./add.ts"
import { installedComponents } from "./doctor.ts"

export interface UpdateOptions {
  cwd: string
  registry?: string
  force: boolean
}

export async function update(names: string[], options: UpdateOptions): Promise<number> {
  const project = new Project(path.resolve(options.cwd))
  const registry = new Registry(options.registry)
  if (!project.componentsJson()) {
    log.error("No components.json found. Run npx blankui-cli init first.")
    return 1
  }
  const lock = readLock(project)
  const targets = names.length > 0 ? names : installedComponents(project)
  let skipped = 0

  for (const name of targets) {
    const item = await registry.item(name)
    for (const { rel, content } of planItem(project, item)) {
      const state = fileState(project, lock, rel)
      if (state === "edited" && !options.force) {
        log.skip(`${rel} has local changes, so it was not updated. Use --force to replace it.`)
        skipped++
        continue
      }
      if (state !== "missing" && hash(project.read(rel)) === hash(content)) continue
      writeFile(project, rel, content)
      lock.files[rel] = hash(content)
      log.ok(rel)
    }
  }

  const block = await registry.agentsBlock()
  writeFile(
    project,
    "AGENTS.md",
    upsertBlock(project.exists("AGENTS.md") ? project.read("AGENTS.md") : undefined, block),
  )
  log.ok("AGENTS.md: BlankUI section")
  writeFile(project, lockFile, lockJson(lock))
  if (skipped > 0) log.warn(`${skipped} file(s) kept because of local changes.`)
  return 0
}
