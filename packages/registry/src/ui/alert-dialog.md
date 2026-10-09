---
name: alert-dialog
title: Alert Dialog
description: A confirmation the user must answer, for destructive or important actions. Clicking outside does not close it.
category: overlay
whenToUse:
  - Confirming a delete or another action that cannot be undone.
  - Warning about losing unsaved changes.
whenNotToUse:
  - when: A task with form fields.
    use: dialog
  - when: The action can be undone easily.
    use: toast
related: [dialog, button]
requiredParts:
  [
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
  ]
antiPatterns:
  - avoid: "window.confirm('Are you sure?')"
    instead: "<AlertDialog>"
  - avoid: '<AlertDialogAction className="bg-destructive">'
    instead: "<AlertDialogAction destructive>"
  - avoid: 'A vague title like "Are you sure?"'
    instead: 'Name the action: "Delete this project?"'
---

# Alert Dialog

`title` and `description` are both required. Cancel gets focus when it opens, so pressing Enter by accident does not confirm.

## Import

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
```

## Example

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent
    title="Delete this project?"
    description="All files and settings will be removed. This cannot be undone."
  >
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction destructive onClick={deleteProject}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
