import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { categories, loadComponents, registryRoot, type ComponentEntry } from "./components.ts"

export const defaultBaseUrl = "https://blank.vageshwar.dev"

/** Markers around the BlankUI section in a user's AGENTS.md. The CLI only rewrites what is between them. */
export const agentsBlockStart = "<!-- blankui:start -->"
export const agentsBlockEnd = "<!-- blankui:end -->"

interface RegistryFile {
  path: string
  type: "registry:ui" | "registry:lib" | "registry:file"
  target?: string
  content: string
}

export interface RegistryItem {
  $schema: string
  name: string
  type: "registry:ui" | "registry:lib" | "registry:style"
  title: string
  description: string
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
  docs?: string
  meta?: Record<string, unknown>
}

const itemSchema = "https://ui.shadcn.com/schema/registry-item.json"

/** Packages that every React project already has, so they are never listed as dependencies. */
const builtIn = new Set(["react", "react-dom"])

function readPackageVersions(): Record<string, string> {
  const pkg = JSON.parse(readFileSync(path.join(registryRoot, "package.json"), "utf8"))
  return pkg.dependencies ?? {}
}

/** npm packages and other registry items a source file imports. */
export function analyzeImports(source: string): { packages: string[]; registry: string[] } {
  const packages = new Set<string>()
  const registry = new Set<string>()
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = match[1]!
    if (spec === "@/lib/utils") registry.add("utils")
    else if (spec.startsWith("@/components/ui/"))
      registry.add(spec.slice("@/components/ui/".length))
    else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const name = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0]!
      if (!builtIn.has(name)) packages.add(name)
    }
  }
  return { packages: [...packages].sort(), registry: [...registry].sort() }
}

function withVersion(names: string[], versions: Record<string, string>): string[] {
  return names.map((n) => (versions[n] ? `${n}@^${versions[n]}` : n))
}

function itemUrl(baseUrl: string, name: string) {
  return `${baseUrl}/r/${name}.json`
}

function componentItem(
  c: ComponentEntry,
  baseUrl: string,
  versions: Record<string, string>,
): RegistryItem {
  const { packages, registry } = analyzeImports(c.source)
  const doc = readFileSync(c.docPath, "utf8")
  return {
    $schema: itemSchema,
    name: c.name,
    type: "registry:ui",
    title: c.meta.title,
    description: c.meta.description,
    dependencies: withVersion(packages, versions),
    registryDependencies: ["theme", ...registry].map((n) => itemUrl(baseUrl, n)),
    files: [
      { path: `ui/${c.name}.tsx`, type: "registry:ui", content: c.source },
      { path: `ui/${c.name}.md`, type: "registry:ui", content: doc },
    ],
    docs: `Read components/ui/${c.name}.md before using ${c.meta.title}. Docs: ${baseUrl}/docs/${c.name}`,
    meta: {
      category: c.meta.category,
      requiredParts: c.meta.requiredParts,
      related: c.meta.related,
    },
  }
}

function utilsItem(versions: Record<string, string>): RegistryItem {
  const content = readFileSync(path.join(registryRoot, "src/lib/utils.ts"), "utf8")
  return {
    $schema: itemSchema,
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    description: "The cn() helper that merges class names.",
    dependencies: withVersion(analyzeImports(content).packages, versions),
    registryDependencies: [],
    files: [{ path: "lib/utils.ts", type: "registry:lib", content }],
  }
}

function themeItem(): RegistryItem {
  const content = readFileSync(path.join(registryRoot, "src/styles/blankui.css"), "utf8")
  return {
    $schema: itemSchema,
    name: "theme",
    type: "registry:style",
    title: "Theme",
    description:
      "BlankUI tokens and the default, slate and neo themes. Import it after tailwindcss.",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "styles/blankui.css", type: "registry:file", target: "styles/blankui.css", content },
    ],
    docs: 'Add @import "./styles/blankui.css"; after @import "tailwindcss"; in your main CSS file.',
  }
}

/** The BlankUI section written into a project's AGENTS.md. Kept short because it loads into every agent session. */
export function agentsBlock(
  components: ComponentEntry[],
  baseUrl: string = defaultBaseUrl,
): string {
  const rows = components.map(
    (c) =>
      `| ${c.meta.requiredParts.slice(0, 4).join(", ") || c.meta.title} | ${c.meta.whenToUse[0]} | \`@/components/ui/${c.name}\` |`,
  )
  return [
    agentsBlockStart,
    "## BlankUI",
    "",
    `This project uses [BlankUI](${baseUrl}). Components live in \`components/ui\`. Each one has a \`.md\` file next to it that says when to use it and what to avoid. Read it before using a component for the first time.`,
    "",
    "Rules:",
    "",
    "- Stack is React 19 and Tailwind CSS v4. Do not use `forwardRef` or `tailwind.config.js`.",
    "- Colors come from semantic tokens only: `bg-background`, `bg-surface`, `bg-surface-hover`, `bg-primary`, `text-primary-foreground`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-destructive`, `bg-success`, `bg-warning`. The Tailwind palette (`bg-blue-500`, `text-white`) does not exist in this project.",
    "- No arbitrary values like `mt-[13px]`, `w-[372px]` or `bg-[#fff]`.",
    "- Spacing between elements uses `Stack`, `Inline`, `Grid` and `Container` with `gap` 1, 2, 3, 4, 6, 8 or 12. Do not use `space-y-*`, `space-x-*` or `flex gap-*` for layout.",
    "- Use BlankUI components instead of raw `<button>`, `<input>`, `<select>`, `<textarea>` and `<table>`.",
    '- Every form control goes inside `<Field label="...">`, which wires the label, help text and errors.',
    "- `DialogContent`, `SheetContent` and `AlertDialogContent` take a `title` prop. There is no `DialogTitle`.",
    '- Icon-only buttons need `aria-label`: `<Button size="icon" aria-label="Close"><X /></Button>`.',
    "- Icons come from `lucide-react` only.",
    "- Do not edit files in `components/ui` to change a single usage. Add a variant there, or use the component as documented.",
    "- Run the linter after changes. BlankUI lint messages say what to use instead.",
    "- If a component you need is not in `components/ui`, add it with `npx blankui add <name>` instead of building your own.",
    "",
    "Components:",
    "",
    "| Component | Use for | Import |",
    "| --- | --- | --- |",
    ...rows,
    "",
    `Full docs for agents: ${baseUrl}/llms-full.txt`,
    agentsBlockEnd,
  ].join("\n")
}

