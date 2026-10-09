// BlankUI: sheet. Managed by BlankUI. Read sheet.md before editing. The title is a prop on SheetContent, on purpose.
import type { ComponentProps, ReactNode } from "react"
import { Dialog as SheetPrimitive, VisuallyHidden } from "radix-ui"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A panel that slides in from the edge of the screen. Same API as Dialog, plus `side`.
 *
 * @example
 * <Sheet>
 *   <SheetTrigger asChild>
 *     <Button variant="outline">Filters</Button>
 *   </SheetTrigger>
 *   <SheetContent side="right" title="Filters">
 *     <Stack gap={4}>...</Stack>
 *   </SheetContent>
 * </Sheet>
 */
export function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/** Opens the sheet. Use `asChild` with a Button. */
export function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/** Closes the sheet. Use `asChild` with a Button. */
export function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const sideClass = {
  right:
    "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l motion-safe:data-[state=open]:animate-slide-in-right",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r motion-safe:data-[state=open]:animate-slide-in-left",
  top: "inset-x-0 top-0 max-h-9/10 border-b motion-safe:data-[state=open]:animate-slide-in-top",
  bottom:
    "inset-x-0 bottom-0 max-h-9/10 border-t motion-safe:data-[state=open]:animate-slide-in-bottom",
} as const

export interface SheetContentProps extends Omit<
  ComponentProps<typeof SheetPrimitive.Content>,
  "title"
> {
  /** Required. The sheet heading, also used as its accessible name. */
  title: ReactNode
  /** Short text under the title. */
  description?: ReactNode
  /** Hide the title visually but keep it for screen readers. */
  hideTitle?: boolean
  /** Edge the sheet slides in from. Defaults to `right`. */
  side?: keyof typeof sideClass
  /** Show the X button in the corner. Defaults to `true`. */
  showCloseButton?: boolean
}

/** The sliding panel. Renders the title and description for you. */
export function SheetContent({
  title,
  description,
  hideTitle = false,
  side = "right",
  showCloseButton = true,
  className,
  children,
  ...props
}: SheetContentProps) {
  const heading = (
    <SheetPrimitive.Title className="font-heading text-lg leading-tight font-semibold">
      {title}
    </SheetPrimitive.Title>
  )
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-overlay motion-safe:data-[state=open]:animate-fade-in"
      />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "fixed z-50 flex flex-col gap-4 overflow-y-auto bg-surface-raised p-6 text-foreground shadow-lg",
          sideClass[side],
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1.5 pr-6">
          {hideTitle ? <VisuallyHidden.Root>{heading}</VisuallyHidden.Root> : heading}
          {description && (
            <SheetPrimitive.Description className="text-sm text-muted-foreground">
              {description}
            </SheetPrimitive.Description>
          )}
        </div>
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className="absolute top-4 right-4 cursor-pointer rounded-sm p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

/** Actions pinned to the bottom of the sheet. */
export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  )
}
