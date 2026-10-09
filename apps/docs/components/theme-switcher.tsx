"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Inline } from "@/components/ui/layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const themes = ["default", "slate", "neo"] as const
type Theme = (typeof themes)[number]
type Mode = "light" | "dark"

/** Runs before paint so the page never flashes the wrong theme. ?theme= and ?mode= override the saved choice. */
export const themeScript = `try{var d=document.documentElement,q=new URLSearchParams(location.search),t=q.get("theme")||localStorage.getItem("bui-theme")||"default",m=q.get("mode")||localStorage.getItem("bui-mode")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.dataset.theme=t;d.dataset.mode=m}catch(e){}`

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be blocked. The theme still applies for this page view.
  }
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("default")
  const [mode, setMode] = useState<Mode>("light")

  useEffect(() => {
    const d = document.documentElement
    setTheme((d.dataset.theme as Theme) ?? "default")
    setMode((d.dataset.mode as Mode) ?? "light")
  }, [])

  const changeTheme = (value: string) => {
    const next = value as Theme
    document.documentElement.dataset.theme = next
    save("bui-theme", next)
    setTheme(next)
  }

  const toggleMode = () => {
    const next: Mode = mode === "dark" ? "light" : "dark"
    document.documentElement.dataset.mode = next
    save("bui-mode", next)
    setMode(next)
  }

  return (
    <Inline gap={2} wrap={false}>
      <Select value={theme} onValueChange={changeTheme}>
        <SelectTrigger size="sm" aria-label="Theme" className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {themes.map((t) => (
            <SelectItem key={t} value={t}>
              {t[0]!.toUpperCase() + t.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="icon"
        variant="outline"
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleMode}
        className="size-8"
      >
        {mode === "dark" ? <Sun /> : <Moon />}
      </Button>
    </Inline>
  )
}
