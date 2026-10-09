import { readFileSync } from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export interface DocMeta {
  name: string
  title: string
  description: string
  category: string
  whenToUse: string[]
  whenNotToUse: { when: string; use: string }[]
  related: string[]
  requiredParts: string[]
  antiPatterns: { avoid: string; instead: string }[]
}

export interface Doc {
  meta: DocMeta
  body: string
}

const publicDir = path.join(process.cwd(), "public")

export const categoryOrder = [
  "layout",
  "action",
  "form",
  "overlay",
  "feedback",
  "display",
  "navigation",
]

/** Component names from the generated registry index (built into public/ before next build). */
export function componentNames(): string[] {
  const index = JSON.parse(readFileSync(path.join(publicDir, "r/registry.json"), "utf8"))
  return index.items
    .filter((i: { type: string }) => i.type === "registry:ui")
    .map((i: { name: string }) => i.name)
}

export function getDoc(name: string): Doc {
  const parsed = matter(readFileSync(path.join(publicDir, "docs", `${name}.md`), "utf8"))
  // The page renders the title itself, so drop the first "# Title" line.
  const body = parsed.content.replace(/^\s*# .*\n/, "").trim()
  return { meta: parsed.data as DocMeta, body }
}

export function allDocs(): Doc[] {
  return componentNames()
    .map(getDoc)
    .sort(
      (a, b) =>
        categoryOrder.indexOf(a.meta.category) - categoryOrder.indexOf(b.meta.category) ||
        a.meta.title.localeCompare(b.meta.title),
    )
}

export const siteUrl = "https://blank.vageshwar.dev"
export const repoUrl = "https://github.com/Vageshwar/blankui"
