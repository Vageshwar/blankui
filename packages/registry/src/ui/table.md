---
name: table
title: Table
description: A data table for rows of items with the same fields, like invoices or users.
category: display
whenToUse:
  - Rows of records with the same columns that people compare or scan.
whenNotToUse:
  - when: Laying out a page in columns.
    use: layout
  - when: A few items with different content each.
    use: card
related: [card, layout]
requiredParts:
  [Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter]
antiPatterns:
  - avoid: "A grid of divs that looks like a table"
    instead: "<Table> so screen readers can read rows and columns"
  - avoid: "<table className=...> (a raw table element)"
    instead: "<Table>"
  - avoid: "TableHead cells inside TableBody"
    instead: "TableHead in TableHeader, TableCell in TableBody"
---

# Table

Plain HTML table parts with BlankUI styles. For sorting and filtering, use a library like TanStack Table and render with these parts.

## Import

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

## Example

```tsx
<Table>
  <TableCaption>Team members</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {members.map((m) => (
      <TableRow key={m.id}>
        <TableCell className="font-medium">{m.name}</TableCell>
        <TableCell>{m.role}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="ghost">
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```
