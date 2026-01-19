const API_BASE_PATH = "/api"

function normalizePath(path: string): string {
  if (/^[a-zA-Z0-9.-]+:\d+\//.test(path)) {
    return path.slice(path.indexOf("/"))
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path)
    return `${url.pathname}${url.search}${url.hash}`
  }

  return path
}

export function apiPath(path: string): string {
  const normalizedPath = normalizePath(path)

  if (!normalizedPath.startsWith("/")) {
    return `${API_BASE_PATH}/${normalizedPath}`
  }

  if (normalizedPath.startsWith(API_BASE_PATH)) {
    return normalizedPath
  }

  return `${API_BASE_PATH}${normalizedPath}`
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(apiPath(path), {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  })

  // DELETE -> 204 sem body
  if (res.status === 204) return undefined as T

  // recurso não encontrado
  if (res.status === 404) {
    throw new Error("NOT_FOUND")
  }

  const data = (await res.json()) as T

  if (!res.ok) {
    throw new Error((data as any)?.error ?? `HTTP ${res.status}`)
  }

  return data
}
