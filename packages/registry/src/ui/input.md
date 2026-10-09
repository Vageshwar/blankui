---
name: input
title: Input
description: A single-line text input. Put it inside a Field for the label and errors.
category: form
whenToUse:
  - Short text like a name, email, password, number or URL.
whenNotToUse:
  - when: Text that can be several lines long.
    use: textarea
  - when: Picking one option from a known list.
    use: select
  - when: A yes or no choice.
    use: checkbox
related: [field, textarea, select]
requiredParts: [Input]
antiPatterns:
  - avoid: "<input className=...> (a raw input element)"
    instead: "<Input>"
  - avoid: "<Input> without a Field or aria-label"
    instead: '<Field label="Email"><Input type="email" /></Field>'
  - avoid: '<Input className="border-red-500"> to show an error'
    instead: '<Field label="Email" error="Enter a valid email">'
---

# Input

## Import

```tsx
import { Input } from "@/components/ui/input"
```

## Example

```tsx
<Field label="Email" error={errors.email}>
  <Input type="email" placeholder="you@example.com" />
</Field>
```

Sizes: `sm`, `default`, `lg`. All native input props work (`type`, `name`, `value`, `onChange`, `placeholder`, `disabled`).

An input without a visible label, like a toolbar search box, needs an `aria-label`:

```tsx
<Input type="search" aria-label="Search projects" placeholder="Search" />
```
