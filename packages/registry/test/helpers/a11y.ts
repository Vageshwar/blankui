import axe from "axe-core"
import { expect } from "vitest"

/** Run axe on a rendered container and fail with readable messages. Color contrast is skipped (jsdom has no layout). */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
  const messages = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
  )
  expect(messages).toEqual([])
}
