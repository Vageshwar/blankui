// BlankUI: input. Managed by BlankUI. Read input.md before editing. Wrap in <Field> for label and errors.
import type { ComponentProps } from "react"
import { useFieldControl } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export const inputClasses =
  "flex w-full min-w-0 rounded-md border border-input bg-surface px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:outline-destructive"

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  /** Height. Defaults to `default`. */
  size?: "sm" | "default" | "lg"
}

const sizeClass = { sm: "h-8", default: "h-10", lg: "h-12 text-base" } as const

/**
 * A single-line text input. Put it inside <Field> so it gets a label, help text and error wiring.
 *
 * @example
 * <Field label="Name">
 *   <Input placeholder="Ada Lovelace" />
 * </Field>
 */
export function Input({ size = "default", className, type = "text", ...props }: InputProps) {
  const wired = useFieldControl(props)
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        inputClasses,
        sizeClass[size],
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...wired}
    />
  )
}
