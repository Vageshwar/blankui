---
name: card
title: Card
description: A bordered surface that groups related content, with header, content and footer parts.
category: display
whenToUse:
  - Group related content, like a settings section or a summary.
  - Items in a grid of projects, plans or stats.
whenNotToUse:
  - when: You only need space between elements.
    use: layout
  - when: Content should block the page until the user responds.
    use: dialog
  - when: Showing rows of data with the same fields.
    use: table
related: [layout, button]
requiredParts: [Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter]
antiPatterns:
  - avoid: '<div className="rounded-lg border p-6 shadow">'
    instead: "<Card>"
  - avoid: "A Card inside another Card"
    instead: "Use a Stack inside one Card, or separate Cards in a Grid"
  - avoid: '<CardContent className="p-6"> (adding padding)'
    instead: "<CardContent> already has padding"
---

# Card

## Import

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

## Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Choose what you want to hear about.</CardDescription>
  </CardHeader>
  <CardContent>
    <Stack gap={3}>...</Stack>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Card grid

```tsx
<Grid columns={{ base: 1, md: 3 }} gap={6}>
  {plans.map((plan) => (
    <Card key={plan.id}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.price}</CardDescription>
      </CardHeader>
    </Card>
  ))}
</Grid>
```

## Notes

- `CardTitle` renders an `h3`. Use `asChild` to pick another heading level: `<CardTitle asChild><h2>Billing</h2></CardTitle>`.
- Every part already has padding and spacing. Do not add `p-*` classes.
