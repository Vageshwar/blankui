// BlankUI: popover. Managed by BlankUI. Read popover.md before editing.
import type { ComponentProps } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * A small floating panel anchored to a trigger, for extra controls or details. It does not block the page.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Share</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <Stack gap={3}>...</Stack>
 *   </PopoverContent>
 * </Popover>
 */
export function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** Opens the popover. Use `asChild` with a Button. */
export function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/** Positions the popover against an element other than the trigger. */
export function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

/** The floating panel. Use `align` and `side` to position it. */
export function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-surface-raised p-4 text-foreground shadow-md outline-none motion-safe:data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
