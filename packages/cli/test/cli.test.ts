import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { buildRegistry } from "../../registry/scripts/build-registry.ts"
import { ensureClaudeImport, upsertBlock } from "../src/agents.ts"
import { add } from "../src/commands/add.ts"
import { check } from "../src/commands/doctor.ts"
import { init } from "../src/commands/init.ts"
import { update } from "../src/commands/update.ts"
import { Project, parseJsonc, rewriteImports } from "../src/project.ts"
import { Registry } from "../src/registry.ts"

let registryDir: string
let dir: string
const read = (rel: string) => readFileSync(path.join(dir, rel), "utf8")
const write = (rel: string, content: string) => {
  mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true })
  writeFileSync(path.join(dir, rel), content)
}

beforeAll(() => {
  registryDir = mkdtempSync(path.join(tmpdir(), "blankui-cli-registry-"))
  buildRegistry({ outDir: registryDir, baseUrl: "https://blank.vageshwar.dev" })
})

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
  dir = mkdtempSync(path.join(tmpdir(), "blankui-cli-project-"))
  write(
    "package.json",
    JSON.stringify({
      dependencies: { next: "16.3.6", react: "19.3.0" },
      devDependencies: { tailwindcss: "^4.3.3" },
    }),
  )
  write(
    "tsconfig.json",
    `{\n  // Next.js app\n  "compilerOptions": { "paths": { "@/*": ["./src/*"] }, },\n}`,
  )
  write("src/app/globals.css", '@import "tailwindcss";\n\nbody { margin: 0; }\n')
  write("AGENTS.md", "# My project\n\nUse pnpm.\n")
})

const opts = () => ({ cwd: dir, registry: registryDir, install: false })

describe("helpers", () => {
  it("parses tsconfig with comments and trailing commas", () => {
    expect(parseJsonc('{ "a": "x//y", /* c */ "b": [1,], }')).toEqual({ a: "x//y", b: [1] })
  })

  it("rewrites imports to the project's aliases", () => {
    const src = 'import { cn } from "@/lib/utils"\nimport { Button } from "@/components/ui/button"'
    expect(
      rewriteImports(src, {
        components: "~/components",
        ui: "~/components/ui",
        utils: "~/lib/utils",
        lib: "~/lib",
      }),
    ).toBe('import { cn } from "~/lib/utils"\nimport { Button } from "~/components/ui/button"')
  })

  it("replaces only the BlankUI block in AGENTS.md", () => {
    const first = upsertBlock(
      "# Mine\n\nKeep me.\n",
      "<!-- blankui:start -->\nv1\n<!-- blankui:end -->",
    )
    const second = upsertBlock(
      `${first}\nAfter.\n`,
      "<!-- blankui:start -->\nv2\n<!-- blankui:end -->",
    )
    expect(second).toContain("Keep me.")
    expect(second).toContain("After.")
    expect(second).toContain("v2")
    expect(second).not.toContain("v1")
  })

  it("adds @AGENTS.md to CLAUDE.md once", () => {
    expect(ensureClaudeImport(undefined)).toBe("@AGENTS.md\n")
    expect(ensureClaudeImport("# Notes\n")).toBe("# Notes\n\n@AGENTS.md\n")
    expect(ensureClaudeImport("# Notes\n\n@AGENTS.md\n")).toBeUndefined()
  })

  it("resolves registry dependencies, dependencies first", async () => {
    const items = await new Registry(registryDir).resolve(["alert-dialog"])
    expect(items.map((i) => i.name)).toEqual(["theme", "utils", "button", "alert-dialog"])
  })

  it("explains unknown components", async () => {
    await expect(new Registry(registryDir).item("carousel")).rejects.toThrow(
      /Unknown component "carousel"/,
    )
  })
})

