import type { TSESTree } from "@typescript-eslint/utils"
import { createRule, jsxAttributeString, jsxName } from "../utils"

const replacements: Record<string, { component: string; module: string }> = {
  button: { component: "Button", module: "button" },
  select: { component: "Select", module: "select" },
  textarea: { component: "Textarea", module: "textarea" },
  table: { component: "Table", module: "table" },
}

const inputReplacements: Record<string, { component: string; module: string } | null> = {
  checkbox: { component: "Checkbox", module: "checkbox" },
  hidden: null,
  file: null,
  radio: null,
  range: null,
  color: null,
}

export default createRule({
  name: "prefer-component",
  meta: {
    type: "suggestion",
    docs: { description: "Use BlankUI components instead of raw form and table elements." },
    messages: {
      prefer:
        'Use <{{component}}> from "@/components/ui/{{module}}" instead of <{{element}}>. It has the right styles, states and accessibility built in.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const name = jsxName(node)
        if (!name) return
        let replacement = replacements[name]
        if (name === "input") {
          const type = jsxAttributeString(node, "type") ?? "text"
          const special = inputReplacements[type]
          replacement =
            special === undefined ? { component: "Input", module: "input" } : (special ?? undefined)
        }
        if (!replacement) return
        context.report({ node, messageId: "prefer", data: { ...replacement, element: name } })
      },
    }
  },
})
