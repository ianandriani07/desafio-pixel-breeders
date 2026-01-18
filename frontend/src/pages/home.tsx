import type { KeyboardEventHandler } from "react"
import { Search } from "lucide-react"

import { MovieCard } from "@/components/movie-card"
import { MovieCardSkeleton } from "@/components/movie-card-skeleton"
import { MovieDetailsDialog } from "@/components/movie-details-dialog"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { useMovieDetailsDialog } from "@/hooks/use-movie-details-dialog"
import { useMovieSearch } from "@/hooks/use-movie-search"
import { useTrendingMovies } from "@/hooks/use-trending-movies"

export function HomePage() {
  const {
    query,
    setQuery,
    hasSearched,
    results,
    isLoading: isSearchLoading,
    error: searchError,
    search,
  } = useMovieSearch()

  const {
    movies: trending,
    isLoading: isTrendingLoading,
    error: trendingError,
  } = useTrendingMovies()

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

  const handleSearch = async () => {
    await search()
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      void handleSearch()
    }
  }

  const moviesToShow = hasSearched ? results : trending
  const sectionTitle = hasSearched
    ? `Resultados para "${query}"`
    : "Em alta hoje"

  const isLoading = hasSearched ? isSearchLoading : isTrendingLoading
  const error = hasSearched ? searchError : trendingError

  return (
    <>
      <section className="container mx-auto mb-12 px-4 py-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
          Descubra e Avalie Filmes
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Pesquise seus filmes favoritos, veja detalhes e deixe sua avaliação.
        </p>

        {/* Search */}
        <section className="mb-10 flex items-center justify-center gap-2">
          <InputGroup className="h-14 w-full max-w-2xl">
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar filmes..."
              className="h-14 text-lg"
            />
            <InputGroupAddon className="h-14 px-3">
              <Search className="size-6 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          <Button
            className="h-14 px-7 text-lg"
            onClick={handleSearch}
            disabled={!query.trim()}
          >
            Buscar
          </Button>
        </section>

        {/* Title */}
        <h2 className="mb-4 text-left text-xl font-semibold text-foreground">
          {sectionTitle}
        </h2>

        {/* States */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-destructive">{error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {moviesToShow.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
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
        onRatingChange={handleRatingChange}
        isSavingRating={isSavingRating}
        ratingError={ratingError}
        onRetry={retry}
      />
    </>
  )
}
