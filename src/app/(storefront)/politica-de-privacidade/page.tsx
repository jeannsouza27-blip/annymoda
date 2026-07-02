import type { Metadata } from "next"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Anny Moda Executiva coleta, usa e protege seus dados pessoais.",
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        align="left"
        eyebrow="Transparência"
        title="Política de Privacidade"
        description="Última atualização: julho de 2026."
      />

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          A {siteConfig.name} respeita a sua privacidade e está comprometida em proteger os dados
          pessoais dos seus clientes, em conformidade com a Lei Geral de Proteção de Dados
          (Lei nº 13.709/2018 — LGPD). Esta política explica quais dados coletamos, como os
          usamos e quais são os seus direitos.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">1. Quais dados coletamos</h2>
          <p>
            Coletamos dados fornecidos diretamente por você ao criar uma conta, realizar uma
            compra ou se inscrever em nossa newsletter, como nome, e-mail, telefone, endereço de
            entrega e informações de pagamento (processadas por parceiros certificados — nunca
            armazenamos dados completos de cartão de crédito). Também coletamos dados de
            navegação, como páginas visitadas e preferências de produtos, para melhorar sua
            experiência.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">2. Como usamos seus dados</h2>
          <p>Utilizamos seus dados pessoais para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Processar e entregar seus pedidos;</li>
            <li>Emitir notas fiscais e cumprir obrigações legais e fiscais;</li>
            <li>Enviar comunicações sobre pedidos, trocas e devoluções;</li>
            <li>Enviar novidades e promoções, quando você optar por recebê-las;</li>
            <li>Melhorar nossos produtos, site e atendimento.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">3. Compartilhamento de dados</h2>
          <p>
            Compartilhamos dados apenas com parceiros essenciais à operação da loja, como
            processadores de pagamento (Mercado Pago), transportadoras e serviços de e-mail
            marketing — sempre sob obrigações contratuais de confidencialidade. Nunca vendemos
            seus dados pessoais a terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">4. Armazenamento e segurança</h2>
          <p>
            Seus dados são armazenados em servidores seguros, com controles de acesso e
            criptografia adequados, pelo tempo necessário para cumprir as finalidades descritas
            nesta política ou obrigações legais.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">5. Seus direitos</h2>
          <p>
            De acordo com a LGPD, você pode solicitar a qualquer momento a confirmação da
            existência de tratamento, acesso, correção, anonimização, portabilidade ou eliminação
            dos seus dados pessoais, bem como revogar o consentimento para comunicações de
            marketing. Para exercer esses direitos, entre em contato pelo e-mail{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
              {siteConfig.email}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">6. Cookies</h2>
          <p>
            Utilizamos cookies para lembrar itens da sua sacola, manter sua sessão de login e
            entender como você navega pelo site. Você pode gerenciar o uso de cookies diretamente
            nas configurações do seu navegador.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-foreground">7. Alterações a esta política</h2>
          <p>
            Podemos atualizar esta política periodicamente para refletir mudanças em nossas
            práticas ou na legislação aplicável. Recomendamos revisitar esta página com
            regularidade.
          </p>
        </section>
      </div>
    </div>
  )
}
