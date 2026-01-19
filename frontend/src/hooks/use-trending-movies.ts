import { useCallback, useEffect, useRef, useState } from "react"

import type { MovieSummary } from "@/services/tmdb"
import { discoverMoviesByYear, getTrendingMovies } from "@/services/tmdb"

export function useTrendingMovies(year: string | null) {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const fetchTrending = useCallback(
    async (nextPage = 1) => {
      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller

      try {
        setIsLoading(true)
        setError(null)

        const data = year
          ? await discoverMoviesByYear(year, nextPage, controller.signal)
          : await getTrendingMovies(nextPage, controller.signal)

        if (!controller.signal.aborted) {
          setMovies(data.results)
          setPage(data.page)
          setTotalPages(data.total_pages)
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setError("Não foi possível carregar os filmes em alta.")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    },
    [year],
  )

  useEffect(() => {
    void fetchTrending(1)
    return () => abortRef.current?.abort()
  }, [fetchTrending])

  return { movies, isLoading, error, page, totalPages, fetchTrending }
}