describe("init", () => {
  it("sets up a Next.js project", async () => {
    expect(await init(opts())).toBe(0)
    const config = JSON.parse(read("components.json"))
    expect(config.aliases.ui).toBe("@/components/ui")
    expect(config.rsc).toBe(true)
    expect(config.tailwind.css).toBe("src/app/globals.css")
    expect(read("src/app/globals.css")).toMatch(
      /@import "tailwindcss";\n@import "\.\/blankui\.css";/,
    )
    expect(read("src/app/blankui.css")).toContain("--color-*: initial")
    expect(read("src/lib/utils.ts")).toContain("export function cn")
    expect(read("AGENTS.md")).toMatch(/^# My project\n\nUse pnpm\.\n\n<!-- blankui:start -->/)
    expect(read("CLAUDE.md")).toBe("@AGENTS.md\n")
    expect(read("eslint.config.mjs")).toContain("blankui.configs.recommended")
  })

  it("is safe to run twice", async () => {
    await init(opts())
    await init(opts())
    expect(read("src/app/globals.css").match(/blankui\.css/g)).toHaveLength(1)
    expect(read("AGENTS.md").match(/blankui:start/g)).toHaveLength(1)
  })

  it("fails clearly without Tailwind", async () => {
    write("src/app/globals.css", "body {}\n")
    expect(await init(opts())).toBe(1)
  })
})

describe("add, doctor and update", () => {
  beforeEach(async () => {
    await init(opts())
  })

  it("adds a component with its docs and dependencies", async () => {
    expect(await add(["dialog", "input"], { ...opts(), overwrite: false })).toBe(0)
    expect(existsSync(path.join(dir, "src/components/ui/dialog.tsx"))).toBe(true)
    expect(read("src/components/ui/dialog.md")).toContain("name: dialog")
    // input depends on field
    expect(read("src/components/ui/field.tsx")).toMatch(/^\/\/ BlankUI: field/)
    expect(JSON.parse(read("blankui-lock.json")).files["src/components/ui/dialog.tsx"]).toMatch(
      /^[0-9a-f]{16}$/,
    )
  })

  it("rewrites imports for custom aliases", async () => {
    const config = JSON.parse(read("components.json"))
    config.aliases.utils = "@/utils/cn"
    write("components.json", JSON.stringify(config))
    await add(["button"], { ...opts(), overwrite: false })
    expect(read("src/components/ui/button.tsx")).toContain('from "@/utils/cn"')
  })

  it("doctor passes on a clean setup and reports local edits", async () => {
    await add(["button"], { ...opts(), overwrite: false })
    const registry = new Registry(registryDir)
    const project = new Project(dir)
    expect((await check(project, registry)).problems).toEqual([])

    write("src/components/ui/button.tsx", `${read("src/components/ui/button.tsx")}\n// tweak\n`)
    const { problems } = await check(project, registry)
    expect(problems).toEqual([
      expect.stringContaining("src/components/ui/button.tsx was changed locally"),
    ])
  })

  it("doctor reports missing setup", async () => {
    write("src/app/globals.css", '@import "tailwindcss";\n')
    write("AGENTS.md", "# Nothing\n")
    const { problems } = await check(new Project(dir), new Registry(registryDir))
    expect(problems.join("\n")).toContain("does not import blankui.css")
    expect(problems.join("\n")).toContain("AGENTS.md has no BlankUI section")
  })

  it("update keeps local edits unless forced", async () => {
    await add(["button"], { ...opts(), overwrite: false })
    const edited = `${read("src/components/ui/button.tsx")}\n// tweak\n`
    write("src/components/ui/button.tsx", edited)
    await update([], { cwd: dir, registry: registryDir, force: false })
    expect(read("src/components/ui/button.tsx")).toBe(edited)
    await update([], { cwd: dir, registry: registryDir, force: true })
    expect(read("src/components/ui/button.tsx")).not.toContain("// tweak")
  })

  it("add does not overwrite without --overwrite", async () => {
    await add(["button"], { ...opts(), overwrite: false })
    write("src/components/ui/button.tsx", "// BlankUI: button. mine\n")
    await add(["button"], { ...opts(), overwrite: false })
    expect(read("src/components/ui/button.tsx")).toBe("// BlankUI: button. mine\n")
  })
})
