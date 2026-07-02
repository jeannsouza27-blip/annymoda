import { prisma } from "@/lib/prisma"
import type { BannerPlacement } from "@prisma/client"

export function listActiveBanners(placement: BannerPlacement) {
  const now = new Date()
  return prisma.banner.findMany({
    where: {
      placement,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] }],
    },
    orderBy: { position: "asc" },
  })
}

export function listAllBanners() {
  return prisma.banner.findMany({ orderBy: { position: "asc" } })
}

export function getBannerById(id: string) {
  return prisma.banner.findUnique({ where: { id } })
}

export function createBanner(data: {
  title: string
  subtitle?: string
  imageUrl: string
  imageMobileUrl?: string
  ctaLabel?: string
  ctaHref?: string
  placement?: BannerPlacement
  position?: number
  startsAt?: Date | null
  expiresAt?: Date | null
  isActive?: boolean
}) {
  return prisma.banner.create({ data })
}

export function updateBanner(id: string, data: Partial<Parameters<typeof createBanner>[0]>) {
  return prisma.banner.update({ where: { id }, data })
}

export function deleteBanner(id: string) {
  return prisma.banner.delete({ where: { id } })
}
