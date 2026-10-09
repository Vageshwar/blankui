import path from "node:path"
import { ensureClaudeImport, upsertBlock } from "../agents.ts"
import { log, run, writeFile } from "../io.ts"
import { hash, lockFile, lockJson, readLock } from "../lock.ts"
import { Project, type ComponentsJson } from "../project.ts"
import { Registry } from "../registry.ts"

export interface InitOptions {
  cwd: string
  registry?: string
  install: boolean
}

const eslintConfig = `import tseslint from "typescript-eslint"
import blankui from "eslint-plugin-blankui"

export default tseslint.config(
  { ignores: ["dist/**", ".next/**", "node_modules/**"] },
  ...tseslint.configs.recommended,
  ...blankui.configs.recommended,
)
`

export async function init(options: InitOptions): Promise<number> {
  const project = new Project(path.resolve(options.cwd))
  const registry = new Registry(options.registry)

  if (!project.exists("package.json")) {
    log.error("No package.json here. Run blankui init in the root of a React project.")
    return 1
  }
  const framework = project.framework()
  if (framework === "unknown")
    log.warn(
      "Could not find Next.js or Vite. BlankUI should still work, but only those two are tested.",
    )
  const tailwind =
    project.packageJson().dependencies?.tailwindcss ??
    project.packageJson().devDependencies?.tailwindcss
  if (tailwind && !/(^|[^\d])4/.test(tailwind))
    log.warn(`BlankUI needs Tailwind CSS v4. This project has tailwindcss ${tailwind}.`)

  const css = project.mainCss()
  if (!css) {
    log.error(
      'Could not find your main CSS file (one with @import "tailwindcss"). Set up Tailwind CSS v4 first: https://tailwindcss.com/docs/installation',
    )
    return 1
  }

  const root = project.aliasRoot()
  if (!root.fromTsconfig) {
    log.warn(
      `No import alias found in tsconfig.json. Add "paths": { "@/*": ["./${root.dir ? `${root.dir}/` : ""}*"] } so "@/components/ui/..." imports work.`,
    )
  }
  const p = root.prefix
  const config: ComponentsJson = project.componentsJson() ?? {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: framework === "next",
    tsx: true,
    tailwind: { config: "", css, baseColor: "neutral", cssVariables: true },
    aliases: {
      components: `${p}/components`,
      ui: `${p}/components/ui`,
      utils: `${p}/lib/utils`,
      lib: `${p}/lib`,
      hooks: `${p}/hooks`,
    },
  }
  config.registries = {
    ...config.registries,
    "@blankui": `${options.registry ?? "https://blank.vageshwar.dev"}/r/{name}.json`,
  }
  writeFile(project, "components.json", `${JSON.stringify(config, null, 2)}\n`)
  log.ok("components.json")

  const lock = readLock(project)

  // Theme next to the main CSS file, imported right after tailwindcss.
  const theme = await registry.item("theme")
  const themeRel = path.join(path.dirname(css), "blankui.css")
  if (!project.exists(themeRel)) {
    writeFile(project, themeRel, theme.files[0]!.content)
    lock.files[themeRel] = hash(theme.files[0]!.content)
    log.ok(themeRel)
  } else log.skip(`${themeRel} already exists`)
  const cssText = project.read(css)
  if (!cssText.includes("blankui.css")) {
    writeFile(
      project,
      css,
      cssText.replace(/(@import\s+["']tailwindcss["'];?)/, `$1\n@import "./blankui.css";`),
    )
    log.ok(`${css}: imports blankui.css`)
  }

  const utils = await registry.item("utils")
  const utilsRel = `${project.aliasToPath(config.aliases.utils)}.ts`
  if (!project.exists(utilsRel)) {
    writeFile(project, utilsRel, utils.files[0]!.content)
    lock.files[utilsRel] = hash(utils.files[0]!.content)
    log.ok(utilsRel)
  } else log.skip(`${utilsRel} already exists`)

  const block = await registry.agentsBlock()
  writeFile(
    project,
    "AGENTS.md",
    upsertBlock(project.exists("AGENTS.md") ? project.read("AGENTS.md") : undefined, block),
  )
  log.ok("AGENTS.md: BlankUI section")
  const claude = ensureClaudeImport(
    project.exists("CLAUDE.md") ? project.read("CLAUDE.md") : undefined,
  )
  if (claude) {
    writeFile(project, "CLAUDE.md", claude)
    log.ok("CLAUDE.md: imports AGENTS.md")
  }

  const existingEslint = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "eslint.config.cjs",
  ].find((f) => project.exists(f))
  if (!existingEslint) {
    writeFile(project, "eslint.config.mjs", eslintConfig)
    log.ok("eslint.config.mjs")
  } else if (!project.read(existingEslint).includes("eslint-plugin-blankui")) {
    log.warn(
      `Add BlankUI to ${existingEslint}:\n\n  import blankui from "eslint-plugin-blankui"\n  // ...then add ...blankui.configs.recommended to the exported config array\n`,
    )
  }

  writeFile(project, lockFile, lockJson(lock))

  const deps = utils.dependencies
  const devDeps = ["eslint-plugin-blankui", "typescript-eslint", "eslint"].filter(
    (d) => !project.hasDependency(d),
  )
  const commands = [
    project.installCommand(deps),
    ...(devDeps.length ? [project.installCommand(devDeps, true)] : []),
  ]
  if (options.install) {
    for (const c of commands)
      if (!run(project, c)) log.warn(`Install failed. Run it yourself: ${c}`)
  } else {
    log.info(`\nInstall the dependencies:\n${commands.map((c) => `  ${c}`).join("\n")}`)
  }

  log.info(`\nDone. Add components with: npx blankui add button field dialog`)
  log.info(
    `Set a theme on <html>: data-theme="default" | "slate" | "neo" and data-mode="light" | "dark".`,
  )
  return 0
}
