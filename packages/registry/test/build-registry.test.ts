import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { beforeAll, describe, expect, it } from "vitest"
import {
  agentsBlockEnd,
  agentsBlockStart,
  analyzeImports,
  buildRegistry,
} from "../scripts/build-registry"

let out: string
const read = (rel: string) => readFileSync(path.join(out, rel), "utf8")
const json = (rel: string) => JSON.parse(read(rel))

beforeAll(() => {
  out = mkdtempSync(path.join(tmpdir(), "blankui-registry-"))
  buildRegistry({ outDir: out, baseUrl: "https://example.test" })
})

describe("analyzeImports", () => {
  it("splits npm packages from registry items", () => {
    const src = `import { Slot } from "radix-ui"\nimport { X } from "lucide-react/icons"\nimport { cn } from "@/lib/utils"\nimport { Button } from "@/components/ui/button"\nimport type { ReactNode } from "react"`
    expect(analyzeImports(src)).toEqual({
      packages: ["lucide-react", "radix-ui"],
      registry: ["button", "utils"],
    })
  })
})

describe("registry items", () => {
  it("writes a shadcn registry item for each component", () => {
    const button = json("r/button.json")
    expect(button.$schema).toBe("https://ui.shadcn.com/schema/registry-item.json")
    expect(button.type).toBe("registry:ui")
    expect(button.dependencies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^radix-ui@\^/),
        expect.stringMatching(/^class-variance-authority@\^/),
      ]),
    )
    expect(button.registryDependencies).toEqual([
      "https://example.test/r/theme.json",
      "https://example.test/r/utils.json",
    ])
    expect(button.files.map((f: { path: string }) => f.path)).toEqual([
      "ui/button.tsx",
      "ui/button.md",
    ])
    expect(button.files[0].content).toMatch(/^\/\/ BlankUI: button\./)
  })

  it("links components that use other components", () => {
    const alert = json("r/alert-dialog.json")
    expect(alert.registryDependencies).toContain("https://example.test/r/button.json")
    const input = json("r/input.json")
    expect(input.registryDependencies).toContain("https://example.test/r/field.json")
  })

  it("ships the theme and utils", () => {
    expect(json("r/theme.json").files[0].content).toContain("--color-*: initial")
    expect(json("r/utils.json").dependencies).toEqual(
      expect.arrayContaining([expect.stringMatching(/^clsx@/)]),
    )
  })

  it("writes an index without file contents", () => {
    const index = json("r/registry.json")
    expect(index.name).toBe("blankui")
    const names = index.items.map((i: { name: string }) => i.name)
    expect(names).toEqual(expect.arrayContaining(["theme", "utils", "button", "dialog", "layout"]))
    expect(JSON.stringify(index)).not.toContain('"content"')
  })
})

describe("agent docs", () => {
  it("writes a short AGENTS.md block between markers", () => {
    const block = read("r/agents-block.md").trim()
    expect(block.startsWith(agentsBlockStart)).toBe(true)
    expect(block.endsWith(agentsBlockEnd)).toBe(true)
    expect(block).toContain("`@/components/ui/dialog`")
    expect(block.split("\n").length).toBeLessThan(60)
  })

  it("writes llms.txt with a link for every component", () => {
    const llms = read("llms.txt")
    expect(llms.startsWith("# BlankUI\n")).toBe(true)
    expect(llms).toContain("- [Button](https://example.test/docs/button.md):")
    expect(llms).toContain("## Overlay")
  })

  it("writes llms-full.txt with rules, docs and mistakes to avoid", () => {
    const full = read("llms-full.txt")
    expect(full).toContain("Rules:")
    expect(full).toContain("# Dialog")
    expect(full).toContain("### Mistakes to avoid")
  })

  it("serves each component doc as raw markdown", () => {
    expect(read("docs/select.md")).toContain("name: select")
  })
})
