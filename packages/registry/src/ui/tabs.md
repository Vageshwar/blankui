---
name: tabs
title: Tabs
description: Switch between views of related content in the same place, like Account and Billing settings.
category: navigation
whenToUse:
  - Two to six views of related content where the user looks at one at a time.
whenNotToUse:
  - when: Moving between pages with their own URL.
    use: links in your navigation
  - when: Steps the user must go through in order.
    use: a step-by-step form with Buttons
  - when: Picking a value for a form.
    use: select
related: [select, card]
requiredParts: [Tabs, TabsList, TabsTrigger, TabsContent]
antiPatterns:
  - avoid: "Buttons that set state and show different divs"
    instead: "<Tabs> handles keyboard navigation and ARIA roles"
  - avoid: "A TabsTrigger without a TabsContent of the same value"
    instead: "One TabsContent per TabsTrigger"
---

# Tabs

Built on Radix. Arrow keys move between tabs. Use `defaultValue`, or `value` with `onValueChange` to control it.

## Import

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

## Example

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>...</Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>...</Card>
  </TabsContent>
</Tabs>
```
