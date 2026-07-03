import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Banner } from "@prisma/client"

export function Hero({ banner }: { banner: Banner }) {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] w-full items-center overflow-hidden bg-primary text-primary-foreground sm:h-[85vh] sm:min-h-[560px]">
      {/* This banner photo was shot wide (landscape) specifically for this
          slot, with clear space on the left for text — a plain full-bleed
          cover works well here, unlike the tall 9:16 product photos. */}
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8">
        {banner.subtitle && (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-gold-400">
            {banner.subtitle}
          </p>
        )}
        <h1 className="max-w-lg font-heading text-4xl italic leading-[1.1] text-white sm:max-w-xl sm:text-6xl">
          {banner.title}
        </h1>
        {banner.ctaLabel && banner.ctaHref && (
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-gold-500 px-8 text-sm uppercase tracking-widest text-gold-foreground hover:bg-gold-400"
            >
              <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
