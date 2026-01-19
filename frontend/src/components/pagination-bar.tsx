import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function getVisiblePages(current: number, total: number) {
  
  const pages: (number | "ellipsis")[] = []

  const clamp = (n: number) => Math.max(1, Math.min(total, n))

  const showLeftEllipsis = current > 4
  const showRightEllipsis = current < total - 3

  pages.push(1)

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (showLeftEllipsis) pages.push("ellipsis")

  const start = clamp(current - 1)
  const end = clamp(current + 1)

  // se estiver perto do começo
  if (!showLeftEllipsis) {
    pages.push(2, 3, 4, 5)
  } else if (!showRightEllipsis) {
    // perto do fim
    pages.push(total - 4, total - 3, total - 2, total - 1)
  } else {
    // meio
    for (let p = start; p <= end; p++) {
      if (p !== 1 && p !== total) pages.push(p)
    }
  }

  if (showRightEllipsis) pages.push("ellipsis")

  pages.push(total)

  // remove duplicatas/acidentes
  const cleaned: (number | "ellipsis")[] = []
  for (const it of pages) {
    const last = cleaned[cleaned.length - 1]
    if (it === "ellipsis" && last === "ellipsis") continue
    cleaned.push(it)
  }

  return cleaned
}

type PaginationBarProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
  maxTotalPages?: number 
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  disabled,
  className,
  maxTotalPages,
}: PaginationBarProps) {
  const safeTotal = Math.max(
    1,
    maxTotalPages ? Math.min(totalPages, maxTotalPages) : totalPages,
  )

  if (safeTotal <= 1) return null

  const canPrev = page > 1
  const canNext = page < safeTotal

  const visible = getVisiblePages(page, safeTotal)

  const go = (p: number) => {
    if (disabled) return
    if (p < 1 || p > safeTotal) return
    if (p === page) return
    onPageChange(p)
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (canPrev) go(page - 1)
            }}
            aria-disabled={disabled || !canPrev}
          />
        </PaginationItem>

        {visible.map((it, idx) =>
          it === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink
                href="#"
                isActive={it === page}
                onClick={(e) => {
                  e.preventDefault()
                  go(it)
                }}
                aria-disabled={disabled}
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (canNext) go(page + 1)
            }}
            aria-disabled={disabled || !canNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
