import { Star, Trash2 } from "lucide-react"
import { listReviewsForModeration } from "@/services/review-service"
import { deleteReviewAction } from "@/actions/review-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { ReviewModerationToggles } from "@/components/admin/review-moderation-toggles"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-gold-500 text-gold-500" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}

export default async function AdminReviewsPage() {
  const reviews = await listReviewsForModeration()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Avaliações</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length} avaliações recebidas — modere aprovação e destaques
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma avaliação recebida ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-medium text-foreground">
                        {review.user?.name ?? review.authorName ?? "Anônimo"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.product?.name ?? "Depoimento geral"} · {formatDate(review.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {review.isApproved && <Badge variant="secondary">Aprovada</Badge>}
                    {review.isFeaturedTestimonial && (
                      <Badge className="bg-gold-500 text-gold-foreground hover:bg-gold-500">
                        Destaque
                      </Badge>
                    )}
                    <ConfirmDeleteDialog
                      title="Excluir avaliação"
                      description="Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita."
                      onConfirm={async () => {
                        "use server"
                        await deleteReviewAction(review.id)
                      }}
                      trigger={
                        <Button variant="ghost" size="icon-sm" aria-label="Excluir avaliação">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      }
                    />
                  </div>
                </div>

                {review.title && (
                  <p className="text-sm font-medium text-foreground">{review.title}</p>
                )}
                <p className="text-sm text-muted-foreground">{review.comment}</p>

                <ReviewModerationToggles
                  reviewId={review.id}
                  isApproved={review.isApproved}
                  isFeaturedTestimonial={review.isFeaturedTestimonial}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
