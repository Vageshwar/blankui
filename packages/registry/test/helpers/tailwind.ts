import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { compile } from "@tailwindcss/node"

const here = path.dirname(fileURLToPath(import.meta.url))
export const tokensPath = path.resolve(here, "../../src/styles/blankui.css")

/** Compile the BlankUI tokens with Tailwind and generate CSS for the given class names. */
export async function buildCss(classNames: string[]): Promise<string> {
  const tokens = readFileSync(tokensPath, "utf8")
  const input = `@import "tailwindcss";\n${tokens}`
  const compiler = await compile(input, { base: here, onDependency: () => {} })
  return compiler.build(classNames)
}

/** True when Tailwind generated a rule for the class name. */
export function hasClass(css: string, className: string): boolean {
  const escaped = className.replace(/[[\]#/.:()%]/g, (c) => `\\\\\\${c}`)
  return new RegExp(`\\.${escaped}(?=[\\s:{,])`).test(css)
}
