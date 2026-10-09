import Link from "next/link"
import { ArrowRight, Bot, FileText, Layers, ShieldCheck, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container, Grid, Inline, Stack } from "@/components/ui/layout"
import { CopyCommand } from "@/docs/components/copy-command"
import { Showcase } from "@/docs/components/demos"

const problems = [
  "They write APIs from memory, often from an old version of the library.",
  "They reach for mt-[13px] and bg-[#3b82f6] because nothing stops them.",
  "They forget DialogTitle, and the code still compiles.",
  "They know how to use a Dialog, but not when a Sheet would be better.",
  "They can't see the page, so visual bugs pass silently.",
]

const features = [
  {
    icon: Bot,
    title: "APIs agents already know",
    text: "Names and shapes follow shadcn/ui and Radix. BlankUI only changes them where the familiar version fails silently.",
  },
  {
    icon: ShieldCheck,
    title: "Wrong usage fails loudly",
    text: "Icon buttons need an aria-label, dialogs need a title, and gap only takes the spacing scale. TypeScript says so.",
  },
  {
    icon: Terminal,
    title: "Lint that names the fix",
    text: "“Use <Stack gap={4}> instead of flex flex-col gap-4.” Agents act on the exact text of lint errors.",
  },
  {
    icon: FileText,
    title: "Docs next to the code",
    text: "Every component ships a .md file that says when to use it, when to pick something else, and what to avoid.",
  },
  {
    icon: Layers,
    title: "Layout primitives",
    text: "Stack, Inline, Grid and Container with a fixed scale, so pages stop getting random spacing.",
  },
]

export default function Home() {
  return (
    <main>
      <Container className="pt-20 pb-16 sm:pt-28">
        <Stack gap={6} className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">
            React 19 · Tailwind CSS v4 · Radix · MIT
          </p>
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            Components coding agents get right the first time.
          </h1>
          <p className="text-lg text-muted-foreground">
            BlankUI is a copy-in component library, like shadcn/ui, designed for Claude Code, Codex,
            Cursor and every other agent that writes UI today.
          </p>
          <Stack gap={3} className="max-w-md">
            <CopyCommand command="npx blankui-cli init" />
          </Stack>
          <Inline gap={3}>
            <Button asChild size="lg">
              <Link href="/docs">
                Read the docs <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/llms.txt">llms.txt for agents</a>
            </Button>
          </Inline>
        </Stack>
      </Container>

      <Container className="pb-16">
        <Showcase />
      </Container>

      <Container className="py-16">
        <Grid columns={{ base: 1, lg: 2 }} gap={12}>
          <Stack gap={4}>
            <h2 className="font-heading text-3xl font-bold">Why agents get UI wrong</h2>
            <p className="text-muted-foreground">
              Today&apos;s libraries were built for people who read docs sites and look at the
              result. Agents do neither. They guess from training data and only change course when a
              type error, lint error or test failure tells them to.
            </p>
          </Stack>
          <Stack asChild gap={3}>
            <ul>
              {problems.map((p) => (
                <li key={p} className="rounded-md border bg-surface p-4 text-sm">
                  {p}
                </li>
              ))}
            </ul>
          </Stack>
        </Grid>
      </Container>

      <Container className="py-16">
        <Stack gap={8}>
          <h2 className="font-heading text-3xl font-bold">How BlankUI fixes it</h2>
          <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {features.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>

      <Container className="py-16">
        <Stack gap={4} className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold">Three themes, light and dark</h2>
          <p className="text-muted-foreground">
            Switch between default, slate and neo (neo-brutalism) in the header. The components do
            not change. Only the tokens do: colors, radius, border width, shadows and fonts.
          </p>
        </Stack>
      </Container>
    </main>
  )
}
