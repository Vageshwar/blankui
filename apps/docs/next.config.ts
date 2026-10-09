import path from "node:path"
import type { NextConfig } from "next"

const config: NextConfig = {
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
      {
        source: "/:file(llms.txt|llms-full.txt)",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/docs/:name.md",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
    ]
  },
}

export default config
