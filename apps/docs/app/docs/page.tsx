import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid, Stack } from "@/components/ui/layout"
import { CopyCommand } from "@/docs/components/copy-command"
import { Markdown } from "@/docs/components/markdown"
import { allDocs, siteUrl } from "@/docs/lib/registry"

export const metadata: Metadata = { title: "Getting started" }

const setup = `## What \`init\` does

- Adds \`styles/blankui.css\` (tokens and themes) and imports it after Tailwind.
- Adds \`lib/utils.ts\` with the \`cn()\` helper and a \`components.json\`.
- Sets up \`@blankui/eslint-plugin\`.
- Writes a short BlankUI section into \`AGENTS.md\` (between \`<!-- blankui:start -->\` markers, so your own content is kept) and a \`CLAUDE.md\` that points to it.

## Requirements

React 19 and Tailwind CSS v4, in a Next.js or Vite project. BlankUI does not support React 18 or Tailwind v3.

## With the shadcn CLI

Every component is also a shadcn registry item, so this works too:

\`\`\`bash
npx shadcn add ${siteUrl}/r/button.json
\`\`\`

## For agents

- [llms.txt](/llms.txt): an index of every component with a one-line description.
- [llms-full.txt](/llms-full.txt): the rules and every component doc in one file.
- \`${siteUrl}/docs/<name>.md\`: the raw doc for one component.
`

export default function DocsHome() {
  const docs = allDocs()
  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <h1 className="font-heading text-4xl font-bold">Getting started</h1>
        <p className="text-lg text-muted-foreground">
          BlankUI copies components into your project, with a doc file next to each one and lint
          rules that keep agents on track.
        </p>
        <Stack gap={2} className="max-w-md">
          <CopyCommand command="npx blankui init" />
          <CopyCommand command="npx blankui add button dialog field" />
        </Stack>
      </Stack>
      <Markdown>{setup}</Markdown>
      <Stack gap={4}>
        <h2 className="font-heading text-2xl font-semibold">Components</h2>
        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
          {docs.map((d) => (
            <Link
              key={d.meta.name}
              href={`/docs/${d.meta.name}`}
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Card className="h-full transition-colors hover:bg-surface-hover">
                <CardHeader>
                  <CardTitle>{d.meta.title}</CardTitle>
                  <CardDescription>{d.meta.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </Grid>
      </Stack>
    </Stack>
  )
}
