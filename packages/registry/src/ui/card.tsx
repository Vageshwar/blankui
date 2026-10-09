// BlankUI: card. Managed by BlankUI. Read card.md before editing. Do not nest cards.
import type { ComponentProps } from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * A bordered surface that groups related content.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Team</CardTitle>
 *     <CardDescription>Invite people to your workspace.</CardDescription>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter><Button>Invite</Button></CardFooter>
 * </Card>
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-lg border bg-surface py-6 text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

/** Holds the title, description and an optional action. */
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

export interface CardTitleProps extends ComponentProps<"h3"> {
  /** Render the child element instead of an `h3`, for example an `h2` when the card is a page section. */
  asChild?: boolean
}

/** The card heading. Renders an `h3` by default. */
export function CardTitle({ asChild = false, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot.Root : "h3"
  return (
    <Comp
      data-slot="card-title"
      className={cn("font-heading text-lg leading-tight font-semibold", className)}
      {...props}
    />
  )
}

/** Short supporting text under the title. */
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** The main body of the card. */
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

/** Actions at the bottom of the card, laid out in a row. */
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6", className)}
      {...props}
    />
  )
}
