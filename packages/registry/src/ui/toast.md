---
name: toast
title: Toast
description: A short message that appears for a few seconds after something happens, like "Saved". Built on sonner.
category: feedback
whenToUse:
  - Confirming an action finished, like saving or copying.
  - Reporting an error from a background action, with an optional Retry action.
  - Offering Undo after an action that is easy to reverse.
whenNotToUse:
  - when: Asking the user to confirm before an action.
    use: alert-dialog
  - when: A validation error on a form field.
    use: field (use the error prop)
  - when: Information the user must read or act on.
    use: dialog
related: [alert-dialog, field, button]
requiredParts: [Toaster, toast]
antiPatterns:
  - avoid: 'import { toast } from "sonner" in app code'
    instead: 'import { toast } from "@/components/ui/toast"'
  - avoid: "useToast() hook (old shadcn toast)"
    instead: "toast() from @/components/ui/toast"
  - avoid: "Several <Toaster /> elements"
    instead: "One <Toaster /> in the root layout"
  - avoid: "alert('Saved')"
    instead: 'toast.success("Saved")'
---

# Toast

Built on [sonner](https://sonner.emilkowal.ski). Render one `<Toaster />` in the root layout, then call `toast()` anywhere, including outside React components.

## Import

```tsx
import { Toaster, toast } from "@/components/ui/toast"
```

## Setup

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="default" data-mode="light">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

## Examples

```tsx
toast("Link copied")
toast.success("Project created", { description: "Invite your team next." })
toast.error("Could not save changes", { action: { label: "Retry", onClick: save } })
toast("Message archived", { action: { label: "Undo", onClick: unarchive } })
```

Promise toasts:

```tsx
toast.promise(saveProject(), {
  loading: "Saving...",
  success: "Saved",
  error: "Could not save",
})
```
