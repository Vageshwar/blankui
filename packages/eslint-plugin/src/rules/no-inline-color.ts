import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../utils"

const colorProps = new Set([
  "color",
  "background",
  "backgroundColor",
  "borderColor",
  "outlineColor",
  "fill",
  "stroke",
  "boxShadow",
])

export default createRule({
  name: "no-inline-color",
  meta: {
    type: "problem",
    docs: { description: "Disallow colors in inline style props." },
    messages: {
      inlineColor:
        'Do not set `{{property}}` in an inline style. Use a token class instead, for example className="bg-surface text-foreground border-border".',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "style") return
        if (node.value?.type !== "JSXExpressionContainer") return
        const expr = node.value.expression
        if (expr.type !== "ObjectExpression") return
        for (const prop of expr.properties) {
          if (prop.type !== "Property") continue
          const key =
            prop.key.type === "Identifier"
              ? prop.key.name
              : prop.key.type === "Literal"
                ? String(prop.key.value)
                : undefined
          if (!key || !colorProps.has(key)) continue
          // CSS variables like var(--primary) are fine.
          if (prop.value.type === "Literal" && String(prop.value.value).startsWith("var(")) continue
          context.report({ node: prop, messageId: "inlineColor", data: { property: key } })
        }
      },
    }
  },
})
