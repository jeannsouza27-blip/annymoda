import type { Review } from "@prisma/client"
import { SectionHeading } from "@/components/shared/section-heading"
import { TestimonialCard } from "@/components/storefront/testimonial-card"

export function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Depoimentos"
        title="Quem veste, recomenda"
        description="Histórias reais de mulheres que encontraram na Anny a peça certa para cada momento de liderança."
      />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}
