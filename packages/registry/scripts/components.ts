import { readdirSync, readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { z } from "zod"

export const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const uiDir = path.join(registryRoot, "src/ui")

/** The first line every component file must start with. */
export const headerPrefix = "// BlankUI:"

export const categories = [
  "layout",
  "action",
  "form",
  "overlay",
  "feedback",
  "display",
  "navigation",
] as const

export const frontmatterSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9-]*$/, "use kebab-case, matching the file name"),
  title: z.string().min(1),
  description: z.string().min(10).max(160),
  category: z.enum(categories),
  whenToUse: z.array(z.string().min(3)).min(1),
  whenNotToUse: z
    .array(
      z.object({
        when: z.string().min(3),
        use: z.string().min(1).describe("name of the better component, or a short phrase"),
      }),
    )
    .default([]),
  related: z.array(z.string()).default([]),
  requiredParts: z.array(z.string()).default([]),
  antiPatterns: z
    .array(
      z.object({
        avoid: z.string().min(3),
        instead: z.string().min(3),
      }),
    )
    .default([]),
})

export type ComponentMeta = z.infer<typeof frontmatterSchema>

export interface ComponentEntry {
  name: string
  meta: ComponentMeta
  /** Markdown body after the frontmatter. */
  body: string
  /** The .tsx source. */
  source: string
  sourcePath: string
  docPath: string
}

export interface LoadResult {
  components: ComponentEntry[]
  errors: string[]
}

/** Load every component in src/ui with its doc, and report problems instead of throwing. */
export function loadComponents(dir: string = uiDir): LoadResult {
  const errors: string[] = []
  const components: ComponentEntry[] = []
  const files = readdirSync(dir)

  for (const file of files.filter((f) => f.endsWith(".tsx")).sort()) {
    const name = file.replace(/\.tsx$/, "")
    const sourcePath = path.join(dir, file)
    const docPath = path.join(dir, `${name}.md`)
    const source = readFileSync(sourcePath, "utf8")

    if (!source.startsWith(headerPrefix)) {
      errors.push(`${file}: first line must start with "${headerPrefix}"`)
    }
    if (!existsSync(docPath)) {
      errors.push(`${file}: missing ${name}.md`)
      continue
    }

    const parsed = matter(readFileSync(docPath, "utf8"))
    const result = frontmatterSchema.safeParse(parsed.data)
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${name}.md: ${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      }
      continue
    }
    const meta = result.data
    if (meta.name !== name) errors.push(`${name}.md: name "${meta.name}" must match the file name`)

    for (const part of meta.requiredParts) {
      if (!exportsName(source, part))
        errors.push(`${name}.md: requiredParts "${part}" is not exported by ${file}`)
    }
    if (!/```tsx\n/.test(parsed.content)) {
      errors.push(`${name}.md: add at least one \`\`\`tsx example`)
    }

    components.push({ name, meta, body: parsed.content.trim(), source, sourcePath, docPath })
  }

  for (const file of files.filter((f) => f.endsWith(".md"))) {
    if (!files.includes(file.replace(/\.md$/, ".tsx")))
      errors.push(`${file}: no matching .tsx file`)
  }

  const names = new Set(components.map((c) => c.name))
  for (const c of components) {
    for (const r of c.meta.related) {
      if (!names.has(r)) errors.push(`${c.name}.md: related "${r}" is not a component`)
    }
  }

  return { components, errors }
}

function exportsName(source: string, name: string): boolean {
  const direct = new RegExp(`export\\s+(function|const|class|type|interface)\\s+${name}\\b`)
  const listed = new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`)
  return direct.test(source) || listed.test(source)
}
