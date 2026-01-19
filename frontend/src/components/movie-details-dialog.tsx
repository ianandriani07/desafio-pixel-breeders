import { X, Calendar, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RatingStars } from "@/components/rating-stars"
import type { CastMember, MovieDetails } from "@/services/tmdb"

interface MovieDetailsDialogProps {
  movie: MovieDetails | null
  isOpen: boolean
  onClose: () => void

  // loading/erro dos detalhes (TMDB)
  isLoadingDetails?: boolean
  isError?: boolean
  cast?: CastMember[]
  onRetry?: () => void

  // rating (backend)
  userRating: number | null
  onRatingChange: (rating: number | null) => void
  isSavingRating?: boolean
  ratingError?: string | null
}

export function MovieDetailsDialog({
  movie,
  isOpen,
  onClose,

  isLoadingDetails = false,
  isError = false,
  cast = [],
  onRetry,

  userRating,
  onRatingChange,
  isSavingRating = false,
  ratingError = null,
}: MovieDetailsDialogProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data desconhecida"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const shouldShowLoading = isLoadingDetails || !movie
  const shouldShowError = isError && !shouldShowLoading
  const shouldShowContent = !!movie && !shouldShowLoading && !shouldShowError

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto border-border bg-card p-0 sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{movie?.title ?? "Detalhes do filme"}</DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {shouldShowLoading ? (
          <MovieDetailsSkeleton />
        ) : shouldShowError ? (
          <MovieDetailsError onRetry={onRetry ?? (() => {})} />
        ) : shouldShowContent ? (
          <div className="flex flex-col gap-6 p-6 md:flex-row">
            {/* Poster */}
            <div className="mx-auto flex-shrink-0 md:mx-0">
              <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg bg-muted md:w-56">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      Sem imagem
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-5">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-card-foreground">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              </div>

              {/* Synopsis */}
              {movie.overview && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-card-foreground">
                    Sinopse
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <Users className="h-4 w-4" />
                    Elenco Principal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cast.slice(0, 8).map((member) => (
                      <Badge
                        key={member.id}
                        variant="secondary"
                        className="text-xs"
                        title={member.character}
                      >
                        {member.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">
                  Sua Avaliação
                </h3>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className={
                      isSavingRating ? "pointer-events-none opacity-70" : ""
                    }
                  >
                    <RatingStars
                      rating={userRating}
                      onRate={onRatingChange}
                      size="lg"
                    />
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {userRating
                      ? `${userRating}/5 - Clique na mesma estrela para remover`
                      : "Clique para avaliar"}
                    {isSavingRating ? " • Salvando..." : null}
                  </span>
                </div>

                {ratingError ? (
                  <p className="mt-2 text-sm text-destructive">{ratingError}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <MovieDetailsError onRetry={onRetry ?? (() => {})} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function MovieDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row">
      <div className="mx-auto flex-shrink-0 md:mx-0">
        <Skeleton className="aspect-[2/3] w-48 rounded-lg md:w-56" />
      </div>
      <div className="flex-1 space-y-5">
        <div>
          <Skeleton className="mb-2 h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <Skeleton className="mb-3 h-4 w-28" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </div>
  )
}

function MovieDetailsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <p className="mb-4 text-muted-foreground">
        Ocorreu um erro ao carregar os detalhes do filme.
      </p>
      <Button onClick={onRetry} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
