import { classStringVisitors, createRule, splitClasses, utilityOf } from "../utils"

const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
const prefixes =
  "bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|to|via|shadow|decoration|accent|caret|divide|placeholder"
const paletteClass = new RegExp(`^(${prefixes})-((${palette})-\\d{2,3}|white|black)(\\/\\d+)?$`)

const suggestions: Record<string, string> = {
  bg: "bg-background, bg-surface, bg-muted, bg-primary, bg-secondary, bg-destructive, bg-success or bg-warning",
  text: "text-foreground, text-muted-foreground, text-primary, text-primary-foreground or text-destructive",
  border: "border-border, border-border-strong, border-input or border-destructive",
}

export default createRule({
  name: "no-palette-colors",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow Tailwind palette colors. BlankUI removes the palette, so these classes render nothing.",
    },
    messages: {
      palette:
        "`{{className}}` does not exist in BlankUI (the Tailwind palette is removed, so it renders nothing). Use a semantic token: {{suggestion}}.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return classStringVisitors(({ value, node }) => {
      for (const className of splitClasses(value)) {
        const match = paletteClass.exec(utilityOf(className))
        if (!match) continue
        const prefix = match[1]!.startsWith("border") ? "border" : match[1]!
        const suggestion =
          suggestions[prefix] ?? "a semantic token like bg-primary or text-foreground"
        context.report({ node, messageId: "palette", data: { className, suggestion } })
      }
    })
  },
})
