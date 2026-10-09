import Link from "next/link"
import { Container, Stack } from "@/components/ui/layout"
import { allDocs, categoryOrder } from "@/docs/lib/registry"

const guides = [
  { href: "/docs", label: "Getting started" },
  { href: "/docs/themes", label: "Themes and tokens" },
  { href: "/docs/lint", label: "Lint rules" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = allDocs()
  return (
    <Container className="py-10">
      <div className="md:flex md:gap-10">
        <nav aria-label="Docs" className="hidden w-48 shrink-0 md:block">
          <Stack gap={6} className="sticky top-24 text-sm">
            <Stack gap={2}>
              <p className="font-medium">Guides</p>
              {guides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {g.label}
                </Link>
              ))}
            </Stack>
            {categoryOrder.map((cat) => {
              const items = docs.filter((d) => d.meta.category === cat)
              if (items.length === 0) return null
              return (
                <Stack key={cat} gap={2}>
                  <p className="font-medium capitalize">{cat}</p>
                  {items.map((d) => (
                    <Link
                      key={d.meta.name}
                      href={`/docs/${d.meta.name}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {d.meta.title}
                    </Link>
                  ))}
                </Stack>
              )
            })}
          </Stack>
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  )
}
