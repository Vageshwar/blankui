import type { ESLint, Linter } from "eslint"
import noArbitraryValues from "./rules/no-arbitrary-values"
import noDirectRadix from "./rules/no-direct-radix"
import noInlineColor from "./rules/no-inline-color"
import noNestedCard from "./rules/no-nested-card"
import noPaletteColors from "./rules/no-palette-colors"
import preferComponent from "./rules/prefer-component"
import preferLayoutPrimitives from "./rules/prefer-layout-primitives"

export const rules = {
  "no-arbitrary-values": noArbitraryValues,
  "no-palette-colors": noPaletteColors,
  "no-inline-color": noInlineColor,
  "prefer-component": preferComponent,
  "prefer-layout-primitives": preferLayoutPrimitives,
  "no-direct-radix": noDirectRadix,
  "no-nested-card": noNestedCard,
}

const plugin = {
  meta: { name: "eslint-plugin-blankui", version: "0.1.0" },
  rules,
  configs: {} as { recommended: Linter.Config[] },
}

/**
 * Recommended flat config. Applies to app code and skips components/ui, where the
 * BlankUI components themselves use Radix and raw elements on purpose.
 *
 * @example
 * // eslint.config.js
 * import blankui from "eslint-plugin-blankui"
 * export default [...blankui.configs.recommended]
 */
plugin.configs.recommended = [
  {
    name: "blankui/recommended",
    files: ["**/*.{jsx,tsx}"],
    ignores: ["**/components/ui/**"],
    plugins: { blankui: plugin as unknown as ESLint.Plugin },
    rules: {
      "blankui/no-arbitrary-values": "error",
      "blankui/no-palette-colors": "error",
      "blankui/no-inline-color": "error",
      "blankui/prefer-component": "error",
      "blankui/prefer-layout-primitives": "warn",
      "blankui/no-direct-radix": "error",
      "blankui/no-nested-card": "warn",
    },
  },
]

export default plugin
