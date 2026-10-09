---
name: dialog
title: Dialog
description: A modal window for a focused task, like editing a record. Blocks the page until closed.
category: overlay
whenToUse:
  - A short focused task, like editing a profile or creating an item.
  - Content that needs the user's full attention before going back to the page.
whenNotToUse:
  - when: Asking the user to confirm a destructive or important action.
    use: alert-dialog
  - when: Long forms, filters or navigation that work better at the edge of the screen.
    use: sheet
  - when: A few extra controls next to a button, without blocking the page.
    use: popover
  - when: A short text hint on hover.
    use: tooltip
  - when: Telling the user something happened.
    use: toast
related: [alert-dialog, sheet, popover, button]
requiredParts: [Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose]
antiPatterns:
  - avoid: "<DialogHeader><DialogTitle>...</DialogTitle></DialogHeader> (shadcn style)"
    instead: '<DialogContent title="..." description="..."> (BlankUI renders the header)'
  - avoid: "A Dialog with no visible title"
    instead: '<DialogContent title="Search" hideTitle> keeps it for screen readers'
  - avoid: "Using Dialog to confirm a delete"
    instead: "<AlertDialog>"
  - avoid: "<DialogClose><Button>Cancel</Button></DialogClose> (a button inside a button)"
    instead: '<DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>'
---

# Dialog

The title is a prop on `DialogContent`, so a dialog can never be missing its accessible name. BlankUI does not export `DialogHeader`, `DialogTitle` or `DialogDescription`.

## Import

```tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
```

## Example

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Edit profile</Button>
  </DialogTrigger>
  <DialogContent title="Edit profile" description="Changes are saved when you click Save.">
    <Stack gap={4}>
      <Field label="Name">
        <Input defaultValue="Ada" />
      </Field>
    </Stack>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Controlled

```tsx
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent title="Invite people">...</DialogContent>
</Dialog>
```

## DialogContent props

- `title` (required), `description`
- `hideTitle`: keeps the title for screen readers only
- `size`: `sm`, `md` (default), `lg`
- `showCloseButton`: defaults to `true`
