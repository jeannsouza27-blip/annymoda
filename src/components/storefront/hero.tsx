import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Banner } from "@prisma/client"

export function Hero({ banner }: { banner: Banner }) {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-primary text-primary-foreground">
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 sm:pb-24">
        {banner.subtitle && (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-gold-400">
            {banner.subtitle}
          </p>
        )}
        <h1 className="max-w-2xl font-heading text-4xl italic leading-[1.1] text-white sm:text-6xl">
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
