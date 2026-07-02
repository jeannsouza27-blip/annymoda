"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireUser } from "@/lib/auth-guards"
import {
  createReview,
  deleteReview,
  setReviewApproval,
  setReviewFeatured,
} from "@/services/review-service"

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Conte um pouco mais sobre sua experiência."),
})

export async function submitReviewAction(input: unknown) {
  const user = await requireUser()
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  await createReview({ ...parsed.data, userId: user.id, authorName: user.name ?? undefined })
  revalidatePath("/admin/avaliacoes")
  return { success: true as const }
}

export async function setReviewApprovalAction(id: string, isApproved: boolean) {
  await requireAdmin()
  await setReviewApproval(id, isApproved)
  revalidatePath("/admin/avaliacoes")
  revalidatePath("/")
  return { success: true as const }
}

export async function setReviewFeaturedAction(id: string, isFeaturedTestimonial: boolean) {
  await requireAdmin()
  await setReviewFeatured(id, isFeaturedTestimonial)
  revalidatePath("/admin/avaliacoes")
  revalidatePath("/")
  return { success: true as const }
}

export async function deleteReviewAction(id: string) {
  await requireAdmin()
  await deleteReview(id)
  revalidatePath("/admin/avaliacoes")
  return { success: true as const }
}
