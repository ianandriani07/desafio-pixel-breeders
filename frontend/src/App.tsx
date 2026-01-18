import { useState } from "react"
import { Header } from "./components/header"
import { HomePage } from "./pages/home"
import { RatedPage } from "./pages/rated"
export function App() {
  const [page, setPage] = useState<"home" | "rated">("home")

  return (
    <>
      <Header active={page} onChange={setPage} />

      {page === "home" && <HomePage />}
      {page === "rated" && <RatedPage />}
    </>
  )
}
