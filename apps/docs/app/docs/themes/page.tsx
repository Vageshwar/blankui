import type { Metadata } from "next"
import { Stack } from "@/components/ui/layout"
import { Markdown } from "@/docs/components/markdown"

export const metadata: Metadata = { title: "Themes and tokens" }

const content = `BlankUI removes the Tailwind color palette. Only semantic tokens exist, so every component and every page follows the theme.

## Themes

| Theme | Look |
| --- | --- |
| \`default\` | Neutral grays with a near-black primary. |
| \`slate\` | Cool blue-gray with a blue primary and softer corners. |
| \`neo\` | Neo-brutalism: square corners, 2px borders, hard offset shadows, bright colors. |

Each theme has a light and a dark mode. Set both on \`<html>\`:

\`\`\`html
<html data-theme="neo" data-mode="dark">
\`\`\`

With next-themes, use \`attribute="data-mode"\` for the mode and set \`data-theme\` yourself.

## Color tokens

Use them with any color utility: \`bg-primary\`, \`text-muted-foreground\`, \`border-border\`, \`ring-ring\`.

| Token | Use for |
| --- | --- |
| \`background\` / \`foreground\` | The page and its text. |
| \`surface\` | Cards, inputs and other raised areas. |
| \`surface-raised\` | Dialogs, popovers and menus. |
| \`surface-hover\` | Hover background for rows, menu items and ghost buttons. shadcn calls this \`accent\`. |
| \`primary\` / \`primary-foreground\` | The main action. |
| \`secondary\` / \`secondary-foreground\` | Less important actions. |
| \`muted\` / \`muted-foreground\` | Quiet backgrounds and secondary text. |
| \`destructive\`, \`success\`, \`warning\` (each with \`-foreground\`) | Status. |
| \`border\`, \`border-strong\`, \`input\`, \`ring\` | Lines, input borders and focus rings. |
| \`edge\` | The outline around solid controls. Transparent except in neo. |
| \`overlay\` | The backdrop behind dialogs and sheets. |

## Shape tokens

\`rounded-sm\`, \`rounded-md\`, \`rounded-lg\` and \`rounded-xl\` follow \`--radius\`. \`shadow-sm\`, \`shadow-md\` and \`shadow-lg\` follow the theme, so they become hard offset shadows in neo. A plain \`border\` uses \`--border-width\` (1px, or 2px in neo).

## Fonts

\`font-sans\` (body), \`font-heading\` and \`font-mono\` are set by the theme.

## Why there is no palette

When \`bg-blue-500\` exists, agents use it, and the design drifts away from the theme one class at a time. Without the palette, such a class renders nothing, and the \`no-palette-colors\` lint rule tells the agent which token to use instead.
`

export default function ThemesPage() {
  return (
    <Stack gap={6}>
      <h1 className="font-heading text-4xl font-bold">Themes and tokens</h1>
      <Markdown>{content}</Markdown>
    </Stack>
  )
}
