import { useState } from "react"
import { Header } from "./components/header"

export function App() {
  const [page, setPage] = useState<"home" | "rated">("home")

  return (
    <>
      <Header active={page} onChange={setPage} />

      {page === "home" && <div>Home</div>}
      {page === "rated" && <div>Filmes Avaliados</div>}
    </>
  )
}
