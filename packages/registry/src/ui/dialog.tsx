// BlankUI: dialog. Managed by BlankUI. Read dialog.md before editing. The title is a prop on DialogContent, on purpose.
import type { ComponentProps, ReactNode } from "react"
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A modal window. Use `open` and `onOpenChange` to control it, or let DialogTrigger open it.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Edit profile</Button>
 *   </DialogTrigger>
 *   <DialogContent title="Edit profile" description="Changes are saved when you click Save.">
 *     <Stack gap={4}>...</Stack>
 *     <DialogFooter>
 *       <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
 *       <Button type="submit">Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */
export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/** Opens the dialog. Use `asChild` with a Button. */
export function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/** Closes the dialog. Use `asChild` with a Button. */
export function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export interface DialogContentProps extends Omit<
  ComponentProps<typeof DialogPrimitive.Content>,
  "title"
> {
  /** Required. The dialog heading, also used as its accessible name. */
  title: ReactNode
  /** Short text under the title, also used as the accessible description. */
  description?: ReactNode
  /** Hide the title visually but keep it for screen readers. */
  hideTitle?: boolean
  /** Show the X button in the corner. Defaults to `true`. */
  showCloseButton?: boolean
  /** Width. Defaults to `md`. */
  size?: "sm" | "md" | "lg"
}

const sizeClass = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const

/** The dialog window. Renders the title and description for you. */
export function DialogContent({
  title,
  description,
  hideTitle = false,
  showCloseButton = true,
  size = "md",
  className,
  children,
  ...props
}: DialogContentProps) {
  const heading = (
    <DialogPrimitive.Title className="font-heading text-lg leading-tight font-semibold">
      {title}
    </DialogPrimitive.Title>
  )
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-overlay motion-safe:data-[state=open]:animate-fade-in"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        // Without a description, opt out of Radix's missing-description warning.
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "fixed inset-x-4 top-1/2 z-50 mx-auto flex max-h-9/10 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-lg border bg-surface-raised p-6 text-foreground shadow-lg motion-safe:data-[state=open]:animate-scale-in",
          sizeClass[size],
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1.5 pr-6">
          {hideTitle ? <VisuallyHidden.Root>{heading}</VisuallyHidden.Root> : heading}
          {description && (
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute top-4 right-4 cursor-pointer rounded-sm p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

/** Buttons at the bottom of the dialog. The main action goes last. */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}
