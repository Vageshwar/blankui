# BlankUI spec

BlankUI is an open-source React + TypeScript component library built so that coding agents (Claude Code, Codex, Cursor, Copilot and others) write correct UI with it on the first try. It is distributed as a copy-in registry, the same way shadcn/ui is.

The core idea: make the right usage the easiest guess, and make wrong usage fail loudly at type, build or lint time.

Docs and registry: https://blank.vageshwar.dev

## Why

Agents using today's libraries make the same mistakes again and again:

- They write APIs from memory, often from an older version (MUI v4 vs v7, Tailwind v3 vs v4, `forwardRef` vs React 19 refs).
- They have many ways to style one thing and no rule for which one to pick.
- Arbitrary values like `mt-[13px]` and `bg-[#3b82f6]` cost nothing, so the design slowly drifts.
- Required compound parts (like `DialogTitle`) can be forgotten and the code still compiles.
- Docs explain how to use a component, but not when to use it instead of a similar one.
- There are no layout primitives, so every page gets ad hoc flex with random spacing.
- Agents cannot see the rendered output. Only type errors, lint errors and test failures change what they do.

## Principles

1. **Use what agents already know.** Keep shadcn and Radix names and shapes. Change something only when it removes a known failure mode.
2. **One way to do each thing.** One styling path, one icon set, one supported stack.
3. **Feedback agents act on.** Type errors and lint messages that name the fix.
4. **"When to use" guidance lives next to the code.**
5. **Decisions are backed by evals.**

## Stack

- React 19+ and Tailwind CSS v4 only. No React 18 or Tailwind v3 support.
- Radix primitives (the `radix-ui` package), hidden behind BlankUI's own API. Apps never import Radix directly.
- lucide-react is the only icon set.
- Next.js and Vite are supported.

## API design

- Familiar names: `variant`, `size`, `asChild`, `DialogContent`, and so on.
- Strict types where accessibility depends on it:
  - Icon-only `Button` requires `aria-label`.
  - `Dialog`, `Sheet` and `AlertDialog` content requires a title.
  - `variant`, `size` and `gap` are closed unions, never `string`.
- Design rules (no nested cards, use layout primitives for spacing) are enforced by lint, not types, because lint messages can explain why.

## Strictness (guarded)

- The Tailwind default color palette is removed. Only semantic tokens exist. Tailwind does not fail on unknown classes, so `bg-blue-500` silently renders nothing. The `no-palette-colors` lint rule reports it.
- `eslint-plugin-blankui` reports:
  - Tailwind palette colors such as `bg-blue-500` and `text-white`
  - arbitrary values such as `[13px]` and `[#hex]`
  - color values in inline `style`
  - raw elements (`<button>`, `<input>`, `<select>`) when a BlankUI component exists
  - direct imports from `radix-ui`, `@radix-ui/*` or `sonner` outside `components/ui`
  - a `Card` inside another `Card`
- Every lint message names the fix, for example `Use <Stack gap={4}> instead of space-y-4.`
- `className` is still allowed.

## Tokens and themes

- Themes: `default`, `slate` and `neo` (neo-brutalism). Each theme has a light and a dark mode.
- Themes change color, radius, border width, shadow and font tokens. A component must look right in both `slate` and `neo` with no code changes.
- Token names follow shadcn where they are clear, rename the misleading ones, and add what is missing:
  - `background`, `foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`
  - `surface-hover` (shadcn calls this `accent`, which agents misuse as a brand color)
  - new: `surface`, `surface-raised`, `border-strong`, `edge` (outline around solid controls, visible only in neo), `success`, `success-foreground`, `warning`, `warning-foreground`
- Switching: `data-theme` and `data-mode` attributes on `<html>`. Compatible with `next-themes` (`attribute="data-mode"`). No custom provider.

## v1 scope

- Foundations: tokens, the three themes, and layout primitives `Stack`, `Inline`, `Grid`, `Container`.
- Spacing scale for layout primitives: `1 | 2 | 3 | 4 | 6 | 8 | 12`, the same steps as Tailwind spacing.
- Core components: Button, Input, Select, Checkbox, Dialog, Sheet, Popover, Tooltip, Toast, Card, Tabs, Table.
- Forms: `Field`, which wires label, control, description and error together. It works with or without a form library.

## Agent knowledge layer

- Each component ships a co-located `.md` file with frontmatter:

  ```yaml
  name: dialog
  title: Dialog
  description: A modal window that blocks the page until the user responds.
  whenToUse: [...]
  whenNotToUse: [...] # each entry names the better component
  related: [sheet, popover]
  requiredParts: [DialogContent, DialogTitle]
  antiPatterns: [...]
  ```

- This file is the single source of truth. The registry JSON, the AGENTS.md block, `llms.txt` and the docs site are generated from it.
- Every public prop has JSDoc.
- `blankui init` writes a marked block into `AGENTS.md` and a `CLAUDE.md` that imports it. It never overwrites user content.

## Drift handling

- Each component file starts with a header comment saying it is managed by BlankUI and pointing to its `.md` file.
- `blankui doctor` compares local components with the registry and reports changed files and missing docs.

## CLI and registry

- npm package `blankui`. Commands: `init`, `add`, `doctor`, `update`.
- The registry follows the shadcn registry JSON format and is served at `https://blank.vageshwar.dev/r/<name>.json`, so `npx shadcn add https://blank.vageshwar.dev/r/button.json` also works.

## Evals

- About 20 realistic UI tasks to start, run with Claude Code (headless) and Codex CLI.
- Baseline: the same tasks against plain shadcn/ui, on Radix (`shadcn`) and on Base UI, its current default (`shadcn-base`).
- Automated scoring: TypeScript passes, lint violation count, intended component usage (AST check), and accessibility (axe).

## Repo

- pnpm monorepo: `packages/registry`, `packages/eslint-plugin`, `packages/cli`, `apps/docs`, `evals`.
- MIT license.
- Every component ships `.tsx`, frontmatter `.md`, JSDoc, tests and at least two eval tasks. CI runs static checks on every PR. The eval suite runs on demand.

## Deferred

MCP server, density axis, model-judged visual scoring, AI product components (chat, streaming, tool calls), Base UI migration.
