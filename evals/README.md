# BlankUI evals

Agents build the same 20 UI screens in three apps, and we score what they write:

| Suite         | App                                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| `blankui`     | BlankUI, set up with `blankui init` and `blankui add all`                      |
| `shadcn`      | shadcn/ui on Radix (`shadcn init --base radix`), what most training data shows |
| `shadcn-base` | shadcn/ui on Base UI, the current `shadcn init` default                        |

Every app is the same Vite + React 19 + Tailwind CSS v4 project with the same set of components. Every agent gets the same prompt, which does not mention any library by name.

## Run it

```bash
pnpm --filter @blankui/evals eval:setup            # build the three fixture apps in evals/.work
pnpm --filter @blankui/evals eval:run --agent claude --suite blankui,shadcn
pnpm --filter @blankui/evals eval:run --agent codex --suite all --tasks login-form,invoice-table
```

Results go to `evals/results/<run>.json` and `<run>.md`. Running agents costs money, so the suite runs on demand, not in CI. `pnpm --filter @blankui/evals test` checks the tasks and the scoring code and does run in CI.

Supported agents: `claude` (Claude Code, headless) and `codex` (Codex CLI). Each must be installed and logged in.

## What is scored

| Metric                                    | How                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Screen file created                       | `src/screens/<task>.tsx` exists                                                                                |
| TypeScript passes                         | `tsc --noEmit` on the whole app                                                                                |
| Intended components used                  | share of the task's expected components that appear as JSX (AST check)                                         |
| Design-system lint issues                 | BlankUI lint rules: palette colors, arbitrary values, inline colors, raw elements                              |
| Layout classes                            | `prefer-layout-primitives`, shown on its own row and left out of the total (flex and gap are normal in shadcn) |
| Rendered without crashing, axe violations | the screen is rendered in jsdom and checked with axe (color contrast skipped)                                  |

BlankUI-only parts (`Field`, `Stack`, `Inline`, `Grid`, `Container`) are tracked for the `blankui` suite, but not used in the comparison.

## Adding a task

Add `tasks/<id>.json`:

```json
{
  "id": "share-popover",
  "title": "Share popover",
  "prompt": "A 'Share' button that opens a small floating panel with the page link in a read-only field and a 'Copy link' button.",
  "expect": { "shared": ["Popover", "Input", "Button"], "blankuiOnly": ["Field"] }
}
```

Describe what the user sees, not which component to use. Picking the right component is part of the test.
