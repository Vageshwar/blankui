// BlankUI: checkbox. Managed by BlankUI. Read checkbox.md before editing. Wrap in <Field orientation="horizontal">.
import type { ComponentProps } from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check, Minus } from "lucide-react"
import { useFieldControl } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>

/**
 * A checkbox. Use `checked` and `onCheckedChange` (not `onChange`).
 * `checked` can be `true`, `false` or `"indeterminate"`.
 *
 * @example
 * <Field label="Email me about new features" orientation="horizontal">
 *   <Checkbox checked={subscribed} onCheckedChange={(v) => setSubscribed(v === true)} />
 * </Field>
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  const wired = useFieldControl(props)
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer rounded-sm border border-input bg-surface shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className,
      )}
      {...wired}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {props.checked === "indeterminate" ? (
          <Minus className="size-3.5" />
        ) : (
          <Check className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
