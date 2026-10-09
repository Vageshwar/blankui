import type { TSESTree } from "@typescript-eslint/utils"
import { createRule, jsxName } from "../utils"

export default createRule({
  name: "no-nested-card",
  meta: {
    type: "suggestion",
    docs: { description: "Disallow a Card inside another Card." },
    messages: {
      nested:
        "Do not put a <Card> inside another <Card>. Use <Stack> sections inside one Card, or place separate Cards side by side in a <Grid>.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        if (jsxName(node) !== "Card") return
        let current: TSESTree.Node | undefined = node.parent?.parent
        while (current) {
          if (current.type === "JSXElement" && jsxName(current.openingElement) === "Card") {
            context.report({ node, messageId: "nested" })
            return
          }
          current = current.parent
        }
      },
    }
  },
})
