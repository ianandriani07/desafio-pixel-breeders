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

  const search = useCallback(
    async (nextQuery?: string) => {
      const queryToSearch = (nextQuery ?? query).trim()
      setHasSearched(true)

      abortRef.current?.abort()

      if (!queryToSearch) {
        setResults([])
        setError(null)
        setIsLoading(false)
        return
      }

      const controller = new AbortController()
      abortRef.current = controller

      try {
        setIsLoading(true)
        setError(null)

        const data = await searchMovies(queryToSearch, controller.signal)
        if (!controller.signal.aborted) {
          setResults(data)
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setError("Erro ao buscar filmes.")
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [query]
  )

  return {
    query,
    setQuery,
    hasSearched,
    results,
    isLoading,
    error,
    search,
  }
}
