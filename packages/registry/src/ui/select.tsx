// BlankUI: select. Managed by BlankUI. Read select.md before editing. Wrap in <Field> for label and errors.
import type { ComponentProps } from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { Check, ChevronDown } from "lucide-react"
import { useFieldControl } from "@/components/ui/field"
import { cn } from "@/lib/utils"

/**
 * A dropdown to pick one option. Use `value` and `onValueChange`.
 *
 * @example
 * <Field label="Country">
 *   <Select value={country} onValueChange={setCountry}>
 *     <SelectTrigger>
 *       <SelectValue placeholder="Pick a country" />
 *     </SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="in">India</SelectItem>
 *       <SelectItem value="us">United States</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </Field>
 */
export function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/** Groups items under a SelectLabel. */
export function SelectGroup(props: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/** Shows the selected item, or the placeholder. */
export function SelectValue(props: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

export interface SelectTriggerProps extends ComponentProps<typeof SelectPrimitive.Trigger> {
  /** Height. Defaults to `default`. */
  size?: "sm" | "default"
}

/** The button that opens the list. Reads its id and error state from <Field>. */
export function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  // A button has no `required` attribute, so Field's required state becomes aria-required.
  const { required, ...wired } = useFieldControl<SelectTriggerProps & { required?: boolean }>(props)
  return (
    <SelectPrimitive.Trigger
      aria-required={required || undefined}
      data-slot="select-trigger"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-surface px-3 text-sm whitespace-nowrap text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-[placeholder]:text-muted-foreground [&>span]:truncate",
        size === "sm" ? "h-8" : "h-10",
        className,
      )}
      {...wired}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-60" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/** The floating list of items. */
export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-hidden rounded-md border bg-surface-raised text-foreground shadow-md",
          position === "popper" &&
            "w-full min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/** A heading for a SelectGroup. */
export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

/** One option. `value` must be a non-empty string. */
export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-hover",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

/** A line between groups. */
export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}
