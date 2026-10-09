import { spawnSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import type { Project } from "./project.ts"

export const log = {
  info: (msg: string) => console.log(msg),
  ok: (msg: string) => console.log(`✓ ${msg}`),
  skip: (msg: string) => console.log(`- ${msg}`),
  warn: (msg: string) => console.log(`! ${msg}`),
  error: (msg: string) => console.error(`✗ ${msg}`),
}

export function writeFile(project: Project, rel: string, content: string) {
  const file = project.file(rel)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, content)
}

/** Run the package manager. Returns false when it fails, so the caller can print the command instead. */
export function run(project: Project, command: string): boolean {
  log.info(`$ ${command}`)
  const result = spawnSync(command, { cwd: project.root, shell: true, stdio: "inherit" })
  return result.status === 0
}
