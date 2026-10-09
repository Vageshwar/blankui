import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

const screens = import.meta.glob<{ default: () => React.ReactNode }>("./screens/*.tsx", {
  eager: true,
})

function App() {
  return (
    <main>
      {Object.entries(screens).map(([file, mod]) => (
        <section key={file}>{mod.default()}</section>
      ))}
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
