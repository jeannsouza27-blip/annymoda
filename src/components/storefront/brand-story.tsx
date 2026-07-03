import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function BrandStory() {
  return (
    <section className="bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <Image
            src="/uploads/products/blazer-azul-serenity-calca-jeans.jpg.jpeg"
            alt="Look Anny Moda Executiva"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain"
          />
        </div>

        <div className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-600 dark:text-gold-400">
            Nossa história
          </p>
          <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
            Feito por mãe e filha, para mulheres que não param.
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            A Anny Moda Executiva nasceu de uma parceria entre mãe e filha que dividiam a mesma
            inquietação: por que era tão difícil encontrar roupas que unissem elegância, conforto
            e a seriedade que uma reunião de negócios exige? Da experiência de uma com décadas de
            alfaiataria e do olhar contemporâneo da outra, nasceu uma marca com propósito claro —
            vestir mulheres que constroem carreiras, empresas e legados.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Cada peça é pensada para acompanhar uma rotina intensa sem abrir mão da sofisticação.
            Atendemos com atenção quase artesanal: da escolha do tecido ao ajuste final, cuidamos
            de cada detalhe como se estivéssemos vestindo alguém da nossa própria família — porque,
            no fundo, é assim que enxergamos cada cliente.
          </p>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:text-gold-600 dark:hover:text-gold-400"
          >
            Conheça nossa história completa
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
