import { describe, expect, it } from "vitest"
import { cn } from "../src/lib/utils"

describe("cn", () => {
  it("joins classes and lets the last conflicting class win", () => {
    expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4")
  })
})
