import { requireUser } from "@/lib/auth-guards"
import { listWishlistForUser } from "@/services/wishlist-service"
import { WishlistGrid } from "@/components/account/wishlist-grid"

export default async function FavoritosPage() {
  const user = await requireUser()
  const wishlist = await listWishlistForUser(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Favoritos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Os produtos que você salvou para ver mais tarde.</p>
      </div>

      <WishlistGrid items={wishlist} />
    </div>
  )
}
