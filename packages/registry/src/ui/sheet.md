---
name: sheet
title: Sheet
description: A panel that slides in from an edge of the screen, for filters, settings, details or mobile navigation.
category: overlay
whenToUse:
  - Filters or settings next to a list the user still wants to see.
  - Details of a selected row or item.
  - Navigation menus on small screens.
whenNotToUse:
  - when: A short focused task in the middle of the screen.
    use: dialog
  - when: Confirming a destructive action.
    use: alert-dialog
  - when: A few controls next to a button.
    use: popover
related: [dialog, popover]
requiredParts: [Sheet, SheetTrigger, SheetContent, SheetFooter, SheetClose]
antiPatterns:
  - avoid: "<SheetHeader><SheetTitle>...</SheetTitle></SheetHeader> (shadcn style)"
    instead: '<SheetContent title="...">'
  - avoid: "A fixed-position div with a slide animation"
    instead: "<Sheet> handles focus, Escape and scroll lock"
---

# Sheet

Same API as Dialog, plus `side`. The title is a prop on `SheetContent`.

## Import

```tsx
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
```

## Example

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent side="right" title="Filters" description="Narrow down the list.">
    <Stack gap={4}>
      <Field label="Status">
        <Select defaultValue="open">...</Select>
      </Field>
    </Stack>
    <SheetFooter>
      <SheetClose asChild>
        <Button>Apply</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

`side`: `right` (default), `left`, `top`, `bottom`.
