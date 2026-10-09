import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../utils"

export default createRule({
  name: "no-direct-radix",
  meta: {
    type: "problem",
    docs: { description: "Import BlankUI components instead of Radix or sonner directly." },
    messages: {
      radix:
        'Import from "@/components/ui/..." instead of "{{source}}". BlankUI wraps Radix with required titles, labels and theme styles. See the component\'s .md file in components/ui.',
      sonner:
        'Import { toast } from "@/components/ui/toast" instead of "sonner", so toasts use the BlankUI theme.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        const source = node.source.value
        if (source === "radix-ui" || source.startsWith("@radix-ui/")) {
          context.report({ node, messageId: "radix", data: { source } })
        } else if (source === "sonner") {
          context.report({ node, messageId: "sonner" })
        }
      },
    }
  },
})
