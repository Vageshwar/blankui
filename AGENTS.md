# Working on the BlankUI repo

This file is for agents working on BlankUI itself. (The `AGENTS.md` block that `blankui init` writes into user projects is generated from `packages/registry/src/ui/*.md`.)

- Read `docs/SPEC.md` first. It is the source of truth for design decisions.
- Follow `CONTRIBUTING.md` for the component checklist and commit style.
- Stack: React 19, Tailwind v4, TypeScript 6, pnpm workspaces. Do not add React 18 or Tailwind v3 patterns (`forwardRef`, `tailwind.config.js`).
- Components live in `packages/registry/src/ui`. Each `.tsx` has a matching `.md`.
- Run `pnpm check` before opening a PR.
- Public text (docs, PRs, issues) uses simple English and no em dashes.
