import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Container, Grid, Inline, Stack } from "../src/ui/layout"
import { expectNoA11yViolations } from "./helpers/a11y"

describe("Stack", () => {
  it("renders a vertical flex container with the default gap", () => {
    render(<Stack data-testid="s">x</Stack>)
    expect(screen.getByTestId("s")).toHaveClass("flex", "flex-col", "gap-4", "items-stretch")
  })

  it("maps gap, align and justify to classes", () => {
    render(<Stack data-testid="s" gap={8} align="center" justify="between" />)
    expect(screen.getByTestId("s")).toHaveClass("gap-8", "items-center", "justify-between")
  })

  it("renders the child element with asChild", () => {
    render(
      <Stack asChild gap={2}>
        <ul data-testid="list">
          <li>One</li>
        </ul>
      </Stack>,
    )
    const list = screen.getByTestId("list")
    expect(list.tagName).toBe("UL")
    expect(list).toHaveClass("flex-col", "gap-2")
  })
})

describe("Inline", () => {
  it("wraps by default and centers items", () => {
    render(<Inline data-testid="i" />)
    expect(screen.getByTestId("i")).toHaveClass("flex-row", "flex-wrap", "gap-2", "items-center")
  })

  it("can turn wrapping off", () => {
    render(<Inline data-testid="i" wrap={false} />)
    expect(screen.getByTestId("i")).not.toHaveClass("flex-wrap")
  })
})

describe("Grid", () => {
  it("accepts a fixed column count", () => {
    render(<Grid data-testid="g" columns={3} />)
    expect(screen.getByTestId("g")).toHaveClass("grid", "grid-cols-3", "gap-4")
  })

  it("accepts responsive columns", () => {
    render(<Grid data-testid="g" columns={{ base: 1, md: 2, lg: 4 }} gap={6} />)
    expect(screen.getByTestId("g")).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-4",
      "gap-6",
    )
  })
})

describe("Container", () => {
  it("centers content with the default size", () => {
    render(<Container data-testid="c" />)
    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "max-w-6xl", "px-4")
  })

  it("has no accessibility violations in a typical page", async () => {
    const { container } = render(
      <Container asChild size="md">
        <main>
          <Stack gap={4}>
            <h1>Title</h1>
            <Inline>
              <button type="button">One</button>
            </Inline>
          </Stack>
        </main>
      </Container>,
    )
    await expectNoA11yViolations(container)
  })
})

describe("types", () => {
  it("only accepts the spacing scale and known columns", () => {
    // @ts-expect-error 5 is not on the spacing scale
    void (<Stack gap={5} />)
    // @ts-expect-error gap must be a number from the scale, not a string
    void (<Inline gap="4" />)
    // @ts-expect-error 5 columns is not supported
    void (<Grid columns={5} />)
    // @ts-expect-error Container has no gap
    void (<Container gap={4} />)
    expect(true).toBe(true)
  })
})
