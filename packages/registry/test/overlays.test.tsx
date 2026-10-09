import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../src/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../src/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../src/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "../src/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "../src/ui/tooltip"
import { expectNoA11yViolations } from "./helpers/a11y"

describe("Dialog", () => {
  function Example({ description }: { description?: string }) {
    return (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent title="Edit profile" description={description}>
          <p>Body</p>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  it("opens with an accessible name and description", async () => {
    render(<Example description="Saved on submit." />)
    await userEvent.click(screen.getByRole("button", { name: "Open" }))
    const dialog = await screen.findByRole("dialog", { name: "Edit profile" })
    expect(dialog).toHaveAccessibleDescription("Saved on submit.")
    await expectNoA11yViolations(document.body)
  })

  it("closes with Escape and with the close button", async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())

    await userEvent.click(screen.getByRole("button", { name: "Open" }))
    await userEvent.click(await screen.findByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("does not warn about a missing description", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<Example />)
    await userEvent.click(screen.getByRole("button", { name: "Open" }))
    await screen.findByRole("dialog")
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("keeps a hidden title for screen readers", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="Search" hideTitle>
          x
        </DialogContent>
      </Dialog>,
    )
    expect(await screen.findByRole("dialog", { name: "Search" })).toBeInTheDocument()
  })

  it("requires a title", () => {
    const noTitle = { children: null }
    // @ts-expect-error title is required
    void (<DialogContent {...noTitle} />)
    expect(true).toBe(true)
  })
})

describe("Sheet", () => {
  it("opens from the chosen side with a title", async () => {
    render(
      <Sheet>
        <SheetTrigger>Filters</SheetTrigger>
        <SheetContent side="left" title="Filters">
          x
        </SheetContent>
      </Sheet>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Filters" }))
    const sheet = await screen.findByRole("dialog", { name: "Filters" })
    expect(sheet.className).toContain("left-0")
    await expectNoA11yViolations(document.body)
  })

  it("requires a title", () => {
    const noTitle = { side: "right" as const }
    // @ts-expect-error title is required
    void (<SheetContent {...noTitle} />)
    expect(true).toBe(true)
  })
})

describe("AlertDialog", () => {
  it("focuses Cancel and runs the action", async () => {
    const onDelete = vi.fn()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent title="Delete this project?" description="This cannot be undone.">
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction destructive onClick={onDelete}>
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))
    const dialog = await screen.findByRole("alertdialog", { name: "Delete this project?" })
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.")
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    const action = screen.getByRole("button", { name: "Delete forever" })
    expect(action).toHaveClass("bg-destructive")
    await userEvent.click(action)
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it("requires a title and a description", () => {
    const onlyTitle = { title: "Delete?" }
    // @ts-expect-error description is required
    void (<AlertDialogContent {...onlyTitle} />)
    expect(true).toBe(true)
  })
})

describe("Popover", () => {
  it("opens on click", async () => {
    render(
      <Popover>
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent>Share settings</PopoverContent>
      </Popover>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Share" }))
    expect(await screen.findByText("Share settings")).toBeVisible()
  })
})

describe("Tooltip", () => {
  it("shows on focus without a provider", async () => {
    render(
      <Tooltip>
        <TooltipTrigger aria-label="Copy">C</TooltipTrigger>
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>,
    )
    await userEvent.tab()
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy to clipboard")
  })
})
