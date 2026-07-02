import type { Metadata } from "next"
import { Mail, MapPin, MessageCircle } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { InstagramIcon, FacebookIcon } from "@/components/shared/social-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig, whatsappHref } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Anny Moda Executiva pelo WhatsApp, e-mail ou redes sociais.",
}

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Fale conosco"
        title="Estamos à sua disposição"
        description="Dúvidas sobre tamanhos, pedidos ou parcerias? Escolha o canal mais confortável para você."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-4 text-center">
            <MessageCircle className="size-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-heading text-lg">WhatsApp</h3>
            <p className="text-sm text-muted-foreground">Resposta rápida, de segunda a sábado.</p>
            <Button asChild className="mt-2 bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
              <a
                href={whatsappHref("Olá! Gostaria de tirar uma dúvida sobre a Anny Moda Executiva.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar agora
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-4 text-center">
            <Mail className="size-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-heading text-lg">E-mail</h3>
            <p className="text-sm text-muted-foreground">Para dúvidas, trocas e parcerias.</p>
            <Button asChild variant="outline" className="mt-2">
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-4 text-center">
            <MapPin className="size-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-heading text-lg">Endereço</h3>
            <p className="text-sm text-muted-foreground">
              {siteConfig.address.line1}
              <br />
              {siteConfig.address.line2}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Anny Moda Executiva no Instagram"
          className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400"
        >
          <InstagramIcon />
        </a>
        {siteConfig.social.facebook && (
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Anny Moda Executiva no Facebook"
            className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400"
          >
            <FacebookIcon />
          </a>
        )}
      </div>
    </div>
  )
}
