import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { whatsappHref } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Nossa história",
  description:
    "Conheça a história da Anny Moda Executiva: uma marca criada por mãe e filha para vestir mulheres que lideram.",
}

export default function SobrePage() {
  return (
    <div>
      <section className="relative flex h-[50vh] min-h-[340px] items-center justify-center overflow-hidden bg-sidebar text-center">
        <Image
          src="https://picsum.photos/seed/anny-atelie/1600/900"
          alt="Ateliê da Anny Moda Executiva"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="relative z-10 px-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-gold-400">
            Nossa história
          </p>
          <h1 className="font-heading text-4xl italic text-white sm:text-5xl">
            Duas gerações, um mesmo propósito
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
        <p className="leading-relaxed text-muted-foreground">
          A Anny Moda Executiva começou em uma mesa de cozinha, entre uma mãe com décadas de
          experiência em alfaiataria e sua filha, recém-formada em moda e movida pela vontade de
          reinventar o guarda-roupa das mulheres que trabalham. A pergunta que deu origem à marca
          era simples: por que é tão difícil encontrar roupas que sejam, ao mesmo tempo,
          confortáveis, atemporais e à altura de uma sala de reunião?
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Dessa inquietação nasceu uma coleção pensada do zero para mulheres executivas,
          empreendedoras e profissionais liberais — peças com caimento impecável, tecidos nobres e
          um design que transita com naturalidade da reunião de diretoria ao jantar de negócios.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Hoje, seguimos sendo uma empresa familiar no coração e na prática. Cada pedido é tratado
          com atenção pessoal: acompanhamos o processo de escolha, ajudamos com dúvidas sobre caimento
          e tamanho, e tratamos cada cliente como parte da nossa própria história. Acreditamos que
          vestir-se bem é também um ato de autoconfiança — e é isso que queremos oferecer a cada
          mulher que veste Anny.
        </p>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-2">
            <h3 className="font-heading text-xl">Atendimento personalizado</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Da escolha do tamanho ao acompanhamento pós-venda, cada cliente é atendida com
              atenção individual, como em um ateliê de bairro.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-xl">Qualidade que dura</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Selecionamos tecidos e acabamentos pensando no uso diário — peças feitas para
              acompanhar uma rotina intensa por muitas estações.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-xl">Feito para quem lidera</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Desenhamos cada coleção pensando em mulheres à frente de negócios, equipes e
              projetos — porque moda executiva também é ferramenta de trabalho.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <SectionHeading title="Vamos conversar?" description="Estamos sempre à disposição para ajudar você a encontrar a peça ideal." />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
            <a
              href={whatsappHref("Olá! Gostaria de saber mais sobre a Anny Moda Executiva.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contato">Ver outros contatos</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
