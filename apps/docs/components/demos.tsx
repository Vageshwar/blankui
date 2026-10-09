"use client"

import { useState } from "react"
import { Copy, Plus, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Grid, Inline, Stack } from "@/components/ui/layout"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border-strong bg-muted p-3 text-sm">
      {children}
    </div>
  )
}

function FormDemo() {
  const [email, setEmail] = useState("")
  const invalid = email.length > 0 && !email.includes("@")
  return (
    <Stack gap={4} className="max-w-sm">
      <Field
        label="Email"
        description="We never share it."
        error={invalid ? "Enter a valid email" : undefined}
        required
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Role">
        <Select defaultValue="member">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Send me product updates" orientation="horizontal">
        <Checkbox defaultChecked />
      </Field>
    </Stack>
  )
}

export const demos: Record<string, () => React.ReactNode> = {
  layout: () => (
    <Stack gap={4}>
      <Inline gap={2}>
        <Box>Inline</Box>
        <Box>gap 2</Box>
        <Box>wraps</Box>
      </Inline>
      <Grid columns={{ base: 1, sm: 3 }} gap={4}>
        <Box>Grid</Box>
        <Box>3 columns</Box>
        <Box>gap 4</Box>
      </Grid>
    </Stack>
  ),
  button: () => (
    <Inline gap={2}>
      <Button>Save</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button loading>Saving</Button>
      <Button size="icon" variant="outline" aria-label="Add item">
        <Plus />
      </Button>
    </Inline>
  ),
  card: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to hear about.</CardDescription>
      </CardHeader>
      <CardContent>
        <Field label="Weekly summary" orientation="horizontal">
          <Checkbox defaultChecked />
        </Field>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
  field: FormDemo,
  input: () => (
    <Field label="Name" description="Shown on your profile.">
      <Input placeholder="Ada Lovelace" className="max-w-sm" />
    </Field>
  ),
  textarea: () => (
    <Field label="Message">
      <Textarea placeholder="Write something" className="max-w-md" />
    </Field>
  ),
  checkbox: () => (
    <Stack gap={3}>
      <Field label="I agree to the terms" orientation="horizontal">
        <Checkbox />
      </Field>
      <Field
        label="Email me about new features"
        description="About once a month."
        orientation="horizontal"
      >
        <Checkbox defaultChecked />
      </Field>
    </Stack>
  ),
  select: () => (
    <Field label="Country">
      <Select>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Pick a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in">India</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="us">United States</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent title="Edit profile" description="Changes are saved when you click Save.">
        <Field label="Name">
          <Input defaultValue="Ada Lovelace" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast.success("Profile saved")}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "alert-dialog": () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash /> Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Delete this project?"
        description="All files and settings will be removed. This cannot be undone."
      >
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction destructive onClick={() => toast("Project deleted")}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent title="Filters" description="Narrow down the list.">
        <Field label="Status">
          <Select defaultValue="open">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Apply</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Stack gap={3}>
          <Field label="Link">
            <Input readOnly value="https://blank.vageshwar.dev" />
          </Field>
          <Button size="sm" onClick={() => toast.success("Link copied")}>
            <Copy /> Copy link
          </Button>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Copy">
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy to clipboard</TooltipContent>
    </Tooltip>
  ),
  toast: () => (
    <Inline gap={2}>
      <Button variant="outline" onClick={() => toast("Link copied")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Project created", { description: "Invite your team next." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Could not save", { action: { label: "Retry", onClick: () => {} } })
        }
      >
        Error
      </Button>
    </Inline>
  ),
  tabs: () => (
    <Tabs defaultValue="account" className="max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Field label="Name">
          <Input defaultValue="Ada" />
        </Field>
      </TabsContent>
      <TabsContent value="password">
        <Field label="New password">
          <Input type="password" />
        </Field>
      </TabsContent>
    </Tabs>
  ),
  table: () => (
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["INV-001", "Paid", "$250.00"],
          ["INV-002", "Pending", "$150.00"],
          ["INV-003", "Paid", "$350.00"],
        ].map(([id, status, amount]) => (
          <TableRow key={id}>
            <TableCell className="font-medium">{id}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell className="text-right">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export function Demo({ name }: { name: string }) {
  const render = demos[name]
  if (!render) return null
  return <div className="rounded-lg border bg-surface p-6 sm:p-8">{render()}</div>
}

/** A small showcase for the home page. */
export function Showcase() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap={6}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Every control sits in a Field, so labels and errors are wired for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormDemo />
        </CardContent>
      </Card>
      <Stack gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Variants, loading state and icon buttons that require a label.
            </CardDescription>
          </CardHeader>
          <CardContent>{demos.button!()}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
            <CardDescription>The title is a prop, so no dialog ships without one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Inline gap={2}>
              {demos.dialog!()}
              {demos["alert-dialog"]!()}
              {demos.sheet!()}
            </Inline>
          </CardContent>
        </Card>
      </Stack>
    </Grid>
  )
}
