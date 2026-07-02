"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { toggleWishlistAction } from "@/actions/wishlist-actions"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  initialActive = false,
  className,
}: {
  productId: string
  initialActive?: boolean
  className?: string
}) {
  const [active, setActive] = React.useState(initialActive)
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={active}
      disabled={isPending}
      className={cn("shrink-0", className)}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleWishlistAction(productId)
          if (result?.success) {
            setActive(result.added)
            toast.success(result.added ? "Adicionado aos favoritos" : "Removido dos favoritos")
          }
        })
      }}
    >
      <Heart className={cn("size-5", active && "fill-gold-500 text-gold-500")} />
    </Button>
  )
}
