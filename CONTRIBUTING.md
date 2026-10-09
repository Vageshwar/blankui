# Contributing to BlankUI

Thanks for helping out. BlankUI has one goal that shapes every rule below: coding agents should use every component correctly on the first try. Please read [docs/SPEC.md](docs/SPEC.md) before your first change.

## Setup

You need Node.js 22+ and pnpm (the version is pinned in `package.json`, so `corepack enable` is enough).

```bash
pnpm install
pnpm check     # format check, typecheck, lint, test, build
pnpm --filter docs dev   # docs site on http://localhost:3000
```

## How work flows

1. Every change starts from a GitHub issue. If there is no issue, open one first and describe the problem.
2. Create a branch from `main`, named after the issue, for example `12-tooltip-component`.
3. Open a pull request. Put `Closes #<issue>` in the description so the issue closes when it merges.
4. `main` is protected. Pull requests merge only when CI passes. Maintainers can turn on auto-merge so a green PR merges itself.
5. PRs are squash-merged, so keep the PR title in the commit style below.

## Commit and PR titles

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(dialog): require a title on DialogContent
fix(cli): keep user content outside the AGENTS.md block
docs: explain when to use Sheet over Dialog
```

## Adding or changing a component

A component is only done when all of these are in place. CI checks most of them.

- [ ] `packages/registry/src/ui/<name>.tsx` starts with the BlankUI header comment.
- [ ] It uses Radix through `radix-ui` when behavior is needed. Never re-export Radix as-is.
- [ ] Props use closed unions (`"sm" | "md" | "lg"`), never plain `string`, for variants and sizes.
- [ ] Accessibility-critical props are required by the types (for example an icon-only button needs `aria-label`).
- [ ] Every public prop has a JSDoc comment.
- [ ] Only semantic token classes are used. No arbitrary values like `[13px]` or `[#fff]`.
- [ ] `packages/registry/src/ui/<name>.md` exists with valid frontmatter (`whenToUse`, `whenNotToUse`, `related`, `requiredParts`, `antiPatterns`).
- [ ] Tests in `packages/registry/test/<name>.test.tsx`, including an axe check and type tests for required props.
- [ ] At least two eval tasks in `evals/tasks/` that use the component.
- [ ] It looks right in the `default`, `slate` and `neo` themes, in light and dark mode.

### Changing a public API

APIs follow shadcn/ui and Radix on purpose, because agents already know those names. If you want to rename a prop or move away from the shadcn shape, explain in the issue which agent mistake the change prevents. An eval task that shows the mistake is the best evidence.

## Writing docs

The component `.md` file is the source for the docs site, the registry, `llms.txt` and the `AGENTS.md` block. Write for a reader who skims:

- Short, plain sentences.
- `whenNotToUse` entries should name the better component.
- Examples should be complete and copy-pasteable.

## ESLint rules

Rules live in `packages/eslint-plugin`. Every message must tell the reader what to do instead, for example `Use <Stack gap={4}> instead of space-y-4.` Agents act on the exact text of error messages.

## Evals

Eval tasks live in `evals/tasks`. See `evals/README.md` for the format and how to run them (`pnpm --filter @blankui/evals eval:setup`, then `eval:run`). Running agents costs money, so the eval suite runs on demand and not on every PR.

## Code of conduct

Be kind and assume good intent. Harassment of any kind is not accepted.
