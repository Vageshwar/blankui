import { loadComponents } from "./components.ts"

const { components, errors } = loadComponents()

if (errors.length > 0) {
  console.error(`BlankUI component check failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`)
  process.exit(1)
}
console.log(`BlankUI component check passed (${components.length} components).`)
