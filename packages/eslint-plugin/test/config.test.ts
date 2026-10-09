import { describe, expect, it } from "vitest"
import { ESLint } from "eslint"
import tsParser from "@typescript-eslint/parser"
import plugin from "../src/index"

describe("recommended config", () => {
  it("reports agent mistakes with fix-oriented messages", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs.recommended,
        { files: ["**/*.tsx"], languageOptions: { parser: tsParser } },
      ],
    })
    const code = `import { Dialog } from "radix-ui"
export function Page() {
  return (
    <div className="flex flex-col gap-4 bg-blue-500 mt-[13px]">
      <button>Save</button>
    </div>
  )
}`
    const [result] = await eslint.lintText(code, { filePath: "app/page.tsx" })
    const messages = result!.messages.map((m) => `${m.ruleId}: ${m.message}`)
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('blankui/no-direct-radix: Import from "@/components/ui/..."'),
        expect.stringContaining("blankui/prefer-layout-primitives: Use <Stack gap={4}>"),
        expect.stringContaining("blankui/no-palette-colors: `bg-blue-500` does not exist"),
        expect.stringContaining("blankui/no-arbitrary-values: `mt-[13px]`"),
        expect.stringContaining("blankui/prefer-component: Use <Button>"),
      ]),
    )
  })

  it("skips components/ui", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs.recommended,
        { files: ["**/*.tsx"], languageOptions: { parser: tsParser } },
      ],
    })
    const [result] = await eslint.lintText(
      'import { Dialog } from "radix-ui"\nexport const x = <button />',
      {
        filePath: "components/ui/dialog.tsx",
      },
    )
    expect(result!.messages.filter((m) => m.ruleId?.startsWith("blankui/"))).toEqual([])
  })
})
