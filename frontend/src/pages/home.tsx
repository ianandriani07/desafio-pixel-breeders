import { Search } from "lucide-react"
import { useState, useEffect } from "react"

import { MovieCard } from "@/components/movie-card"
import { MovieCardSkeleton } from "@/components/movie-card-skeleton"
import { MovieDetailsDialog } from "@/components/movie-details-dialog"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { getRating, upsertRating, deleteRating } from "@/services/ratings"

type Movie = {
  id: number
  title: string
  poster_path: string | null
}

type CastMember = {
  id: number
  name: string
  character: string
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_KEY

async function tmdbFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${TMDB_BASE_URL}${path}`, {
        headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
        },
    })
    if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`)
    return res.json() as Promise<T>
}


export function HomePage() {

    const [query, setQuery] = useState("")
    const [hasSearched, setHasSearched] = useState(false)

    const [trending, setTrending] = useState<Movie[]>([])
    const [results, setResults] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
    const [cast, setCast] = useState<CastMember[]>([])
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isDetailsError, setIsDetailsError] = useState(false)
    const [lastMovieId, setLastMovieId] = useState<number | null>(null)

    const [userRating, setUserRating] = useState<number | null>(null)
    const [isSavingRating, setIsSavingRating] = useState(false)
    const [ratingError, setRatingError] = useState<string | null>(null)

    async function fetchUserRating(movieId: number): Promise<number | null> {
        const dto = await getRating(movieId)
        return dto?.rating ?? null
    }


    useEffect(() => {
        
        const fetchTrending = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const data = await tmdbFetch<{ results: Movie[] }>(
                `/trending/movie/day?language=pt-BR`
                )
                setTrending(data.results)
            } catch {
                setError("Não foi possível carregar os filmes em alta.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTrending()
    }, [])


    const handleSearch = async () => {
        const q = query.trim()
        setHasSearched(true)

        if (!q) {
            setResults([])
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            const data = await tmdbFetch<{ results: Movie[] }>(
                `/search/movie?query=${encodeURIComponent(q)}&language=pt-BR`
            )
            setResults(data.results)
        } catch {
            setError("Erro ao buscar filmes.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") handleSearch()
    }

    const moviesToShow = hasSearched ? results : trending
    const sectionTitle = hasSearched
        ? `Resultados para "${query}"`
        : "Em alta hoje"

    const openMovie = async (movieId: number) => {
        setLastMovieId(movieId)
        setIsDialogOpen(true)
        setIsLoadingDetails(true)
        setIsDetailsError(false)
        setRatingError(null)

        try {
            const [movieDetails, credits] = await Promise.all([
                tmdbFetch<Movie>(`/movie/${movieId}?language=pt-BR`),
                tmdbFetch<{ cast: CastMember[] }>(`/movie/${movieId}/credits?language=pt-BR`),
            ])

            setSelectedMovie(movieDetails)
            setCast(credits.cast ?? [])

            // rating (backend) - se você ainda não tem GET, vai ficar null e beleza.
            const rating = await fetchUserRating(movieId)
            setUserRating(rating)
        } catch {
            setIsDetailsError(true)
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setSelectedMovie(null)
        setCast([])
        setUserRating(null)
        setRatingError(null)
        setIsDetailsError(false)
        setIsLoadingDetails(false)
    }

    const handleRatingChange = async (rating: number | null) => {
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
        } catch (e) {
            console.error(e)
            setUserRating(prev)
            setRatingError("Não foi possível salvar sua avaliação. Tente novamente.")
        } finally {
            setIsSavingRating(false)
        }
    }


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
                    {moviesToShow.map((m) => (
                        <MovieCard
                        key={m.id}
                        id={m.id}
                        title={m.title}
                        posterPath={m.poster_path}
                        onClick={() => openMovie(m.id)}
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
                onRetry={() => lastMovieId && openMovie(lastMovieId)}
            />
        </>
    )
}