function llmsTxt(components: ComponentEntry[], baseUrl: string): string {
  const sections = categories
    .map((cat) => {
      const items = components.filter((c) => c.meta.category === cat)
      if (items.length === 0) return ""
      const title = cat[0]!.toUpperCase() + cat.slice(1)
      return [
        `## ${title}`,
        "",
        ...items.map(
          (c) => `- [${c.meta.title}](${baseUrl}/docs/${c.name}.md): ${c.meta.description}`,
        ),
        "",
      ].join("\n")
    })
    .filter(Boolean)
  return [
    "# BlankUI",
    "",
    "> A React 19 + Tailwind CSS v4 component library built for coding agents. Components are copied into your project (shadcn style) with a .md file next to each one.",
    "",
    `Install: \`npx blankui init\`, then \`npx blankui add <component>\`. Registry items: ${baseUrl}/r/<name>.json`,
    "",
    ...sections,
    "## Optional",
    "",
    `- [Everything in one file](${baseUrl}/llms-full.txt)`,
    `- [Design decisions](https://github.com/Vageshwar/blankui/blob/main/docs/SPEC.md)`,
    "",
  ].join("\n")
}

function llmsFullTxt(components: ComponentEntry[], baseUrl: string): string {
  const rules = agentsBlock(components, baseUrl)
    .split("\n")
    .filter((l) => l !== agentsBlockStart && l !== agentsBlockEnd)
    .join("\n")
  const docs = components.map((c) => {
    const avoid = c.meta.whenNotToUse.map((w) => `- ${w.when} Use ${w.use}.`).join("\n")
    const anti = c.meta.antiPatterns
      .map((a) => `- Avoid \`${a.avoid}\`. Instead: \`${a.instead}\``)
      .join("\n")
    return [
      `---`,
      "",
      c.body,
      "",
      avoid && `### When not to use\n\n${avoid}`,
      anti && `### Mistakes to avoid\n\n${anti}`,
    ]
      .filter(Boolean)
      .join("\n")
  })
  return ["# BlankUI: full docs for agents", "", rules, "", ...docs, ""].join("\n")
}

export interface BuildResult {
  files: string[]
  items: RegistryItem[]
}

/** Write the registry, llms.txt files, raw docs and the AGENTS.md block into outDir. */
export function buildRegistry({
  outDir,
  baseUrl = defaultBaseUrl,
}: {
  outDir: string
  baseUrl?: string
}): BuildResult {
  const { components, errors } = loadComponents()
  if (errors.length > 0) throw new Error(`Fix component errors first:\n${errors.join("\n")}`)

  const versions = readPackageVersions()
  const items = [
    themeItem(),
    utilsItem(versions),
    ...components.map((c) => componentItem(c, baseUrl, versions)),
  ]
  const written: string[] = []
  const write = (rel: string, content: string) => {
    const file = path.join(outDir, rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, content)
    written.push(rel)
  }

  for (const item of items) write(`r/${item.name}.json`, `${JSON.stringify(item, null, 2)}\n`)
  write(
    "r/registry.json",
    `${JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: "blankui",
        homepage: baseUrl,
        items: items.map(({ $schema: _s, files, ...rest }) => ({
          ...rest,
          files: files.map(({ content: _c, ...f }) => f),
        })),
      },
      null,
      2,
    )}\n`,
  )
  for (const c of components) write(`docs/${c.name}.md`, `${readFileSync(c.docPath, "utf8")}`)
  write("r/agents-block.md", `${agentsBlock(components, baseUrl)}\n`)
  write("llms.txt", llmsTxt(components, baseUrl))
  write("llms-full.txt", llmsFullTxt(components, baseUrl))

  return { files: written, items }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outIndex = process.argv.indexOf("--out")
  const outDir = path.resolve(
    outIndex > -1 ? process.argv[outIndex + 1]! : path.join(registryRoot, "dist"),
  )
  const baseIndex = process.argv.indexOf("--base-url")
  const baseUrl = baseIndex > -1 ? process.argv[baseIndex + 1]! : defaultBaseUrl
  const { files } = buildRegistry({ outDir, baseUrl })
  console.log(`BlankUI registry: wrote ${files.length} files to ${outDir}`)
}
