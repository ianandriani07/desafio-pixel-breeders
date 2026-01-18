import { useEffect, useRef, useState } from "react"

import type { MovieSummary } from "@/services/tmdb"
import { getTrendingMovies } from "@/services/tmdb"

export function useTrendingMovies() {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const fetchTrending = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const results = await getTrendingMovies(controller.signal)
        if (!controller.signal.aborted) {
          setMovies(results)
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setError("Não foi possível carregar os filmes em alta.")
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchTrending()

    return () => controller.abort()
  }, [])

  return { movies, isLoading, error }
}
