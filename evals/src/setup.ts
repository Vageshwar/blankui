// Builds the two fixture apps in .work/fixtures: one with BlankUI, one with plain shadcn/ui.
import { spawnSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import path from "node:path"
import { evalsRoot, repoRoot, workDir } from "./tasks.ts"

const shadcnVersion = "4.21.0"
const shadcnComponents = [
  "button",
  "input",
  "textarea",
  "checkbox",
  "select",
  "label",
  "field",
  "dialog",
  "alert-dialog",
  "sheet",
  "popover",
  "tooltip",
  "card",
  "table",
  "tabs",
  "sonner",
]

function sh(command: string, cwd: string) {
  console.log(`$ ${command}`)
  const result = spawnSync(command, { cwd, shell: true, stdio: "inherit" })
  if (result.status !== 0) throw new Error(`Failed: ${command}`)
}

function freshFixture(name: string): string {
  const dir = path.join(workDir, "fixtures", name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(path.dirname(dir), { recursive: true })
  cpSync(path.join(evalsRoot, "fixture"), dir, { recursive: true })
  return dir
}

function setupBlankui() {
  const dir = freshFixture("blankui")
  const registry = path.join(workDir, "registry")
  sh(`pnpm --filter @blankui/registry build --out ${registry}`, repoRoot)
  sh(`pnpm --filter blankui-cli build`, repoRoot)
  sh(`pnpm --filter eslint-plugin-blankui build`, repoRoot)
  const cli = `node ${path.join(repoRoot, "packages/cli/dist/index.js")} --cwd ${dir} --registry ${registry}`
  sh(`${cli} init --no-install`, dir)
  sh(`${cli} add all --no-install`, dir)
  sh(
    [
      "npm install --no-audit --no-fund",
      "class-variance-authority@0.7.1 clsx@2.1.1 lucide-react@1.48.0 radix-ui@1.6.7 sonner@2.0.8 tailwind-merge@3.7.0",
      `eslint@10.11.0 typescript-eslint@8.70.1 ${path.join(repoRoot, "packages/eslint-plugin")}`,
    ].join(" "),
    dir,
  )
}

/** shadcn/ui with Radix (`shadcn`) or with Base UI, its current default (`shadcn-base`). */
function setupShadcn(name: "shadcn" | "shadcn-base") {
  const dir = freshFixture(name)
  const base = name === "shadcn" ? "radix" : "base"
  sh("npm install --no-audit --no-fund", dir)
  sh(`npx -y shadcn@${shadcnVersion} init --base ${base} --preset nova --yes < /dev/null`, dir)
  sh(
    `npx -y shadcn@${shadcnVersion} add ${shadcnComponents.join(" ")} --yes --overwrite < /dev/null`,
    dir,
  )
}

const which = process.argv[2] ?? "all"
if (which === "all" || which === "blankui") setupBlankui()
if (which === "all" || which === "shadcn") setupShadcn("shadcn")
if (which === "all" || which === "shadcn-base") setupShadcn("shadcn-base")
for (const name of ["blankui", "shadcn", "shadcn-base"]) {
  const ready = existsSync(path.join(workDir, "fixtures", name, "node_modules"))
  console.log(`${name} fixture: ${ready ? "ready" : "not built"}`)
}
