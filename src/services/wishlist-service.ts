import { prisma } from "@/lib/prisma"

export function listWishlistForUser(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { images: true } } },
  })
}

export async function toggleWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  })

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    return { added: false }
  }

  await prisma.wishlistItem.create({ data: { userId, productId } })
  return { added: true }
}

export async function isInWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  return !!existing
}
