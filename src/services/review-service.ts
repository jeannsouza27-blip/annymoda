import { prisma } from "@/lib/prisma"

export function listFeaturedTestimonials(take = 6) {
  return prisma.review.findMany({
    where: { isFeaturedTestimonial: true, isApproved: true },
    orderBy: { createdAt: "desc" },
    take,
  })
}

export function listApprovedReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: "desc" },
  })
}

export function listReviewsForModeration() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } }, user: { select: { name: true } } },
  })
}

export function setReviewApproval(id: string, isApproved: boolean) {
  return prisma.review.update({ where: { id }, data: { isApproved } })
}

export function setReviewFeatured(id: string, isFeaturedTestimonial: boolean) {
  return prisma.review.update({ where: { id }, data: { isFeaturedTestimonial } })
}

export function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } })
}

export function createReview(data: {
  productId?: string
  userId?: string
  authorName?: string
  rating: number
  title?: string
  comment: string
}) {
  return prisma.review.create({ data })
}
