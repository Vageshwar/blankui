---
name: field
title: Field
description: Wraps one form control with a label, help text and an error message, and wires up the accessibility attributes.
category: form
whenToUse:
  - Every form control that needs a visible label. That is almost all of them.
  - Showing validation errors from any form library (react-hook-form, TanStack Form, server actions, plain state).
whenNotToUse:
  - when: A search box in a toolbar with no visible label.
    use: an Input with aria-label
related: [input, textarea, select, checkbox, layout]
requiredParts: [Field, useFieldControl]
antiPatterns:
  - avoid: '<label htmlFor="email">Email</label><Input id="email" />'
    instead: '<Field label="Email"><Input /></Field>'
  - avoid: '{error && <p className="text-red-500">{error}</p>} under an input'
    instead: '<Field label="Email" error={error}>'
  - avoid: "Setting aria-invalid or aria-describedby by hand"
    instead: "Field sets them from the error and description props"
  - avoid: "Placeholder text instead of a label"
    instead: "A label prop, plus a placeholder only for an example value"
---

# Field

Field renders the label, help text and error for one control, and passes `id`, `aria-describedby`, `aria-invalid` and `required` to the control inside it. Input, Textarea, Select and Checkbox all read this automatically.

## Import

```tsx
import { Field } from "@/components/ui/field"
```

## Example

```tsx
<form onSubmit={handleSubmit}>
  <Stack gap={4}>
    <Field label="Email" description="We never share your email." error={errors.email} required>
      <Input type="email" name="email" />
    </Field>
    <Field label="Plan">
      <Select name="plan" defaultValue="pro">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
    </Field>
    <Field label="I agree to the terms" orientation="horizontal">
      <Checkbox name="terms" />
    </Field>
    <Button type="submit">Create account</Button>
  </Stack>
</form>
```

## With react-hook-form

```tsx
const { register, formState: { errors } } = useForm<FormValues>()

<Field label="Name" error={errors.name?.message} required>
  <Input {...register("name", { required: "Name is required" })} />
</Field>
```

## Props

- `label` (required): visible label text.
- `description`: help text under the label.
- `error`: error message. Marks the control invalid.
- `required`: marks the control required and shows `*`.
- `orientation`: `vertical` (default) or `horizontal`. Use `horizontal` for Checkbox.
- `id`: control id. Generated when not set.

## Building a new control

Call `useFieldControl(props)` in your control and spread the result onto the element. It adds the Field wiring and keeps any props you set directly.
