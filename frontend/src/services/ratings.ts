export type RatingDTO = {
  movie_id: number
  rating: number
}

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  })

  // DELETE -> 204 sem body
  if (res.status === 204) return undefined as T

  // rating não existe -> 404 (no GET)
  if (res.status === 404) {
    throw new Error("NOT_FOUND")
  }

  const data = (await res.json()) as T

  if (!res.ok) {
    throw new Error((data as any)?.error ?? `HTTP ${res.status}`)
  }

  return data
}

export async function getRating(movieId: number): Promise<RatingDTO | null> {
  try {
    return await apiFetch<RatingDTO>(`/api/ratings/${movieId}`)
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return null
    throw e
  }
}

export async function upsertRating(movieId: number, rating: number) {
  return apiFetch<RatingDTO>(`/api/ratings/${movieId}`, {
    method: "PUT",
    body: JSON.stringify({ rating }),
  })
}

export async function deleteRating(movieId: number) {
  await apiFetch<void>(`/api/ratings/${movieId}`, { method: "DELETE" })
}
