// BlankUI: layout. Managed by BlankUI. Read layout.md before editing. Extend with props, not class overrides.
import type { ComponentProps } from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/** Spacing steps. Same as Tailwind spacing: 4 = 1rem. */
export type Space = 1 | 2 | 3 | 4 | 6 | 8 | 12

const gapClass: Record<Space, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
}

const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const

const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const

type Align = keyof typeof alignClass
type Justify = keyof typeof justifyClass

interface LayoutBaseProps extends ComponentProps<"div"> {
  /** Space between children. Uses the spacing scale: 1, 2, 3, 4, 6, 8 or 12. */
  gap?: Space
  /** Render the single child element instead of a `div`, for example a `section` or `ul`. */
  asChild?: boolean
}

export interface StackProps extends LayoutBaseProps {
  /** Cross-axis (horizontal) alignment of children. Defaults to `stretch`. */
  align?: Align
  /** Main-axis (vertical) distribution of children. Defaults to `start`. */
  justify?: Justify
}

/**
 * Vertical layout. Use it instead of `flex flex-col gap-*` or `space-y-*`.
 *
 * @example
 * <Stack gap={4}>
 *   <h2>Title</h2>
 *   <p>Body</p>
 * </Stack>
 */
export function Stack({
  gap = 4,
  align = "stretch",
  justify = "start",
  asChild = false,
  className,
  ...props
}: StackProps) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="stack"
      className={cn(
        "flex flex-col",
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...props}
    />
  )
}

export interface InlineProps extends LayoutBaseProps {
  /** Cross-axis (vertical) alignment of children. Defaults to `center`. */
  align?: Align
  /** Main-axis (horizontal) distribution of children. Defaults to `start`. */
  justify?: Justify
  /** Let children wrap onto the next line. Defaults to `true`. */
  wrap?: boolean
}

/**
 * Horizontal layout that wraps. Use it for button rows, tags and toolbars,
 * instead of `flex gap-*` or `space-x-*`.
 *
 * @example
 * <Inline gap={2} justify="end">
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save</Button>
 * </Inline>
 */
export function Inline({
  gap = 2,
  align = "center",
  justify = "start",
  wrap = true,
  asChild = false,
  className,
  ...props
}: InlineProps) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="inline"
      className={cn(
        "flex flex-row",
        wrap && "flex-wrap",
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...props}
    />
  )
}

/** Number of grid columns. */
export type Columns = 1 | 2 | 3 | 4 | 6 | 12

/** Columns per breakpoint. `base` applies to all sizes, the others from that breakpoint up. */
export interface ResponsiveColumns {
  base?: Columns
  sm?: Columns
  md?: Columns
  lg?: Columns
  xl?: Columns
}

const columnClass = {
  base: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
    12: "grid-cols-12",
  },
  sm: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    6: "sm:grid-cols-6",
    12: "sm:grid-cols-12",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    6: "md:grid-cols-6",
    12: "md:grid-cols-12",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    6: "lg:grid-cols-6",
    12: "lg:grid-cols-12",
  },
  xl: {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    6: "xl:grid-cols-6",
    12: "xl:grid-cols-12",
  },
} as const satisfies Record<keyof ResponsiveColumns, Record<Columns, string>>

export interface GridProps extends LayoutBaseProps {
  /**
   * Number of columns, or columns per breakpoint.
   * @example columns={3}
   * @example columns={{ base: 1, md: 2, lg: 3 }}
   */
  columns?: Columns | ResponsiveColumns
}

/**
 * Grid of equal columns. Use it for card grids and form rows.
 *
 * @example
 * <Grid columns={{ base: 1, md: 3 }} gap={6}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 */
export function Grid({ columns = 1, gap = 4, asChild = false, className, ...props }: GridProps) {
  const Comp = asChild ? Slot.Root : "div"
  const responsive: ResponsiveColumns = typeof columns === "number" ? { base: columns } : columns
  const colClasses = (Object.keys(responsive) as (keyof ResponsiveColumns)[]).map((bp) => {
    const n = responsive[bp]
    return n ? columnClass[bp][n] : undefined
  })
  return (
    <Comp
      data-slot="grid"
      className={cn("grid", colClasses, gapClass[gap], className)}
      {...props}
    />
  )
}

const containerSize = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const

export interface ContainerProps extends Omit<LayoutBaseProps, "gap"> {
  /** Maximum width. `sm` suits articles and forms, `lg` suits most app pages. Defaults to `lg`. */
  size?: keyof typeof containerSize
}

/**
 * Centers page content with a max width and responsive side padding.
 * Use one per page section instead of `mx-auto max-w-* px-*`.
 *
 * @example
 * <Container size="md">
 *   <Stack gap={8}>...</Stack>
 * </Container>
 */
export function Container({ size = "lg", asChild = false, className, ...props }: ContainerProps) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="container"
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", containerSize[size], className)}
      {...props}
    />
  )
}
