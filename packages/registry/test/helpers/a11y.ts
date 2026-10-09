import axe from "axe-core"
import { expect } from "vitest"

/**
 * Run axe on a rendered container and fail with readable messages.
 * Skipped: color-contrast (jsdom has no layout) and region (components are tested outside a page).
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  })
  const messages = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
  )
  expect(messages).toEqual([])
}
