---
name: button
title: Button
description: A clickable action. Supports variants, sizes, icon-only buttons, loading state and links.
category: action
whenToUse:
  - Trigger an action like save, submit, delete or open a dialog.
  - Style a link as a button with asChild.
whenNotToUse:
  - when: Navigating to another page inside text.
    use: a plain link (<a> or your router's Link)
  - when: Switching between views of the same content.
    use: tabs
  - when: Toggling a setting on or off.
    use: checkbox
related: [layout, card, dialog, alert-dialog]
requiredParts: [Button]
antiPatterns:
  - avoid: "<button className=...> (a raw button element)"
    instead: "<Button>"
  - avoid: '<Button className="bg-red-500">'
    instead: '<Button variant="destructive">'
  - avoid: '<Button size="icon"><Trash /></Button> without a label'
    instead: '<Button size="icon" aria-label="Delete"><Trash /></Button>'
  - avoid: "<Button><a href=...>Docs</a></Button> (a link inside a button)"
    instead: '<Button asChild><a href="/docs">Docs</a></Button>'
  - avoid: "{isSaving ? <Spinner /> : 'Save'} with disabled={isSaving}"
    instead: "<Button loading={isSaving}>Save</Button>"
  - avoid: "Several default (primary) buttons side by side"
    instead: 'One default button, the rest variant="outline" or "ghost"'
---

# Button

## Import

```tsx
import { Button } from "@/components/ui/button"
```

## Variants

| Variant       | Use for                                       |
| ------------- | --------------------------------------------- |
| `default`     | The main action in a view. One per view.      |
| `secondary`   | A second, less important action.              |
| `outline`     | Cancel, back, and other neutral actions.      |
| `ghost`       | Toolbar and icon actions with little weight.  |
| `destructive` | Delete or other actions that cannot be undone |
| `link`        | An action that should look like a link.       |

Sizes: `sm`, `default`, `lg`, `icon`.

## Examples

```tsx
<Inline gap={2} justify="end">
  <Button variant="outline">Cancel</Button>
  <Button type="submit" loading={isSaving}>
    Save changes
  </Button>
</Inline>
```

Icon buttons must have an `aria-label`. TypeScript reports an error without it.

```tsx
import { Trash } from "lucide-react"

;<Button size="icon" variant="ghost" aria-label="Delete project">
  <Trash />
</Button>
```

Icons next to text go before the text:

```tsx
import { Plus } from "lucide-react"

;<Button>
  <Plus /> New project
</Button>
```

Links that look like buttons:

```tsx
<Button asChild variant="outline">
  <a href="/pricing">See pricing</a>
</Button>
```

## Notes

- `type` defaults to `"button"`, so a Button inside a form does not submit it. Use `type="submit"` for the submit button.
- `loading` shows a spinner, disables the button and sets `aria-busy`.
