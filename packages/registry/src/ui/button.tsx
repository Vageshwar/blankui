// BlankUI: button. Managed by BlankUI. Read button.md before editing. Add variants here instead of overriding classes at call sites.
import type { ComponentProps } from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-edge bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border-edge bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        outline: "border-input bg-surface text-foreground shadow-sm hover:bg-surface-hover",
        ghost: "border-transparent text-foreground hover:bg-surface-hover",
        destructive:
          "border-edge bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm [&_svg]:size-4",
        default: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

/** Visual style. `default` is the main action, use one per view. */
export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
/** Height and padding. `icon` is a square button for a single icon. */
export type ButtonSize = "sm" | "default" | "lg" | "icon"

interface ButtonBaseProps extends Omit<ComponentProps<"button">, "aria-label"> {
  /** Visual style. Defaults to `default`. */
  variant?: ButtonVariant
  /** Render the child element (for example a link) with button styles. */
  asChild?: boolean
  /** Show a spinner, disable the button and set `aria-busy`. */
  loading?: boolean
}

interface TextButtonProps extends ButtonBaseProps {
  /** Size. Defaults to `default`. */
  size?: Exclude<ButtonSize, "icon">
  /** Accessible name. Not needed when the button has visible text. */
  "aria-label"?: string
}

interface IconButtonProps extends ButtonBaseProps {
  /** Square button for a single icon. */
  size: "icon"
  /** Required for icon buttons: screen readers announce this instead of the icon. */
  "aria-label": string
}

export type ButtonProps = TextButtonProps | IconButtonProps

/**
 * A clickable action. Defaults to `type="button"`, so it never submits a form by accident.
 * Pass `type="submit"` for form submit buttons.
 *
 * @example
 * <Button onClick={save}>Save</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button size="icon" aria-label="Close"><X /></Button>
 * <Button asChild variant="link"><a href="/docs">Docs</a></Button>
 */
export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} aria-busy={loading || undefined} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {loading && size === "icon" ? null : children}
    </button>
  )
}

export { buttonVariants }
