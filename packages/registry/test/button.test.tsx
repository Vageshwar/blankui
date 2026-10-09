import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "../src/ui/button"
import { expectNoA11yViolations } from "./helpers/a11y"

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault())
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <Button>Plain</Button>
      </form>,
    )
    const button = screen.getByRole("button", { name: "Plain" })
    expect(button).toHaveAttribute("type", "button")
    button.click()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("keeps an explicit submit type", () => {
    render(<Button type="submit">Save</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("applies variant and size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    expect(screen.getByRole("button")).toHaveClass("bg-destructive", "h-12")
  })

  it("calls onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("shows a busy, disabled state while loading", async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Save" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders a link with asChild", () => {
    render(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>,
    )
    const link = screen.getByRole("link", { name: "Docs" })
    expect(link).toHaveAttribute("href", "/docs")
    expect(link).toHaveClass("border-input")
  })

  it("has no accessibility violations for text and icon buttons", async () => {
    const { container } = render(
      <div>
        <Button>Save</Button>
        <Button size="icon" aria-label="Close">
          <svg />
        </Button>
      </div>,
    )
    await expectNoA11yViolations(container)
  })

  it("requires aria-label on icon buttons", () => {
    // @ts-expect-error icon buttons need an aria-label
    void (<Button size="icon">x</Button>)
    // @ts-expect-error unknown variant
    void (<Button variant="primary">x</Button>)
    // @ts-expect-error unknown size
    void (<Button size="md">x</Button>)
    void (
      <Button size="icon" aria-label="Close">
        x
      </Button>
    )
    expect(true).toBe(true)
  })
})
