"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Inline } from "@/components/ui/layout"

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can be blocked. The command is still visible to copy by hand.
    }
  }
  return (
    <Inline
      justify="between"
      wrap={false}
      className="rounded-md border bg-muted py-1 pr-1 pl-4 font-mono text-sm"
    >
      <code className="truncate">{command}</code>
      <Button
        size="icon"
        variant="ghost"
        aria-label={copied ? "Copied" : `Copy ${command}`}
        onClick={copy}
        className="size-8"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </Inline>
  )
}
