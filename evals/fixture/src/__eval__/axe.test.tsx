// Renders one screen and records axe violations. Used by the eval scorer, not by agents.
import { writeFileSync } from "node:fs"
import { render } from "@testing-library/react"
import axe from "axe-core"
import { test } from "vitest"

// jsdom gaps that Radix relies on.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.scrollIntoView ??= () => {}
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

test("axe", async () => {
  const out = process.env.AXE_OUT!
  try {
    const mod = (await import(/* @vite-ignore */ process.env.SCREEN!)) as {
      default: () => React.ReactNode
    }
    const Screen = mod.default
    const { container } = render(<Screen />)
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
    })
    const violations = result.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))
    writeFileSync(out, JSON.stringify({ rendered: true, violations }))
  } catch (error) {
    writeFileSync(out, JSON.stringify({ rendered: false, error: String(error), violations: [] }))
  }
})
