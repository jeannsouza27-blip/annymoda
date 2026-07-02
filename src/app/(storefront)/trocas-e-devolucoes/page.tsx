import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/shared/section-heading"
import { whatsappHref, siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Conheça o prazo e o processo de trocas e devoluções da Anny Moda Executiva.",
}

export default function TrocasEDevolucoesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        align="left"
        eyebrow="Política de trocas"
        title="Trocas e Devoluções"
        description="Queremos que você se sinta segura em comprar com a gente."
      />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">1. Direito de arrependimento (7 dias)</h2>
          <p>
            Em conformidade com o Código de Defesa do Consumidor (art. 49, Lei nº 8.078/1990),
            você tem até <strong className="text-foreground">7 (sete) dias corridos</strong>, a
            contar do recebimento do produto, para solicitar a devolução por arrependimento da
            compra, sem necessidade de justificativa. Nesse caso, o valor pago — incluindo o
            frete — é reembolsado integralmente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">2. Trocas por tamanho ou defeito</h2>
          <p>
            Além do prazo de arrependimento, você pode solicitar a troca por outro tamanho em até{" "}
            <strong className="text-foreground">30 dias corridos</strong> após o recebimento,
            sujeita à disponibilidade de estoque. Produtos com defeito de fabricação podem ser
            trocados ou devolvidos em até 90 dias, conforme o CDC.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">3. Condições para troca ou devolução</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>A peça não pode ter sido usada, lavada ou alterada;</li>
            <li>Etiquetas originais devem estar fixadas à peça;</li>
            <li>O produto deve ser devolvido na embalagem original, sempre que possível;</li>
            <li>É necessário apresentar o número do pedido ou nota fiscal.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">4. Como solicitar</h2>
          <p>
            Entre em contato pelo{" "}
            <a
              href={whatsappHref("Olá! Gostaria de solicitar uma troca ou devolução.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400"
            >
              WhatsApp
            </a>{" "}
            ou pelo e-mail{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
              {siteConfig.email}
            </a>{" "}
            informando o número do pedido e o motivo da troca ou devolução. Nossa equipe vai
            orientar sobre o envio da peça e os próximos passos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">5. Reembolsos</h2>
          <p>
            Após recebermos e conferirmos o produto devolvido, o reembolso é processado em até 10
            dias úteis, utilizando o mesmo meio de pagamento da compra original (estorno no
            cartão) ou via PIX, quando aplicável. Trocas por outro tamanho são enviadas sem custo
            adicional de frete.
          </p>
        </section>

        <p>
          Consulte também nossos{" "}
          <Link href="/termos-de-uso" className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
            Termos de Uso
          </Link>{" "}
          e nossa{" "}
          <Link href="/politica-de-privacidade" className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
