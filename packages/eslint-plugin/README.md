# @blankui/eslint-plugin

ESLint rules that keep code inside the [BlankUI](https://blank.vageshwar.dev) design system. Every message says what to use instead, because coding agents act on the exact text of lint errors.

## Install

`npx blankui init` sets this up for you. To do it by hand:

```bash
npm install -D @blankui/eslint-plugin typescript-eslint
```

```js
// eslint.config.js
import tseslint from "typescript-eslint"
import blankui from "@blankui/eslint-plugin"

export default tseslint.config(...tseslint.configs.recommended, ...blankui.configs.recommended)
```

The recommended config applies to `.jsx` and `.tsx` files and skips `components/ui`, where the BlankUI components themselves use Radix and raw elements.

## Rules

| Rule                       | Default | What it reports                                                |
| -------------------------- | ------- | -------------------------------------------------------------- |
| `no-palette-colors`        | error   | `bg-blue-500`, `text-white` (they render nothing in BlankUI)   |
| `no-arbitrary-values`      | error   | `mt-[13px]`, `w-[372px]`, `bg-[#fff]`                          |
| `no-inline-color`          | error   | `style={{ color: "red" }}`                                     |
| `prefer-component`         | error   | raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>` |
| `no-direct-radix`          | error   | imports from `radix-ui`, `@radix-ui/*` and `sonner`            |
| `prefer-layout-primitives` | warn    | `flex flex-col gap-4`, `space-y-6`, `grid grid-cols-3 gap-6`   |
| `no-nested-card`           | warn    | a `Card` inside another `Card`                                 |

Example messages:

```
`bg-blue-500` does not exist in BlankUI (the Tailwind palette is removed, so it renders nothing). Use a semantic token: bg-background, bg-surface, bg-muted, bg-primary, ...
Use <Stack gap={4}> from "@/components/ui/layout" instead of `flex flex-col gap-4`.
Use <Button> from "@/components/ui/button" instead of <button>. It has the right styles, states and accessibility built in.
```
