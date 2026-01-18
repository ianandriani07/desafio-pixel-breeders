import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { RatingStars } from "@/components/rating-stars"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  id: number
  title: string
  posterPath: string | null
  userRating?: number | null
  onClick?: () => void
}

export function MovieCard({
  title,
  posterPath,
  userRating,
  onClick,
}: MovieCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden border-border bg-card transition-all duration-200",
        "hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
      )}
    >
      <CardContent className="p-0">
        <AspectRatio ratio={2 / 3}>
          <div className="h-full w-full bg-muted">
            {posterPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        </AspectRatio>

        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-card-foreground">
            {title}
          </h3>

          {userRating != null && (
            <div className="flex items-center gap-1">
              <RatingStars rating={userRating} readonly size="sm" />
              <span className="ml-1 text-xs text-muted-foreground">
                {userRating}/5
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
