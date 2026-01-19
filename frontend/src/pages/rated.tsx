import { useEffect, useState } from "react"

import { MovieCard } from "@/components/movie-card"
import { MovieCardSkeleton } from "@/components/movie-card-skeleton"
import { MovieDetailsDialog } from "@/components/movie-details-dialog"

import { useMovieDetailsDialog } from "@/hooks/use-movie-details-dialog"
import { useUserRatings } from "@/hooks/use-user-ratings"

import { getMovieDetails } from "@/services/tmdb"
import type { MovieDetails } from "@/services/tmdb"

type RatedMovie = MovieDetails & {
  userRating: number
}

export function RatedPage() {
  const { ratings, isLoading, error, setRatings } = useUserRatings()

  const [movies, setMovies] = useState<RatedMovie[]>([])
  const [isResolvingMovies, setIsResolvingMovies] = useState(false)
  const [resolveError, setResolveError] = useState<string | null>(null)

  useEffect(() => {
    if (!ratings.length) {
      setMovies([])
      return
    }

    let cancelled = false

    const resolveMovies = async () => {
      try {
        setIsResolvingMovies(true)
        setResolveError(null)

        const results = await Promise.allSettled(
          ratings.map(async (r) => {
            const movie = await getMovieDetails(r.tmdb_movie_id)
            return {
              ...movie,
              userRating: r.rating,
            }
          }),
        )

        if (cancelled) return

        const fulfilled = results.filter(
          (result): result is PromiseFulfilledResult<RatedMovie> =>
            result.status === "fulfilled",
        )

        const rejected = results.filter(
          (result) => result.status === "rejected",
        )

        setMovies(fulfilled.map((result) => result.value))

        if (rejected.length > 0) {
          setResolveError(
            "Não foi possível carregar alguns filmes avaliados.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsResolvingMovies(false)
        }
      }
    }

    void resolveMovies()

    return () => {
      cancelled = true
    }
  }, [ratings])

  const {
    isDialogOpen,
    selectedMovie,
    cast,
    isLoadingDetails,
    isDetailsError,
    userRating,
    isSavingRating,
    ratingError,
    openMovie,
    closeDialog,
    handleRatingChange,
    retry,
  } = useMovieDetailsDialog()

  const onRatingChange = async (rating: number | null) => {
    await handleRatingChange(rating)

    if (!selectedMovie) return

    // DELETE
    if (rating === null) {
      setRatings((prev) =>
        prev.filter((r) => r.tmdb_movie_id !== selectedMovie.id)
      )
      setMovies((prev) => prev.filter((m) => m.id !== selectedMovie.id))
      return
    }

    // UPSERT (update ou add)
    setRatings((prev) => {
      const exists = prev.some((r) => r.tmdb_movie_id === selectedMovie.id)

      if (!exists) {
        // adiciona (pode ser no topo)
        return [{ tmdb_movie_id: selectedMovie.id, rating }, ...prev]
      }

      return prev.map((r) =>
        r.tmdb_movie_id === selectedMovie.id ? { ...r, rating } : r
      )
    })

    setMovies((prev) => {
      const exists = prev.some((m) => m.id === selectedMovie.id)

      if (!exists) {
        // como você já tem os detalhes no modal (selectedMovie), dá pra inserir sem refetch
        const newMovie: RatedMovie = { ...selectedMovie, userRating: rating }
        return [newMovie, ...prev]
      }

      return prev.map((m) =>
        m.id === selectedMovie.id ? { ...m, userRating: rating } : m
      )
    })
  }


  const showLoading = isLoading || isResolvingMovies
  const showError = error ?? resolveError

  return (
    <>
      <section className="container mx-auto mb-12 px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold text-foreground">
          Filmes Avaliados
        </h1>

        {showLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!showLoading && showError && (
          <p className="text-destructive">{showError}</p>
        )}

        {!showLoading && !showError && movies.length === 0 && (
          <p className="text-muted-foreground">
            Você ainda não avaliou nenhum filme 🎬⭐
          </p>
        )}

        {!showLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                userRating={movie.userRating}
                onClick={() => openMovie(movie.id)}
              />
            ))}
          </div>
        )}
      </section>

      <MovieDetailsDialog
        movie={selectedMovie}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        isLoadingDetails={isLoadingDetails}
        isError={isDetailsError}
        cast={cast}
        userRating={userRating}
        onRatingChange={onRatingChange}
        isSavingRating={isSavingRating}
        ratingError={ratingError}
        onRetry={retry}
      />
    </>
  )
}
