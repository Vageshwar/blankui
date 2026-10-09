---
name: layout
title: Layout
description: Stack, Inline, Grid and Container. Use them for all spacing between elements.
category: layout
whenToUse:
  - Any vertical list of elements with space between them (Stack).
  - Rows of buttons, tags, or icon and text pairs (Inline).
  - Card grids, stat rows and multi-column forms (Grid).
  - The outer width and side padding of a page or page section (Container).
whenNotToUse:
  - when: You need space inside an element, like padding in a card.
    use: card
  - when: You are laying out a data table.
    use: table
related: []
requiredParts: [Stack, Inline, Grid, Container]
antiPatterns:
  - avoid: '<div className="flex flex-col gap-4">'
    instead: "<Stack gap={4}>"
  - avoid: '<div className="space-y-6">'
    instead: "<Stack gap={6}>"
  - avoid: '<div className="flex items-center gap-2">'
    instead: "<Inline gap={2}>"
  - avoid: '<div className="grid grid-cols-1 md:grid-cols-3 gap-6">'
    instead: "<Grid columns={{ base: 1, md: 3 }} gap={6}>"
  - avoid: '<div className="mx-auto max-w-6xl px-4">'
    instead: "<Container>"
  - avoid: "gap={5} or gap={10}"
    instead: "Use a step from the scale: 1, 2, 3, 4, 6, 8, 12."
---

# Layout

Four primitives handle all layout spacing. They only accept steps from the spacing scale, so pages stay consistent.

| Component   | Direction  | Default gap | Use for                          |
| ----------- | ---------- | ----------- | -------------------------------- |
| `Stack`     | vertical   | 4           | sections, forms, lists           |
| `Inline`    | horizontal | 2           | button rows, tags, toolbars      |
| `Grid`      | columns    | 4           | card grids, multi-column layouts |
| `Container` | none       | none        | page width and side padding      |

Spacing scale: `1 | 2 | 3 | 4 | 6 | 8 | 12` (4 = 1rem).

## Import

```tsx
import { Stack, Inline, Grid, Container } from "@/components/ui/layout"
```

## Page layout

```tsx
<Container size="md">
  <Stack gap={8}>
    <Stack gap={2}>
      <h1 className="font-heading text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your account.</p>
    </Stack>
    <Grid columns={{ base: 1, md: 2 }} gap={6}>
      <Card>...</Card>
      <Card>...</Card>
    </Grid>
    <Inline gap={2} justify="end">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </Inline>
  </Stack>
</Container>
```

## Semantic elements

Use `asChild` to render a different element:

```tsx
<Stack asChild gap={2}>
  <ul>
    <li>One</li>
    <li>Two</li>
  </ul>
</Stack>
```

## Props

- `Stack`: `gap`, `align` (`start | center | end | stretch | baseline`), `justify` (`start | center | end | between`), `asChild`
- `Inline`: same as Stack, plus `wrap` (default `true`). `align` defaults to `center`.
- `Grid`: `columns` (`1 | 2 | 3 | 4 | 6 | 12`, or `{ base, sm, md, lg, xl }`), `gap`, `asChild`
- `Container`: `size` (`sm | md | lg | xl | full`, default `lg`), `asChild`
