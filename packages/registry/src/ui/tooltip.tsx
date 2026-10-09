// BlankUI: tooltip. Managed by BlankUI. Read tooltip.md before editing. No provider needed.
import type { ComponentProps } from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * A short text hint shown on hover and focus. Includes its own provider, so no TooltipProvider is needed.
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button size="icon" variant="ghost" aria-label="Copy link"><Link /></Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Copy link</TooltipContent>
 * </Tooltip>
 */
export function Tooltip({
  delayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Root> & { delayDuration?: number }) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipPrimitive.Provider>
  )
}

/** The element that shows the tooltip. Use `asChild` with a focusable element like a Button. */
export function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/** The hint text. Keep it to a few words. */
export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md motion-safe:animate-fade-in",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}
