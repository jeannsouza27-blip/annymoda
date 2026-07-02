import type { Metadata } from "next"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site e da loja da Anny Moda Executiva.",
}

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        align="left"
        eyebrow="Condições gerais"
        title="Termos de Uso"
        description="Última atualização: julho de 2026."
      />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ao acessar e utilizar o site da {siteConfig.name}, você concorda com os termos e
          condições descritos a seguir. Caso não concorde com algum ponto, recomendamos que não
          utilize o site.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">1. Cadastro e conta</h2>
          <p>
            Para realizar compras, pode ser necessário criar uma conta com informações verdadeiras,
            completas e atualizadas. Você é responsável por manter a confidencialidade de sua
            senha e por todas as atividades realizadas em sua conta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">2. Produtos e preços</h2>
          <p>
            Empenhamo-nos para que descrições, imagens e preços dos produtos estejam sempre
            corretos. Pequenas variações de cor podem ocorrer devido às configurações de tela.
            Reservamo-nos o direito de corrigir eventuais erros de preço ou descrição, mesmo após
            a finalização de um pedido, comunicando o cliente antes de qualquer cobrança.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">3. Pagamento</h2>
          <p>
            Os pagamentos são processados por meio de parceiros especializados (Mercado Pago),
            aceitando cartão de crédito e PIX. A confirmação do pedido está sujeita à aprovação do
            pagamento pela instituição financeira responsável.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">4. Envio e prazos</h2>
          <p>
            Os prazos de entrega são estimados no momento da compra, com base no CEP informado, e
            podem variar conforme a transportadora e a região. Não nos responsabilizamos por
            atrasos causados por caso fortuito, força maior ou informações de endereço incorretas
            fornecidas pelo cliente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">5. Trocas e devoluções</h2>
          <p>
            As condições de troca e devolução seguem nossa página dedicada de{" "}
            <a href="/trocas-e-devolucoes" className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
              Trocas e Devoluções
            </a>
            , elaborada em conformidade com o Código de Defesa do Consumidor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">6. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo do site — textos, imagens, logotipos e identidade visual — é de
            propriedade da {siteConfig.name} e protegido por leis de direitos autorais e marcas,
            não podendo ser reproduzido sem autorização prévia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">7. Avaliações e conteúdo do usuário</h2>
          <p>
            Ao enviar avaliações de produtos, você concede à {siteConfig.name} o direito de
            publicá-las no site. Reservamo-nos o direito de moderar e remover conteúdos
            ofensivos, falsos ou que violem estes termos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">8. Alterações destes termos</h2>
          <p>
            Podemos atualizar estes termos periodicamente. As alterações entram em vigor a partir
            da publicação nesta página, e o uso contínuo do site após eventuais mudanças
            representa sua concordância com os novos termos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">9. Contato</h2>
          <p>
            Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
              {siteConfig.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
