---
name: select
title: Select
description: A dropdown for picking one option from a list. Put it inside a Field for the label and errors.
category: form
whenToUse:
  - Picking one option from a list of about 4 to 20 items.
whenNotToUse:
  - when: Picking several options.
    use: checkbox
  - when: The list has only 2 or 3 options that should all be visible.
    use: checkbox
  - when: Showing a menu of actions.
    use: popover
related: [field, checkbox, input]
requiredParts: [Select, SelectTrigger, SelectValue, SelectContent, SelectItem]
antiPatterns:
  - avoid: "<select><option>...</option></select> (a raw select element)"
    instead: "<Select> with SelectTrigger, SelectValue, SelectContent and SelectItem"
  - avoid: "onChange={(e) => setValue(e.target.value)}"
    instead: "onValueChange={setValue}"
  - avoid: '<SelectItem value="">None</SelectItem>'
    instead: "Leave the Select empty and use the SelectValue placeholder"
---

# Select

Built on Radix. Use `value` and `onValueChange` (or `defaultValue`). Item values must be non-empty strings.

## Import

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

## Example

```tsx
<Field label="Role">
  <Select value={role} onValueChange={setRole}>
    <SelectTrigger>
      <SelectValue placeholder="Pick a role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="member">Member</SelectItem>
      <SelectItem value="viewer">Viewer</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

## Groups

```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Fruits</SelectLabel>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Vegetables</SelectLabel>
    <SelectItem value="carrot">Carrot</SelectItem>
  </SelectGroup>
</SelectContent>
```

Pass `name` to `Select` to include the value in a native form submit.
