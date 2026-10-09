// BlankUI: toast. Managed by BlankUI. Read toast.md before editing. Render <Toaster /> once, call toast() anywhere.
import type { ComponentProps } from "react"
import { Toaster as Sonner, toast } from "sonner"

/**
 * Renders toasts. Put it once in your root layout. Then call `toast()` from anywhere.
 *
 * @example
 * // app/layout.tsx
 * <body>
 *   {children}
 *   <Toaster />
 * </body>
 */
export function Toaster({ position = "bottom-right", ...props }: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      position={position}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 rounded-lg border bg-surface-raised p-4 text-sm text-foreground shadow-lg",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton:
            "ml-auto shrink-0 cursor-pointer rounded-md border border-edge bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
          cancelButton:
            "shrink-0 cursor-pointer rounded-md border border-input bg-surface px-3 py-1.5 text-xs font-medium",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-destructive",
          warning: "[&_[data-icon]]:text-warning",
        },
      }}
      {...props}
    />
  )
}

/**
 * Show a toast. Re-exported from sonner.
 *
 * @example
 * toast("Saved")
 * toast.success("Project created", { description: "You can invite people now." })
 * toast.error("Could not save", { action: { label: "Retry", onClick: save } })
 */
export { toast }
