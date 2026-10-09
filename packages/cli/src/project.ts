import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export interface Aliases {
  components: string
  ui: string
  utils: string
  lib: string
}

export interface ComponentsJson {
  $schema?: string
  style: string
  rsc: boolean
  tsx: boolean
  tailwind: { config: string; css: string; baseColor: string; cssVariables: boolean }
  aliases: Aliases & { hooks?: string }
  registries?: Record<string, string>
}

export type Framework = "next" | "vite" | "unknown"
export type PackageManager = "pnpm" | "yarn" | "bun" | "npm"

export class Project {
  constructor(readonly root: string) {}

  file(rel: string) {
    return path.join(this.root, rel)
  }

  exists(rel: string) {
    return existsSync(this.file(rel))
  }

  read(rel: string) {
    return readFileSync(this.file(rel), "utf8")
  }

  packageJson(): {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  } {
    return this.exists("package.json") ? JSON.parse(this.read("package.json")) : {}
  }

  hasDependency(name: string) {
    const pkg = this.packageJson()
    return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name])
  }

  framework(): Framework {
    if (this.hasDependency("next")) return "next"
    if (this.hasDependency("vite")) return "vite"
    return "unknown"
  }

  packageManager(): PackageManager {
    if (this.exists("pnpm-lock.yaml") || this.exists("pnpm-workspace.yaml")) return "pnpm"
    if (this.exists("yarn.lock")) return "yarn"
    if (this.exists("bun.lock") || this.exists("bun.lockb")) return "bun"
    return "npm"
  }

  installCommand(packages: string[], dev = false): string {
    const pm = this.packageManager()
    const verb = pm === "npm" ? "install" : "add"
    const devFlag = dev ? (pm === "npm" ? " -D" : " -D") : ""
    return `${pm} ${verb}${devFlag} ${packages.join(" ")}`
  }

  usesSrcDir() {
    return this.exists("src")
  }

  /** The folder "@/" points to, from tsconfig paths. Falls back to src/ or the root. */
  aliasRoot(): { prefix: string; dir: string; fromTsconfig: boolean } {
    for (const name of ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"]) {
      if (!this.exists(name)) continue
      const config = parseJsonc(this.read(name)) as {
        compilerOptions?: { paths?: Record<string, string[]> }
      }
      const paths = config.compilerOptions?.paths ?? {}
      for (const [key, targets] of Object.entries(paths)) {
        if (!key.endsWith("/*") || !targets[0]) continue
        return {
          prefix: key.slice(0, -2),
          dir: targets[0].replace(/\/\*$/, "").replace(/^\.\/?/, ""),
          fromTsconfig: true,
        }
      }
    }
    return { prefix: "@", dir: this.usesSrcDir() ? "src" : "", fromTsconfig: false }
  }

  /** Turn an alias like "@/components/ui" into a folder relative to the project root. */
  aliasToPath(alias: string): string {
    const { prefix, dir } = this.aliasRoot()
    const rest = alias.startsWith(`${prefix}/`) ? alias.slice(prefix.length + 1) : alias
    return path.join(dir, rest)
  }

  componentsJson(): ComponentsJson | undefined {
    return this.exists("components.json")
      ? (JSON.parse(this.read("components.json")) as ComponentsJson)
      : undefined
  }

  /** The main CSS file: the first one that imports tailwindcss. */
  mainCss(): string | undefined {
    const candidates = [
      "app/globals.css",
      "src/app/globals.css",
      "src/index.css",
      "src/styles/globals.css",
      "styles/globals.css",
      "src/main.css",
      "src/App.css",
    ]
    return candidates.find(
      (c) => this.exists(c) && /@import\s+["']tailwindcss["']/.test(this.read(c)),
    )
  }
}

/** JSON with comments and trailing commas, as tsconfig allows. */
export function parseJsonc(text: string): unknown {
  const withoutComments = text.replace(
    /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (_m, str) => str ?? "",
  )
  return JSON.parse(withoutComments.replace(/,(\s*[}\]])/g, "$1"))
}

/** Rewrite BlankUI's default import aliases to the project's aliases. */
export function rewriteImports(content: string, aliases: Aliases): string {
  return content
    .replace(/(["'])@\/components\/ui\//g, `$1${aliases.ui}/`)
    .replace(/(["'])@\/lib\/utils(["'])/g, `$1${aliases.utils}$2`)
}
