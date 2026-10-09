import type { Metadata } from "next"
import { Space_Grotesk, Space_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toast"
import { SiteFooter, SiteHeader } from "@/docs/components/site-header"
import { themeScript } from "@/docs/components/theme-switcher"
import { siteUrl } from "@/docs/lib/registry"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BlankUI: components coding agents get right", template: "%s | BlankUI" },
  description:
    "A React 19 + Tailwind v4 component library built for coding agents. Copy-in components with docs that say when to use them, strict types and lint rules that name the fix.",
  openGraph: { siteName: "BlankUI", type: "website" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="default"
      data-mode="light"
      className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
