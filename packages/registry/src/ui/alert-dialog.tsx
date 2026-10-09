// BlankUI: alert-dialog. Managed by BlankUI. Read alert-dialog.md before editing. Title and description are required, on purpose.
import type { ComponentProps, ReactNode } from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * A confirmation that the user must answer before going on, for example before deleting something.
 * Clicking outside does not close it.
 *
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">Delete project</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent title="Delete this project?" description="This removes all its data and cannot be undone.">
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction destructive onClick={deleteProject}>Delete</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 */
export function AlertDialog(props: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/** Opens the alert dialog. Use `asChild` with a Button. */
export function AlertDialogTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

export interface AlertDialogContentProps extends Omit<
  ComponentProps<typeof AlertDialogPrimitive.Content>,
  "title"
> {
  /** Required. The question, for example "Delete this project?". */
  title: ReactNode
  /** Required. What happens if the user confirms. */
  description: ReactNode
}

/** The confirmation window. Renders the title and description for you. */
export function AlertDialogContent({
  title,
  description,
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-50 bg-overlay motion-safe:data-[state=open]:animate-fade-in"
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed inset-x-4 top-1/2 z-50 mx-auto flex max-w-md -translate-y-1/2 flex-col gap-4 rounded-lg border bg-surface-raised p-6 text-foreground shadow-lg motion-safe:data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1.5">
          <AlertDialogPrimitive.Title className="font-heading text-lg leading-tight font-semibold">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="text-sm text-muted-foreground">
            {description}
          </AlertDialogPrimitive.Description>
        </div>
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}

/** Holds Cancel and the action. The action goes last. */
export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

export interface AlertDialogActionProps extends ComponentProps<typeof AlertDialogPrimitive.Action> {
  /** Use the destructive style, for delete and other actions that cannot be undone. */
  destructive?: boolean
}

/** Confirms and closes. */
export function AlertDialogAction({
  destructive = false,
  className,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(
        buttonVariants({ variant: destructive ? "destructive" : "default" }),
        className,
      )}
      {...props}
    />
  )
}

/** Closes without doing anything. Gets focus when the dialog opens. */
export function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}
