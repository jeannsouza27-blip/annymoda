import type { Review } from "@prisma/client"
import { StarRating } from "@/components/storefront/star-rating"
import { formatDate } from "@/lib/format"

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este produto ainda não tem avaliações. Seja a primeira a avaliar.
      </p>
    )
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-border pb-6 last:border-0">
          <div className="flex items-center justify-between gap-4">
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>
          {review.title && <p className="mt-2 font-heading text-base">{review.title}</p>}
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-foreground/70">
            {review.authorName ?? "Cliente Anny"}
          </p>
        </li>
      ))}
    </ul>
  )
}
