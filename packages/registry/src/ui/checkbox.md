---
name: checkbox
title: Checkbox
description: A checkbox for a yes or no choice, or for picking several items from a list.
category: form
whenToUse:
  - A single yes or no choice, like agreeing to terms.
  - Picking several options from a short list.
whenNotToUse:
  - when: Picking exactly one option from a list.
    use: select
  - when: Triggering an action right away.
    use: button
related: [field, select]
requiredParts: [Checkbox]
antiPatterns:
  - avoid: '<input type="checkbox">'
    instead: "<Checkbox>"
  - avoid: "onChange={(e) => setValue(e.target.checked)}"
    instead: "onCheckedChange={(checked) => setValue(checked === true)}"
  - avoid: '<Field label="..."> (vertical) around a Checkbox'
    instead: '<Field label="..." orientation="horizontal">'
---

# Checkbox

Built on Radix. Use `checked` and `onCheckedChange`, not `onChange`. The value can be `true`, `false` or `"indeterminate"`.

## Import

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

## Example

```tsx
<Field label="Send me product updates" orientation="horizontal">
  <Checkbox checked={updates} onCheckedChange={(checked) => setUpdates(checked === true)} />
</Field>
```

## In a form

```tsx
<Field label="I agree to the terms" orientation="horizontal" required>
  <Checkbox name="terms" value="yes" />
</Field>
```
