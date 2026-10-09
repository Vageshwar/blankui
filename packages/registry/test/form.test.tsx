import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { Checkbox } from "../src/ui/checkbox"
import { Field } from "../src/ui/field"
import { Input } from "../src/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/ui/select"
import { Textarea } from "../src/ui/textarea"
import { expectNoA11yViolations } from "./helpers/a11y"

describe("Field + Input", () => {
  it("labels the input and links description and error", () => {
    render(
      <Field label="Email" description="We never share it." error="Enter a valid email" required>
        <Input type="email" />
      </Field>,
    )
    const input = screen.getByRole("textbox", { name: /Email/ })
    expect(input).toBeRequired()
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("We never share it. Enter a valid email")
  })

  it("keeps props set on the control", () => {
    render(
      <Field label="Name">
        <Input id="custom" aria-describedby="extra" />
      </Field>,
    )
    const input = screen.getByRole("textbox", { name: "Name" })
    expect(input).toHaveAttribute("id", "custom")
    expect(input).toHaveAttribute("aria-describedby", "extra")
  })

  it("leaves a standalone input alone", () => {
    render(<Input aria-label="Search" />)
    const input = screen.getByRole("textbox", { name: "Search" })
    expect(input).not.toHaveAttribute("aria-invalid")
    expect(input).not.toHaveAttribute("aria-describedby")
  })

  it("wires Textarea the same way", () => {
    render(
      <Field label="Message" error="Too short">
        <Textarea />
      </Field>,
    )
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInvalid()
  })
})

describe("Checkbox", () => {
  it("toggles through onCheckedChange and is labelled by Field", async () => {
    const onChange = vi.fn()
    render(
      <Field label="Subscribe" orientation="horizontal">
        <Checkbox onCheckedChange={onChange} />
      </Field>,
    )
    const box = screen.getByRole("checkbox", { name: "Subscribe" })
    await userEvent.click(screen.getByText("Subscribe"))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(box).toHaveAttribute("data-state", "checked")
  })
})

describe("Select", () => {
  function RoleSelect() {
    const [role, setRole] = useState("")
    return (
      <Field label="Role" error={role ? undefined : "Pick a role"} required>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Pick a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    )
  }

  it("is labelled, shows the placeholder and picks an option", async () => {
    render(<RoleSelect />)
    const trigger = screen.getByRole("combobox", { name: /Role/ })
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    expect(trigger).toHaveAttribute("aria-required", "true")
    expect(trigger).toHaveTextContent("Pick a role")

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("option", { name: "Member" }))
    expect(trigger).toHaveTextContent("Member")
    expect(trigger).not.toHaveAttribute("aria-invalid")
  })
})

describe("accessibility", () => {
  it("a full form has no violations", async () => {
    const { container } = render(
      <form>
        <Field label="Name" error="Required" required>
          <Input />
        </Field>
        <Field label="Bio" description="Optional">
          <Textarea />
        </Field>
        <Field label="Agree" orientation="horizontal">
          <Checkbox />
        </Field>
        <Field label="Plan">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </form>,
    )
    await expectNoA11yViolations(container)
  })

  it("requires a label on Field", () => {
    // @ts-expect-error label is required
    void (
      <Field>
        <Input />
      </Field>
    )
    expect(true).toBe(true)
  })
})
