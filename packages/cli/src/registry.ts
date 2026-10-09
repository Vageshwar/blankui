import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export const defaultRegistry = "https://blank.vageshwar.dev"

export interface RegistryFile {
  path: string
  type: string
  target?: string
  content: string
}

export interface RegistryItem {
  name: string
  type: string
  title: string
  description: string
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
  docs?: string
}

/**
 * Reads registry files from a URL (https://blank.vageshwar.dev) or a local folder
 * that has the same layout (r/<name>.json, r/agents-block.md). Local folders are used in tests.
 */
export class Registry {
  constructor(readonly source: string = defaultRegistry) {}

  private get isLocal() {
    return !/^https?:\/\//.test(this.source)
  }

  async text(rel: string): Promise<string> {
    if (this.isLocal) {
      const file = path.join(this.source, rel)
      if (!existsSync(file)) throw new Error(`Not found in registry: ${rel}`)
      return readFileSync(file, "utf8")
    }
    const url = `${this.source.replace(/\/$/, "")}/${rel}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Could not fetch ${url} (${res.status})`)
    return res.text()
  }

  async item(name: string): Promise<RegistryItem> {
    try {
      return JSON.parse(await this.text(`r/${name}.json`)) as RegistryItem
    } catch (error) {
      throw new Error(
        `Unknown component "${name}". See the list at ${defaultRegistry}/docs or in ${defaultRegistry}/llms.txt.`,
        { cause: error },
      )
    }
  }

  async names(): Promise<string[]> {
    const index = JSON.parse(await this.text("r/registry.json")) as {
      items: { name: string; type: string }[]
    }
    return index.items.filter((i) => i.type === "registry:ui").map((i) => i.name)
  }

  agentsBlock(): Promise<string> {
    return this.text("r/agents-block.md")
  }

  /** The item and everything it depends on, dependencies first. */
  async resolve(names: string[]): Promise<RegistryItem[]> {
    const seen = new Map<string, RegistryItem>()
    const visit = async (name: string) => {
      if (seen.has(name)) return
      const item = await this.item(name)
      for (const dep of item.registryDependencies) await visit(itemNameFromUrl(dep))
      seen.set(name, item)
    }
    for (const name of names) await visit(name)
    return [...seen.values()]
  }
}

/** "https://blank.vageshwar.dev/r/button.json" -> "button" */
export function itemNameFromUrl(ref: string): string {
  const match = /([^/]+)\.json$/.exec(ref)
  return match ? match[1]! : ref
}
