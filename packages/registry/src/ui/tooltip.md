---
name: tooltip
title: Tooltip
description: A short text hint shown on hover and keyboard focus. Includes its own provider.
category: overlay
whenToUse:
  - Naming an icon-only button for sighted users.
  - A short hint of a few words.
whenNotToUse:
  - when: The content has links, buttons or inputs.
    use: popover
  - when: The information is needed to complete a task.
    use: field (put it in the description)
  - when: Long explanations.
    use: popover
related: [popover, button]
requiredParts: [Tooltip, TooltipTrigger, TooltipContent]
antiPatterns:
  - avoid: "<TooltipProvider> around the app"
    instead: "Nothing. Each Tooltip has its own provider."
  - avoid: 'title="..." attributes for hints'
    instead: "<Tooltip>"
  - avoid: "A Tooltip as the only label of an icon button"
    instead: "Give the Button an aria-label as well"
---

# Tooltip

No `TooltipProvider` is needed. The trigger must be focusable, so use `asChild` with a Button.

## Import

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
```

## Example

```tsx
import { Copy } from "lucide-react"

;<Tooltip>
  <TooltipTrigger asChild>
    <Button size="icon" variant="ghost" aria-label="Copy">
      <Copy />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Copy to clipboard</TooltipContent>
</Tooltip>
```
