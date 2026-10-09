// BlankUI: table. Managed by BlankUI. Read table.md before editing.
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

/**
 * A data table. Scrolls sideways on small screens.
 *
 * @example
 * <Table>
 *   <TableCaption>Recent invoices</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Invoice</TableHead>
 *       <TableHead className="text-right">Amount</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV-001</TableCell>
 *       <TableCell className="text-right">$250.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto rounded-lg border">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/** The header rows. Holds TableRow with TableHead cells. */
export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted [&_tr]:border-b", className)}
      {...props}
    />
  )
}

/** The body rows. */
export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/** Totals or summary rows. */
export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t bg-muted font-medium", className)}
      {...props}
    />
  )
}

/** One row. */
export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-surface-hover data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  )
}

/** A header cell. Defaults to `scope="col"`. */
export function TableHead({ className, scope = "col", ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        "h-10 px-4 text-left align-middle font-medium whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

/** A data cell. */
export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("p-4 align-middle", className)} {...props} />
}

/** Describes the table. Shown below it. */
export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("py-3 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
