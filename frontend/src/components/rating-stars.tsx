"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number | null
  onRate?: (rating: number | null) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingStars({
  rating,
  onRate,
  readonly = false,
  size = "md",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const handleClick = (starIndex: number) => {
    if (readonly || !onRate) return

    if (rating === starIndex) {
      onRate(null)
    } else {
      onRate(starIndex)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          className={cn(
            "transition-all duration-150",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
          aria-label={`Avaliar ${star} estrela${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              rating !== null && star <= rating
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground hover:text-accent/70"
            )}
          />
        </button>
      ))}
    </div>
  )
}
