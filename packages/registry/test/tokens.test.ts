import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { buildCss, hasClass, tokensPath } from "./helpers/tailwind"

const source = readFileSync(tokensPath, "utf8")

const colorTokens = [
  "background",
  "foreground",
  "surface",
  "surface-raised",
  "surface-hover",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "border",
  "border-strong",
  "edge",
  "input",
  "ring",
  "overlay",
]
const elevationTokens = ["elevation-sm", "elevation-md", "elevation-lg"]
const shapeTokens = ["radius", "border-width", "font-body", "font-display", "font-code"]

/** Returns the declarations inside the first rule whose selector list contains `selector`. */
function block(selector: string): string {
  const start = source.indexOf(`${selector} {`)
  if (start === -1) {
    const listed = source.indexOf(`${selector},`)
    if (listed === -1) throw new Error(`No block for ${selector}`)
    return source.slice(listed, source.indexOf("}", listed))
  }
  return source.slice(start, source.indexOf("}", start))
}

describe("palette reset", () => {
  it("does not generate Tailwind default palette classes", async () => {
    const banned = ["bg-blue-500", "text-white", "bg-black", "text-gray-500", "border-zinc-200"]
    const css = await buildCss(banned)
    for (const name of banned) expect(hasClass(css, name), name).toBe(false)
  })

  it("generates semantic token classes", async () => {
    const allowed = colorTokens
      .map((t) => `bg-${t}`)
      .concat(["text-muted-foreground", "border-border"])
    const css = await buildCss(allowed)
    for (const name of allowed) expect(hasClass(css, name), name).toBe(true)
  })

  it("maps radius, shadow and font utilities to theme tokens", async () => {
    const css = await buildCss(["rounded-lg", "shadow-md", "font-heading", "font-mono"])
    expect(css).toContain("var(--elevation-md)")
    expect(css).toContain("var(--font-display)")
    expect(css).toContain("var(--font-code)")
    expect(hasClass(css, "rounded-lg")).toBe(true)
  })

  it("makes plain border follow the theme border width", async () => {
    const css = await buildCss(["border", "border-b"])
    expect(css).toContain("border-width: var(--border-width, 1px)")
    expect(css).toContain("border-bottom-width: var(--border-width, 1px)")
  })

  it("uses data-mode for the dark variant", async () => {
    const css = await buildCss(["dark:bg-muted"])
    expect(css).toContain('[data-mode="dark"]')
  })
})

describe("themes", () => {
  const lightBlocks = ['[data-theme="default"]', '[data-theme="slate"]', '[data-theme="neo"]']
  const darkBlocks = [
    '[data-theme="default"][data-mode="dark"]',
    '[data-theme="slate"][data-mode="dark"]',
    '[data-theme="neo"][data-mode="dark"]',
  ]

  it.each(lightBlocks)("%s defines every token", (selector) => {
    const body = block(selector)
    for (const t of [...colorTokens, ...elevationTokens, ...shapeTokens]) {
      expect(body, `${selector} --${t}`).toContain(`--${t}:`)
    }
  })

  it.each(darkBlocks)("%s defines every color and elevation token", (selector) => {
    const body = block(selector)
    for (const t of [...colorTokens, ...elevationTokens]) {
      expect(body, `${selector} --${t}`).toContain(`--${t}:`)
    }
  })

  it("neo is neo-brutalist: square corners, thick borders, hard shadows", () => {
    const body = block('[data-theme="neo"]')
    expect(body).toContain("--radius: 0rem")
    expect(body).toContain("--border-width: 2px")
    expect(body).toMatch(/--elevation-md: 4px 4px 0 0/)
  })
})
