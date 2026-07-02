"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import type { listWishlistForUser } from "@/services/wishlist-service"
import { toggleWishlistAction } from "@/actions/wishlist-actions"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"

type WishlistItems = Awaited<ReturnType<typeof listWishlistForUser>>

export function WishlistGrid({ items }: { items: WishlistItems }) {
  const [list, setList] = useState(items)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleRemove(productId: string) {
    setPendingId(productId)
    startTransition(async () => {
      const result = await toggleWishlistAction(productId)
      if (result.success) {
        setList((prev) => prev.filter((item) => item.productId !== productId))
      } else {
        toast.error("Não foi possível remover o produto dos favoritos.")
      }
      setPendingId(null)
    })
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-card py-16 text-center ring-1 ring-foreground/10">
        <Heart className="size-10 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-heading text-lg text-foreground">Sua lista de favoritos está vazia</p>
          <p className="text-sm text-muted-foreground">Salve as peças que você mais gosta para encontrá-las facilmente depois.</p>
        </div>
        <Button asChild className="bg-gold-500 text-gold-foreground hover:bg-gold-400">
          <Link href="/">Explorar produtos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {list.map(({ product }) => {
        const image = product.images.find((i) => i.isPrimary) ?? product.images[0]
        const removing = isPending && pendingId === product.id

        return (
          <div key={product.id} className="group relative flex flex-col">
            <Link href={`/produto/${product.slug}`} className="flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                {image && (
                  <Image
                    src={image.url}
                    alt={image.altText || product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-2 space-y-0.5">
                <h3 className="font-heading text-sm leading-snug text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{formatCurrency(product.priceCents)}</p>
              </div>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={removing}
              aria-label={`Remover ${product.name} dos favoritos`}
              onClick={() => handleRemove(product.id)}
              className="absolute right-2 top-2 bg-background/80 backdrop-blur"
            >
              <Heart className="size-3.5 fill-destructive text-destructive" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
