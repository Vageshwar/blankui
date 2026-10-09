import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/ui/tabs"
import { Toaster, toast } from "../src/ui/toast"
import { expectNoA11yViolations } from "./helpers/a11y"

describe("Tabs", () => {
  it("switches panels with click and arrow keys", async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Account</TabsTrigger>
          <TabsTrigger value="b">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Account panel</TabsContent>
        <TabsContent value="b">Billing panel</TabsContent>
      </Tabs>,
    )
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel")
    await userEvent.click(screen.getByRole("tab", { name: "Billing" }))
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel")
    await userEvent.keyboard("{ArrowLeft}")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true")
    await expectNoA11yViolations(document.body)
  })
})

describe("Table", () => {
  it("renders an accessible table with column headers", async () => {
    const { container } = render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-1</TableCell>
            <TableCell>$10</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByRole("table", { name: "Invoices" })).toBeInTheDocument()
    expect(screen.getAllByRole("columnheader")[0]).toHaveAttribute("scope", "col")
    await expectNoA11yViolations(container)
  })
})

describe("Toast", () => {
  it("shows a toast from anywhere", async () => {
    render(<Toaster />)
    act(() => {
      toast.success("Project created", { description: "Invite your team next." })
    })
    expect(await screen.findByText("Project created")).toBeInTheDocument()
    expect(screen.getByText("Invite your team next.")).toBeInTheDocument()
  })
})
