import path from "node:path"
import { describe, expect, it } from "vitest"
import { loadComponents } from "../scripts/components"

const fixtures = path.resolve(__dirname, "fixtures")

describe("component check", () => {
  it("accepts a valid component", () => {
    const result = loadComponents(path.join(fixtures, "good"))
    expect(result.errors).toEqual([])
    expect(result.components.map((c) => c.name)).toEqual(["badge"])
    expect(result.components[0]?.meta.whenNotToUse[0]?.use).toBe("alert")
  })

  it("reports every problem with a fix-oriented message", () => {
    const { errors } = loadComponents(path.join(fixtures, "bad"))
    const text = errors.join("\n")
    expect(text).toContain('chip.tsx: first line must start with "// BlankUI:"')
    expect(text).toContain("chip.md: description")
    expect(text).toContain("chip.md: category")
    expect(text).toContain("chip.md: whenToUse")
    expect(text).toContain("nodoc.tsx: missing nodoc.md")
    expect(text).toContain("orphan.md: no matching .tsx file")
  })

  it("checks name, required parts, examples and related links", () => {
    const { errors } = loadComponents(path.join(fixtures, "semantic"))
    expect(errors).toEqual([
      'tag.md: name "tags" must match the file name',
      'tag.md: requiredParts "TagLabel" is not exported by tag.tsx',
      "tag.md: add at least one ```tsx example",
      'tag.md: related "nothing" is not a component',
    ])
  })
})

describe("real registry", () => {
  it("has no component errors", () => {
    expect(loadComponents().errors).toEqual([])
  })
})
