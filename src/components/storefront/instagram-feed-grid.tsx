import Image from "next/image"
import Link from "next/link"
import { SectionHeading } from "@/components/shared/section-heading"
import { InstagramIcon } from "@/components/shared/social-icons"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/constants"

export type InstagramFeedItem = {
  id: string
  imageUrl: string
  alt: string
}

// Static placeholder feed — INSTAGRAM_GRAPH_ACCESS_TOKEN isn't configured
// yet in this environment. Swap the `items` prop for data fetched from the
// Instagram Graph API later without changing this component's shape.
const feedPhotos = [
  "blazer-azul-serenity-calca-jeans.jpg.jpeg",
  "blazer-verde-militar-blusa-branca-jeans.jpg.jpeg",
  "blusa-babados-preta-calca-alfaiataria-azul-marinho.jpg.jpeg",
  "blusa-babados-preta-calca-alfaiataria-azul-royal.jpg.jpeg",
  "blusa-babados-preta-calca-alfaiataria-preta.jpg.jpeg",
  "blusa-babados-preta-calca-alfaiataria-rose.jpg.jpeg",
  "blusa-frente-unica-off-white-calca-flare-vinho.jpg.jpeg",
  "colete-alfaiataria-caramelo-body-marrom-jeans.jpg.jpeg",
]

const fallbackFeed: InstagramFeedItem[] = feedPhotos.map((file, i) => ({
  id: `fallback-${i}`,
  imageUrl: `/uploads/products/${file}`,
  alt: "Publicação do Instagram da Anny Moda Executiva",
}))

export function InstagramFeedGrid({ items = fallbackFeed }: { items?: InstagramFeedItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="@annymodaexecutiva"
        title="Siga-nos no Instagram"
        description="Inspiração de estilo executivo todos os dias."
      />
      <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-sm bg-muted"
          >
            <Image
              src={item.imageUrl}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
              <InstagramIcon className="size-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
            Ver mais no Instagram
          </Link>
        </Button>
      </div>
    </section>
  )
}
