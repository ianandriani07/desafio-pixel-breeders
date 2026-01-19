import type { UserRating } from "@/hooks/use-user-ratings"
import { apiFetch } from "@/services/api"

export type RatingDTO = {
  movie_id: number
  rating: number
}

export async function getRating(movieId: number): Promise<RatingDTO | null> {
  try {
    return await apiFetch<RatingDTO>(`/ratings/${movieId}`)
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return null
    throw e
  }
}

export async function upsertRating(movieId: number, rating: number) {
  return apiFetch<RatingDTO>(`/ratings/${movieId}`, {
    method: "PUT",
    body: JSON.stringify({ rating }),
  })
}

export async function deleteRating(movieId: number) {
  await apiFetch<void>(`/ratings/${movieId}`, { method: "DELETE" })
}

export async function getUserRatings(signal?: AbortSignal): Promise<UserRating[]> {
  return apiFetch<UserRating[]>("/ratings/", { signal })
}
