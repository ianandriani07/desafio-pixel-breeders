import { useCallback, useRef, useState } from "react"

import type { MovieSummary } from "@/services/tmdb"
import { searchMovies } from "@/services/tmdb"

export function useMovieSearch() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<MovieSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const search = useCallback(
    async (nextQuery?: string, nextPage = 1) => {
      const queryToSearch = (nextQuery ?? query).trim()
      setHasSearched(true)

      abortRef.current?.abort()

      if (!queryToSearch) {
        setResults([])
        setError(null)
        setIsLoading(false)
        setPage(1)
        setTotalPages(1)
        return
      }

      const controller = new AbortController()
      abortRef.current = controller

      try {
        setIsLoading(true)
        setError(null)

        const data = await searchMovies(queryToSearch, nextPage, controller.signal)

        if (!controller.signal.aborted) {
          setResults(data.results)
          setPage(data.page)
          setTotalPages(data.total_pages)
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setError("Erro ao buscar filmes.")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    },
    [query],
  )

  return {
    query,
    setQuery,
    hasSearched,
    results,
    isLoading,
    error,
    search,
    page,
    totalPages,
  }
}
