import { useCallback, useRef, useState } from "react"

import type { CastMember, MovieDetails } from "@/services/tmdb"
import { getMovieCredits, getMovieDetails } from "@/services/tmdb"
import { deleteRating, getRating, upsertRating } from "@/services/ratings"

export function useMovieDetailsDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isDetailsError, setIsDetailsError] = useState(false)
  const [lastMovieId, setLastMovieId] = useState<number | null>(null)

  const [userRating, setUserRating] = useState<number | null>(null)
  const [isSavingRating, setIsSavingRating] = useState(false)
  const [ratingError, setRatingError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const closeDialog = useCallback(() => {
    abortRef.current?.abort()
    setIsDialogOpen(false)
    setSelectedMovie(null)
    setCast([])
    setUserRating(null)
    setRatingError(null)
    setIsDetailsError(false)
    setIsLoadingDetails(false)
  }, [])

  const openMovie = useCallback(async (movieId: number) => {
    setLastMovieId(movieId)
    setIsDialogOpen(true)
    setIsLoadingDetails(true)
    setIsDetailsError(false)
    setRatingError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = ++requestIdRef.current

    try {
      const [movieDetails, credits] = await Promise.all([
        getMovieDetails(movieId, controller.signal),
        getMovieCredits(movieId, controller.signal),
      ])

      if (controller.signal.aborted || requestId !== requestIdRef.current) return

      setSelectedMovie(movieDetails)
      setCast(credits)

      try {
        const rating = await getRating(movieId)
        if (requestId !== requestIdRef.current) return
        setUserRating(rating?.rating ?? null)
      } catch (err) {
        if (requestId !== requestIdRef.current) return
        setRatingError("Não foi possível carregar sua avaliação.")
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setIsDetailsError(true)
    } finally {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        setIsLoadingDetails(false)
      }
    }
  }, [])

  const handleRatingChange = useCallback(
    async (rating: number | null) => {
      if (!selectedMovie) return

      const prev = userRating
      setUserRating(rating)
      setIsSavingRating(true)
      setRatingError(null)

      try {
        if (rating === null) {
          await deleteRating(selectedMovie.id)
          setUserRating(null)
        } else {
          const saved = await upsertRating(selectedMovie.id, rating)
          setUserRating(saved.rating)
        }
      } catch (err) {
        console.error(err)
        setUserRating(prev)
        setRatingError("Não foi possível salvar sua avaliação. Tente novamente.")
      } finally {
        setIsSavingRating(false)
      }
    },
    [selectedMovie, userRating]
  )

  const retry = useCallback(() => {
    if (lastMovieId) {
      void openMovie(lastMovieId)
    }
  }, [lastMovieId, openMovie])

  return {
    isDialogOpen,
    selectedMovie,
    cast,
    isLoadingDetails,
    isDetailsError,
    lastMovieId,
    userRating,
    isSavingRating,
    ratingError,
    openMovie,
    closeDialog,
    handleRatingChange,
    retry,
  }
}
