"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import { createBanner, deleteBanner, updateBanner } from "@/services/banner-service"

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Envie uma imagem."),
  imageMobileUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  placement: z.enum(["HERO", "PROMO_STRIP", "CATEGORY_TOP"]).optional(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function createBannerAction(input: unknown) {
  await requireAdmin()
  const parsed = bannerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const banner = await createBanner(parsed.data)
  revalidatePath("/admin/banners")
  revalidatePath("/")
  return { success: true as const, banner }
}

export async function updateBannerAction(id: string, input: unknown) {
  await requireAdmin()
  const parsed = bannerSchema.partial().safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const banner = await updateBanner(id, parsed.data)
  revalidatePath("/admin/banners")
  revalidatePath("/")
  return { success: true as const, banner }
}

export async function deleteBannerAction(id: string) {
  await requireAdmin()
  await deleteBanner(id)
  revalidatePath("/admin/banners")
  revalidatePath("/")
  return { success: true as const }
}
