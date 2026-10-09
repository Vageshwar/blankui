import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../src/ui/card"
import { expectNoA11yViolations } from "./helpers/a11y"

function Example() {
  return (
    <Card data-testid="card">
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>Invite people.</CardDescription>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>
        <button type="button">Invite</button>
      </CardFooter>
    </Card>
  )
}

describe("Card", () => {
  it("renders a surface with a heading", () => {
    render(<Example />)
    expect(screen.getByTestId("card")).toHaveClass("bg-surface", "border", "rounded-lg")
    expect(screen.getByRole("heading", { level: 3, name: "Team" })).toBeInTheDocument()
  })

  it("lets CardTitle use another heading level", () => {
    render(
      <CardTitle asChild>
        <h2>Billing</h2>
      </CardTitle>,
    )
    expect(screen.getByRole("heading", { level: 2, name: "Billing" })).toHaveClass("font-heading")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Example />)
    await expectNoA11yViolations(container)
  })
})
