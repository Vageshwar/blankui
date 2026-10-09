import noArbitraryValues from "../src/rules/no-arbitrary-values"
import noDirectRadix from "../src/rules/no-direct-radix"
import noInlineColor from "../src/rules/no-inline-color"
import noNestedCard from "../src/rules/no-nested-card"
import noPaletteColors from "../src/rules/no-palette-colors"
import preferComponent from "../src/rules/prefer-component"
import preferLayoutPrimitives from "../src/rules/prefer-layout-primitives"
import { ruleTester } from "./setup"

ruleTester.run("no-arbitrary-values", noArbitraryValues, {
  valid: [
    '<div className="mt-3 w-64 bg-primary" />',
    '<div className="data-[state=open]:bg-muted [&_svg]:size-4" />',
    '<div className="max-h-(--radix-select-content-available-height)" />',
    'const x = "mt-[13px]"',
    'cn("p-4", isOpen && "bg-surface")',
  ],
  invalid: [
    {
      code: '<div className="mt-[13px] p-4" />',
      errors: [{ messageId: "arbitrary", data: { className: "mt-[13px]" } }],
    },
    {
      code: '<div className={cn("p-4", "bg-[#3b82f6]")} />',
      errors: [{ messageId: "arbitraryColor", data: { className: "bg-[#3b82f6]" } }],
    },
    {
      code: "<div className={`md:w-[372px] ${x}`} />",
      errors: [{ messageId: "arbitrary", data: { className: "md:w-[372px]" } }],
    },
    {
      code: 'const v = cva("text-[oklch(0.5_0.1_200)]")',
      errors: [{ messageId: "arbitraryColor" }],
    },
  ],
})

ruleTester.run("no-palette-colors", noPaletteColors, {
  valid: [
    '<p className="text-muted-foreground bg-surface border-border" />',
    '<p className="bg-primary/90 hover:bg-surface-hover" />',
  ],
  invalid: [
    {
      code: '<button className="bg-blue-500 text-white" />',
      errors: [{ messageId: "palette" }, { messageId: "palette" }],
    },
    {
      code: '<div className={cn("hover:border-gray-200/50")} />',
      errors: [{ messageId: "palette" }],
    },
  ],
})

ruleTester.run("no-inline-color", noInlineColor, {
  valid: ["<div style={{ width: 200 }} />", '<div style={{ color: "var(--primary)" }} />'],
  invalid: [
    {
      code: '<div style={{ backgroundColor: "#fff", color: "red" }} />',
      errors: [
        { messageId: "inlineColor", data: { property: "backgroundColor" } },
        { messageId: "inlineColor", data: { property: "color" } },
      ],
    },
  ],
})

ruleTester.run("prefer-component", preferComponent, {
  valid: [
    "<Button>Save</Button>",
    '<input type="hidden" name="id" />',
    '<input type="file" />',
    "<Table />",
  ],
  invalid: [
    {
      code: "<button onClick={save}>Save</button>",
      errors: [
        { messageId: "prefer", data: { component: "Button", module: "button", element: "button" } },
      ],
    },
    {
      code: '<input type="email" />',
      errors: [
        { messageId: "prefer", data: { component: "Input", module: "input", element: "input" } },
      ],
    },
    {
      code: '<input type="checkbox" />',
      errors: [
        {
          messageId: "prefer",
          data: { component: "Checkbox", module: "checkbox", element: "input" },
        },
      ],
    },
    { code: "<select />", errors: [{ messageId: "prefer" }] },
    { code: "<textarea />", errors: [{ messageId: "prefer" }] },
    { code: "<table />", errors: [{ messageId: "prefer" }] },
  ],
})

ruleTester.run("prefer-layout-primitives", preferLayoutPrimitives, {
  valid: [
    "<Stack gap={4} />",
    '<div className="flex items-center" />',
    '<div className="md:flex md:gap-4" />',
    '<Inline className="flex gap-2" />',
  ],
  invalid: [
    {
      code: '<div className="flex flex-col gap-4" />',
      errors: [
        { messageId: "useStack", data: { gap: " gap={4}", classes: "flex flex-col gap-4" } },
      ],
    },
    {
      code: '<div className="space-y-6" />',
      errors: [{ messageId: "useStack", data: { gap: " gap={6}", classes: "space-y-6" } }],
    },
    {
      code: '<div className="flex items-center gap-2" />',
      errors: [{ messageId: "useInline", data: { gap: " gap={2}", classes: "flex gap-2" } }],
    },
    {
      code: '<ul className="grid grid-cols-3 gap-5" />',
      errors: [{ messageId: "useGrid", data: { gap: " gap={4}", classes: "grid gap-5" } }],
    },
  ],
})

ruleTester.run("no-direct-radix", noDirectRadix, {
  valid: ['import { Dialog } from "@/components/ui/dialog"'],
  invalid: [
    { code: 'import { Dialog } from "radix-ui"', errors: [{ messageId: "radix" }] },
    { code: 'import * as D from "@radix-ui/react-dialog"', errors: [{ messageId: "radix" }] },
    { code: 'import { toast } from "sonner"', errors: [{ messageId: "sonner" }] },
  ],
})

ruleTester.run("no-nested-card", noNestedCard, {
  valid: ["<Grid><Card /><Card /></Grid>"],
  invalid: [
    {
      code: "<Card><CardContent><Card /></CardContent></Card>",
      errors: [{ messageId: "nested" }],
    },
  ],
})
