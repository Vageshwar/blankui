---
name: popover
title: Popover
description: A small floating panel anchored to a button, for extra controls or details. Does not block the page.
category: overlay
whenToUse:
  - A few extra controls next to a button, like share settings or a date picker.
  - Details that appear on click and can be dismissed by clicking away.
whenNotToUse:
  - when: Only a short text hint.
    use: tooltip
  - when: A task that needs the user's full attention.
    use: dialog
  - when: Picking one option from a list.
    use: select
related: [tooltip, dialog, select]
requiredParts: [Popover, PopoverTrigger, PopoverContent]
antiPatterns:
  - avoid: "An absolutely positioned div toggled with useState"
    instead: "<Popover> handles position, focus and closing"
  - avoid: "Interactive content in a Tooltip"
    instead: "<Popover>"
---

# Popover

## Import

```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
```

## Example

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Share</Button>
  </PopoverTrigger>
  <PopoverContent align="end">
    <Stack gap={3}>
      <Field label="Link">
        <Input readOnly value={url} />
      </Field>
      <Button size="sm" onClick={copy}>
        Copy link
      </Button>
    </Stack>
  </PopoverContent>
</Popover>
```

`PopoverContent` takes `side` (`top | right | bottom | left`) and `align` (`start | center | end`).
