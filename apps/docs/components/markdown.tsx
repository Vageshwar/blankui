import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(text).join("")
  return ""
}

const slug = (children: ReactNode) =>
  text(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-bui">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: c }) => <h2 id={slug(c)}>{c}</h2>,
          h3: ({ children: c }) => <h3 id={slug(c)}>{c}</h3>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
