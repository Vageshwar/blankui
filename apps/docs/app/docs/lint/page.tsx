import type { Metadata } from "next"
import { Stack } from "@/components/ui/layout"
import { Markdown } from "@/docs/components/markdown"

export const metadata: Metadata = { title: "Lint rules" }

const content = `\`@blankui/eslint-plugin\` catches what types cannot. Every message says what to use instead, because agents act on the exact text of lint errors. \`npx blankui init\` sets it up.

\`\`\`js
// eslint.config.js
import tseslint from "typescript-eslint"
import blankui from "@blankui/eslint-plugin"

export default tseslint.config(...tseslint.configs.recommended, ...blankui.configs.recommended)
\`\`\`

The recommended config checks \`.jsx\` and \`.tsx\` files and skips \`components/ui\`.

## no-palette-colors

Reports Tailwind palette colors like \`bg-blue-500\` and \`text-white\`. They render nothing in BlankUI. Use a semantic token such as \`bg-primary\` or \`text-foreground\`.

## no-arbitrary-values

Reports arbitrary values like \`mt-[13px]\`, \`w-[372px]\` and \`bg-[#fff]\`. Use a step from the scale or a token. Arbitrary variants like \`data-[state=open]:\` are fine.

## no-inline-color

Reports colors in \`style={{ ... }}\`. Use a token class.

## prefer-component

Reports raw \`<button>\`, \`<input>\`, \`<select>\`, \`<textarea>\` and \`<table>\`, and names the BlankUI component to use.

## prefer-layout-primitives

Reports \`flex flex-col gap-4\`, \`space-y-6\`, \`flex gap-2\` and \`grid grid-cols-3 gap-6\` on plain elements, and suggests \`Stack\`, \`Inline\` or \`Grid\`.

## no-direct-radix

Reports imports from \`radix-ui\`, \`@radix-ui/*\` and \`sonner\` in app code. Import the BlankUI component instead.

## no-nested-card

Reports a \`Card\` inside another \`Card\`.
`

export default function LintPage() {
  return (
    <Stack gap={6}>
      <h1 className="font-heading text-4xl font-bold">Lint rules</h1>
      <Markdown>{content}</Markdown>
    </Stack>
  )
}
