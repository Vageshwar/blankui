# blankui

The CLI for [BlankUI](https://blank.vageshwar.dev), a React 19 + Tailwind CSS v4 component library built for coding agents.

```bash
npx blankui init                 # tokens, themes, lint rules, AGENTS.md section
npx blankui add button dialog    # copy components (and their .md docs) into components/ui
npx blankui add all
npx blankui doctor               # check the setup, report edited or outdated components
npx blankui update               # update components and the AGENTS.md section
```

## init

- Writes `components.json` (shadcn compatible) with the `@blankui` registry.
- Adds `blankui.css` next to your main CSS file and imports it after `@import "tailwindcss"`.
- Adds `lib/utils.ts` with `cn()`.
- Writes a BlankUI section into `AGENTS.md` between `<!-- blankui:start -->` and `<!-- blankui:end -->`. Everything else in the file is kept.
- Makes `CLAUDE.md` import `AGENTS.md`, so Claude Code reads the same rules.
- Creates `eslint.config.mjs` with `@blankui/eslint-plugin`, or tells you what to add to your existing config.

## add

Copies each component and its `.md` file into your ui folder, along with the registry items it depends on. Existing files are kept unless you pass `--overwrite`.

## doctor and update

`blankui-lock.json` records what BlankUI wrote. `doctor` uses it to tell local edits apart from newer versions, and exits with code 1 when something needs fixing, so you can run it in CI. `update` never replaces a file you changed unless you pass `--force`.

## Options

- `--cwd <dir>`: project folder (default: current folder)
- `--registry <url>`: registry URL or a local folder (default: https://blank.vageshwar.dev)
- `--no-install`: print install commands instead of running them
