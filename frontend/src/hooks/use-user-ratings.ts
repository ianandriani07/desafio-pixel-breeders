import { useCallback, useEffect, useRef, useState } from "react"

import { getUserRatings } from "@/services/ratings"

export type UserRating = {
  tmdb_movie_id: number
  rating: number
}

export function useUserRatings() {
  const [ratings, setRatings] = useState<UserRating[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const fetchRatings = useCallback(async () => {
    abortRef.current?.abort()

    const controller = new AbortController()
    abortRef.current = controller

    try {
      setIsLoading(true)
      setError(null)

      const data = await getUserRatings(controller.signal)
      if (!controller.signal.aborted) {
        setRatings(data)
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setError("Não foi possível carregar suas avaliações.")
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void fetchRatings()
    return () => abortRef.current?.abort()
  }, [fetchRatings])

  return {
    ratings,
    isLoading,
    error,
    refetch: fetchRatings,
    setRatings, 
  }
}
