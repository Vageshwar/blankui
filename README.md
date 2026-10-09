# BlankUI

A React + TypeScript component library built for coding agents.

BlankUI is a copy-in registry, like shadcn/ui. The difference is who it is designed for: Claude Code, Codex, Cursor, Copilot and other agents that write most of the UI code today. The goal is that an agent uses every component correctly on the first try.

How it does that:

- **Familiar APIs.** Names and shapes follow shadcn/ui and Radix, so agents already know them.
- **One way to do each thing.** One styling path, one icon set, one supported stack (React 19 + Tailwind v4).
- **Wrong usage fails loudly.** The Tailwind palette is reset to semantic tokens, accessibility props are required by the types, and an ESLint plugin catches the rest with messages that name the fix.
- **"When to use" docs next to the code.** Every component ships a `.md` file that says when to use it and when to pick something else.
- **Layout primitives.** `Stack`, `Inline`, `Grid` and `Container` with a fixed spacing scale, so pages stop getting random spacing.
- **Evals.** The same UI tasks are run by agents against BlankUI and plain shadcn/ui, and the results are published.

Docs: https://blank.vageshwar.dev

## Quick start

```bash
npx blankui-cli init
npx blankui-cli add button dialog field
```

`init` sets up tokens and themes, the ESLint plugin, and a short BlankUI section in your `AGENTS.md` (plus a `CLAUDE.md` that points to it).

You can also install a single component with the shadcn CLI:

```bash
npx shadcn add https://blank.vageshwar.dev/r/button.json
```

## Themes

`default`, `slate` and `neo` (neo-brutalism), each with light and dark mode. Set them on `<html>`:

```html
<html data-theme="neo" data-mode="dark"></html>
```

## Repo layout

| Path                     | What it is                                        |
| ------------------------ | ------------------------------------------------- |
| `packages/registry`      | Component sources, docs, tokens, registry builder |
| `packages/eslint-plugin` | `eslint-plugin-blankui`                           |
| `packages/cli`           | `blankui` CLI (`init`, `add`, `doctor`, `update`) |
| `apps/docs`              | Docs site and registry host (blank.vageshwar.dev) |
| `evals`                  | Agent eval tasks and scoring                      |
| `docs/SPEC.md`           | The design decisions behind BlankUI               |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
