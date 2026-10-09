import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid, Inline, Stack } from "@/components/ui/layout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyCommand } from "@/docs/components/copy-command"
import { Demo } from "@/docs/components/demos"
import { Markdown } from "@/docs/components/markdown"
import { componentNames, getDoc, siteUrl } from "@/docs/lib/registry"

export const dynamicParams = false

export function generateStaticParams() {
  return componentNames().map((name) => ({ name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const { meta } = getDoc(name)
  return { title: meta.title, description: meta.description }
}

function linkFor(use: string) {
  const names = componentNames()
  const match = names.find((n) => use === n || use.startsWith(`${n} `))
  return match ? (
    <Link href={`/docs/${match}`} className="font-medium underline underline-offset-4">
      {use}
    </Link>
  ) : (
    <span className="font-medium">{use}</span>
  )
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!componentNames().includes(name)) notFound()
  const { meta, body } = getDoc(name)

  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <p className="text-sm font-medium text-muted-foreground capitalize">{meta.category}</p>
        <h1 className="font-heading text-4xl font-bold">{meta.title}</h1>
        <p className="text-lg text-muted-foreground">{meta.description}</p>
        <Stack gap={2} className="max-w-lg">
          <CopyCommand command={`npx blankui-cli add ${name}`} />
        </Stack>
        <Inline gap={4} className="text-sm text-muted-foreground">
          <a
            href={`/docs/${name}.md`}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Raw markdown for agents
          </a>
          <a
            href={`/r/${name}.json`}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Registry JSON
          </a>
        </Inline>
      </Stack>

      <Demo name={name} />

      <Grid columns={{ base: 1, lg: 2 }} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>When to use</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm leading-relaxed">
              {meta.whenToUse.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {meta.whenNotToUse.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle asChild>
                <h2>Use something else when</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm leading-relaxed">
                {meta.whenNotToUse.map((w) => (
                  <li key={w.when}>
                    {w.when} Use {linkFor(w.use)}.
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Markdown>{body}</Markdown>

      {meta.antiPatterns.length > 0 && (
        <Stack gap={4}>
          <h2 className="font-heading text-2xl font-semibold">Mistakes to avoid</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avoid</TableHead>
                <TableHead>Instead</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meta.antiPatterns.map((a) => (
                <TableRow key={a.avoid}>
                  <TableCell className="font-mono text-xs">{a.avoid}</TableCell>
                  <TableCell className="font-mono text-xs">{a.instead}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      )}

      <p className="text-sm text-muted-foreground">
        Install with the shadcn CLI:{" "}
        <code className="font-mono">
          npx shadcn add {siteUrl}/r/{name}.json
        </code>
      </p>
    </Stack>
  )
}
