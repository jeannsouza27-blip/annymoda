"use client"

import * as React from "react"
import Image from "next/image"
import type { ProductImage } from "@prisma/client"
import { cn } from "@/lib/utils"

export function ProductImageGallery({
  images,
  productName,
}: {
  images: ProductImage[]
  productName: string
}) {
  const [active, setActive] = React.useState(0)

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full rounded-md bg-muted" />
  }

  const current = images[active] ?? images[0]

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-current={index === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors sm:size-20",
                index === active ? "border-gold-500" : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || productName}
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-md bg-muted">
        <Image
          src={current.url}
          alt={current.altText || productName}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
