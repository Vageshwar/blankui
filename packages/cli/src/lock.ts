import { createHash } from "node:crypto"
import type { Project } from "./project.ts"

export const lockFile = "blankui-lock.json"

export interface Lock {
  /** Relative file path -> sha256 of the content BlankUI wrote. */
  files: Record<string, string>
}

export function hash(content: string): string {
  return createHash("sha256").update(content.replace(/\r\n/g, "\n")).digest("hex").slice(0, 16)
}

export function readLock(project: Project): Lock {
  if (!project.exists(lockFile)) return { files: {} }
  return JSON.parse(project.read(lockFile)) as Lock
}

export function lockJson(lock: Lock): string {
  const files = Object.fromEntries(
    Object.entries(lock.files).sort(([a], [b]) => a.localeCompare(b)),
  )
  return `${JSON.stringify({ files }, null, 2)}\n`
}

export type FileState = "missing" | "unchanged" | "edited" | "unknown"

/** Compare a file on disk with what BlankUI last wrote there. */
export function fileState(project: Project, lock: Lock, rel: string): FileState {
  if (!project.exists(rel)) return "missing"
  const recorded = lock.files[rel]
  if (!recorded) return "unknown"
  return hash(project.read(rel)) === recorded ? "unchanged" : "edited"
}
