export const blockStart = "<!-- blankui:start -->"
export const blockEnd = "<!-- blankui:end -->"

/** Insert or replace the BlankUI block in AGENTS.md content. Everything outside the markers is kept. */
export function upsertBlock(existing: string | undefined, block: string): string {
  const clean = block.trim()
  if (!existing || existing.trim() === "") return `# AGENTS.md\n\n${clean}\n`
  const start = existing.indexOf(blockStart)
  const end = existing.indexOf(blockEnd)
  if (start !== -1 && end > start) {
    return `${existing.slice(0, start)}${clean}${existing.slice(end + blockEnd.length)}`
  }
  return `${existing.replace(/\s*$/, "")}\n\n${clean}\n`
}

export function hasBlock(content: string | undefined): boolean {
  return Boolean(content?.includes(blockStart) && content.includes(blockEnd))
}

/** CLAUDE.md should import AGENTS.md so Claude Code reads the same rules. */
export function ensureClaudeImport(existing: string | undefined): string | undefined {
  if (!existing) return "@AGENTS.md\n"
  if (/^@AGENTS\.md\s*$/m.test(existing)) return undefined
  return `${existing.replace(/\s*$/, "")}\n\n@AGENTS.md\n`
}
