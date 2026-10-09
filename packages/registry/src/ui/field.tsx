// BlankUI: field. Managed by BlankUI. Read field.md before editing. Controls read their wiring from this context.
import { createContext, useContext, useId, useLayoutEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FieldContextValue {
  controlId: string
  /** Lets a control that sets its own `id` point the label at it. */
  setControlId: (id: string | undefined) => void
  descriptionId: string | undefined
  errorId: string | undefined
  invalid: boolean
  required: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export interface FieldProps {
  /** Visible label for the control. Always required, even if it seems obvious. */
  label: ReactNode
  /** Help text shown under the label. */
  description?: ReactNode
  /** Error message. When set, the control is marked invalid and the message is announced. */
  error?: ReactNode
  /** Marks the control as required and shows an indicator next to the label. */
  required?: boolean
  /** `vertical` puts the label above the control. Use `horizontal` for Checkbox. Defaults to `vertical`. */
  orientation?: "vertical" | "horizontal"
  /** Id for the control. Generated when not set. */
  id?: string
  className?: string
  /** Exactly one control: Input, Textarea, Select or Checkbox. */
  children: ReactNode
}

/**
 * Wraps one form control with a label, help text and an error message, and wires them up
 * (id, htmlFor, aria-describedby, aria-invalid, required). Works with any form library.
 *
 * @example
 * <Field label="Email" description="We never share it." error={errors.email?.message} required>
 *   <Input type="email" {...register("email")} />
 * </Field>
 */
export function Field({
  label,
  description,
  error,
  required = false,
  orientation = "vertical",
  id,
  className,
  children,
}: FieldProps) {
  const autoId = useId()
  const [childId, setControlId] = useState<string | undefined>(undefined)
  const controlId = childId ?? id ?? `field${autoId.replace(/:/g, "")}`
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const invalid = Boolean(error)

  const labelNode = (
    <label htmlFor={controlId} className="text-sm leading-none font-medium text-foreground">
      {label}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
  const descriptionNode = description && (
    <p id={descriptionId} className="text-sm text-muted-foreground">
      {description}
    </p>
  )
  const errorNode = error && (
    <p id={errorId} className="text-sm font-medium text-destructive">
      {error}
    </p>
  )

  return (
    <FieldContext value={{ controlId, setControlId, descriptionId, errorId, invalid, required }}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        className={cn("flex flex-col gap-2", className)}
      >
        {orientation === "vertical" ? (
          <>
            {labelNode}
            {children}
            {descriptionNode}
          </>
        ) : (
          <div className="flex items-start gap-3">
            {children}
            <div className="flex flex-col gap-1.5">
              {labelNode}
              {descriptionNode}
            </div>
          </div>
        )}
        {errorNode}
      </div>
    </FieldContext>
  )
}

interface ControlA11yProps {
  id?: string
  required?: boolean
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling"
}

/**
 * Merge Field wiring into a control's props. Props set directly on the control win.
 * Used by Input, Textarea, Select and Checkbox. Use it when you build a new control.
 */
export function useFieldControl<P extends ControlA11yProps>(props: P): P {
  const field = useContext(FieldContext)
  const ownId = props.id
  const setControlId = field?.setControlId
  useLayoutEffect(() => {
    if (!setControlId || !ownId) return
    setControlId(ownId)
    return () => setControlId(undefined)
  }, [setControlId, ownId])
  if (!field) return props
  const describedBy = [props["aria-describedby"], field.descriptionId, field.errorId]
    .filter(Boolean)
    .join(" ")
  return {
    ...props,
    id: props.id ?? field.controlId,
    required: props.required ?? (field.required || undefined),
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
  }
}
