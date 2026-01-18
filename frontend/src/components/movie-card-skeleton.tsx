import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        {/* Poster */}
        <AspectRatio ratio={2 / 3}>
          <Skeleton className="h-full w-full rounded-none" />
        </AspectRatio>

        {/* Text */}
        <div className="space-y-2 p-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}
