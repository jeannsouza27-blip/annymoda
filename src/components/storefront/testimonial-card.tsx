import type { Review } from "@prisma/client"
import { StarRating } from "@/components/storefront/star-rating"

export function TestimonialCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-4 rounded-md border border-border bg-card p-6">
      <StarRating rating={review.rating} />
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{review.comment}&rdquo;
      </blockquote>
      <figcaption className="text-sm">
        {review.title && (
          <span className="block font-heading text-base text-foreground">{review.title}</span>
        )}
        <span className="text-muted-foreground">{review.authorName ?? "Cliente Anny"}</span>
      </figcaption>
    </figure>
  )
}
