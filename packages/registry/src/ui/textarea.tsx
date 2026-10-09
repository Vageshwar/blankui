// BlankUI: textarea. Managed by BlankUI. Read textarea.md before editing. Wrap in <Field> for label and errors.
import type { ComponentProps } from "react"
import { useFieldControl } from "@/components/ui/field"
import { inputClasses } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * A multi-line text input. Put it inside <Field>.
 *
 * @example
 * <Field label="Message">
 *   <Textarea rows={4} />
 * </Field>
 */
export function Textarea({ className, rows = 3, ...props }: ComponentProps<"textarea">) {
  const wired = useFieldControl(props)
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(inputClasses, "min-h-16 py-2", className)}
      {...wired}
    />
  )
}
