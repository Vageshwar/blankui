import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container, Inline } from "@/components/ui/layout"
import { repoUrl } from "@/docs/lib/registry"
import { ThemeSwitcher } from "./theme-switcher"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <Container>
        <Inline justify="between" className="h-14" wrap={false}>
          <Inline gap={6} wrap={false}>
            <Link href="/" className="font-heading text-lg font-bold">
              BlankUI
            </Link>
            <Inline gap={4} className="hidden text-sm text-muted-foreground sm:flex">
              <Link href="/docs" className="hover:text-foreground">
                Docs
              </Link>
              <a href="/llms.txt" className="hover:text-foreground">
                llms.txt
              </a>
            </Inline>
          </Inline>
          <Inline gap={2} wrap={false}>
            <ThemeSwitcher />
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
              <a href={repoUrl}>GitHub</a>
            </Button>
          </Inline>
        </Inline>
      </Container>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t py-8 text-sm text-muted-foreground">
      <Container>
        <Inline justify="between">
          <p>
            Built by{" "}
            <a
              href="https://vageshwar.dev"
              className="text-foreground underline underline-offset-4"
            >
              Vageshwar
            </a>
            . MIT license.
          </p>
          <Inline gap={4}>
            <a href={repoUrl} className="hover:text-foreground">
              GitHub
            </a>
            <a href="/llms-full.txt" className="hover:text-foreground">
              llms-full.txt
            </a>
            <a href="https://blog.vageshwar.dev" className="hover:text-foreground">
              Blog
            </a>
          </Inline>
        </Inline>
      </Container>
    </footer>
  )
}
