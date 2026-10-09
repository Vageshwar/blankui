---
name: textarea
title: Textarea
description: A multi-line text input. Put it inside a Field for the label and errors.
category: form
whenToUse:
  - Text that can span several lines, like a message, bio or description.
whenNotToUse:
  - when: A single line of text.
    use: input
related: [field, input]
requiredParts: [Textarea]
antiPatterns:
  - avoid: "<textarea className=...> (a raw textarea element)"
    instead: "<Textarea>"
---

# Textarea

## Import

```tsx
import { Textarea } from "@/components/ui/textarea"
```

## Example

```tsx
<Field label="Message" description="Up to 500 characters.">
  <Textarea rows={5} maxLength={500} />
</Field>
```
