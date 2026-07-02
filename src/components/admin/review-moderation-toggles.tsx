"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { setReviewApprovalAction, setReviewFeaturedAction } from "@/actions/review-actions"
import { Switch } from "@/components/ui/switch"

interface ReviewModerationTogglesProps {
  reviewId: string
  isApproved: boolean
  isFeaturedTestimonial: boolean
}

export function ReviewModerationToggles({
  reviewId,
  isApproved,
  isFeaturedTestimonial,
}: ReviewModerationTogglesProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleApprovedChange(checked: boolean) {
    startTransition(async () => {
      const result = await setReviewApprovalAction(reviewId, checked)
      if (!result.success) {
        toast.error("Não foi possível atualizar a aprovação.")
        return
      }
      toast.success(checked ? "Avaliação aprovada." : "Aprovação removida.")
      router.refresh()
    })
  }

  function handleFeaturedChange(checked: boolean) {
    startTransition(async () => {
      const result = await setReviewFeaturedAction(reviewId, checked)
      if (!result.success) {
        toast.error("Não foi possível atualizar o destaque.")
        return
      }
      toast.success(checked ? "Marcada como depoimento em destaque." : "Destaque removido.")
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={isApproved} onCheckedChange={handleApprovedChange} disabled={isPending} />
        Aprovada
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={isFeaturedTestimonial}
          onCheckedChange={handleFeaturedChange}
          disabled={isPending}
        />
        Depoimento em destaque
      </label>
    </div>
  )
}
