const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_TOKEN = import.meta.env.VITE_TMDB_API_KEY

export type PaginatedResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MovieSummary = {
  id: number
  title: string
  poster_path: string | null
}

export type MovieDetails = MovieSummary & {
  overview?: string
  release_date?: string
}

export type CastMember = {
  id: number
  name: string
  character: string
}

async function tmdbFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${TMDB_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
    signal,
  })

  if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export async function getTrendingMovies(page = 1, signal?: AbortSignal) {
  return tmdbFetch<PaginatedResponse<MovieSummary>>(
    `/trending/movie/day?language=pt-BR&page=${page}`,
    signal,
  )
}

export async function searchMovies(query: string, page = 1, signal?: AbortSignal) {
  return tmdbFetch<PaginatedResponse<MovieSummary>>(
    `/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`,
    signal,
  )
}

export async function getMovieDetails(movieId: number, signal?: AbortSignal) {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}?language=pt-BR`, signal)
}

export async function getMovieCredits(movieId: number, signal?: AbortSignal) {
  const data = await tmdbFetch<{ cast: CastMember[] }>(
    `/movie/${movieId}/credits?language=pt-BR`,
    signal,
  )
  return data.cast ?? []
}
