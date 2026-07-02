import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({
  rating,
  className,
  size = 16,
}: {
  rating: number
  className?: string
  size?: number
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} de 5 estrelas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={
            i < Math.round(rating)
              ? "fill-gold-500 text-gold-500"
              : "fill-transparent text-muted-foreground/40"
          }
        />
      ))}
    </div>
  )
}
