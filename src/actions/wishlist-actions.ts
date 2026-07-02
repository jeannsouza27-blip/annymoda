"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth-guards"
import { toggleWishlist } from "@/services/wishlist-service"

export async function toggleWishlistAction(productId: string) {
  const user = await requireUser()
  const result = await toggleWishlist(user.id, productId)
  revalidatePath("/favoritos")
  return { success: true as const, added: result.added }
}
