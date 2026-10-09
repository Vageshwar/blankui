import type { TSESTree } from "@typescript-eslint/utils"
import { createRule, jsxName, splitClasses, utilityOf } from "../utils"

const scale = new Set(["1", "2", "3", "4", "6", "8", "12"])

function gapHint(n: string | undefined): string {
  if (!n) return ""
  return scale.has(n) ? ` gap={${n}}` : " gap={4}"
}

function classValue(node: TSESTree.JSXOpeningElement): string | undefined {
  for (const attr of node.attributes) {
    if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") continue
    if (attr.name.name !== "className" || !attr.value) continue
    if (attr.value.type === "Literal" && typeof attr.value.value === "string")
      return attr.value.value
    if (attr.value.type === "JSXExpressionContainer") {
      const e = attr.value.expression
      if (e.type === "Literal" && typeof e.value === "string") return e.value
      if (e.type === "TemplateLiteral") return e.quasis.map((q) => q.value.cooked).join(" ")
    }
  }
  return undefined
}

export default createRule({
  name: "prefer-layout-primitives",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Use Stack, Inline and Grid instead of flex, grid and space-* classes for layout.",
    },
    messages: {
      useStack: 'Use <Stack{{gap}}> from "@/components/ui/layout" instead of `{{classes}}`.',
      useInline: 'Use <Inline{{gap}}> from "@/components/ui/layout" instead of `{{classes}}`.',
      useGrid:
        'Use <Grid columns={...}{{gap}}> from "@/components/ui/layout" instead of `{{classes}}`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const name = jsxName(node)
        // Only plain elements. Components decide their own layout.
        if (!name || name[0] !== name[0]!.toLowerCase()) return
        const value = classValue(node)
        if (!value) return
        // Responsive or state variants (md:flex, hover:...) are layout tweaks, not page layout.
        const plain = splitClasses(value).filter((c) => utilityOf(c) === c)
        const has = (c: string) => plain.includes(c)
        const find = (re: RegExp) => plain.map((c) => re.exec(c)).find(Boolean)

        const spaceY = find(/^space-y-(\d+)$/)
        const spaceX = find(/^space-x-(\d+)$/)
        const gap = find(/^gap-(\d+)$/)
        const report = (
          messageId: "useStack" | "useInline" | "useGrid",
          n: string | undefined,
          classes: string,
        ) => context.report({ node, messageId, data: { gap: gapHint(n), classes } })

        if (spaceY) return report("useStack", spaceY[1], spaceY[0])
        if (spaceX) return report("useInline", spaceX[1], spaceX[0])
        if (!gap) return
        if (has("grid") && find(/^grid-cols-\d+$/))
          return report("useGrid", gap[1], `grid ${gap[0]}`)
        if (has("flex") && has("flex-col"))
          return report("useStack", gap[1], `flex flex-col ${gap[0]}`)
        if (has("flex")) return report("useInline", gap[1], `flex ${gap[0]}`)
      },
    }
  },
})
