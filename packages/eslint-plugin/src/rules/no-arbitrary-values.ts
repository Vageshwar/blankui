import { classStringVisitors, createRule, splitClasses, utilityOf } from "../utils"

const colorLike =
  /^(bg|text|border|ring|outline|fill|stroke|from|to|via|shadow|decoration|accent|caret|divide)-\[(#|rgb|hsl|oklch|color)/

export default createRule({
  name: "no-arbitrary-values",
  meta: {
    type: "problem",
    docs: { description: "Disallow Tailwind arbitrary values like mt-[13px] or bg-[#fff]." },
    messages: {
      arbitrary:
        "`{{className}}` is an arbitrary value. Use a step from the Tailwind scale (for example mt-3, w-64) or a BlankUI layout prop like <Stack gap={4}>.",
      arbitraryColor:
        "`{{className}}` is a hard-coded color. Use a semantic token like bg-primary, bg-surface, text-foreground, text-muted-foreground or border-border.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return classStringVisitors(({ value, node }) => {
      for (const className of splitClasses(value)) {
        const utility = utilityOf(className)
        if (!utility.includes("[")) continue
        const messageId = colorLike.test(utility) ? "arbitraryColor" : "arbitrary"
        context.report({ node, messageId, data: { className } })
      }
    })
  },
})
