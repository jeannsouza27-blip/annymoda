import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { InstagramIcon, FacebookIcon } from "@/components/shared/social-icons"
import { NewsletterForm } from "@/components/storefront/newsletter-form"
import { Separator } from "@/components/ui/separator"
import { mainCategories, siteConfig, whatsappHref } from "@/lib/constants"

const institutionalLinks = [
  { label: "Nossa história", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
  { label: "Termos de uso", href: "/termos-de-uso" },
]

export function PremiumFooter() {
  const year = new Date().getFullYear()

  // The "dark" class forces this subtree to always render with the dark
  // palette (near-black background, off-white foreground), regardless of
  // the site's light/dark theme toggle — footers on premium fashion sites
  // are conventionally a fixed dark band. This also keeps the shared
  // Logo/NewsletterForm components (which use semantic tokens internally)
  // rendering with correct contrast without needing to modify them.
  return (
    <footer className="dark border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Anny Moda Executiva no Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <InstagramIcon />
              </a>
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Anny Moda Executiva no Facebook"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Coleção
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {mainCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.slug === "novidades" || cat.slug === "promocoes" ? `/${cat.slug}` : `/categoria/${cat.slug}`}
                    className="text-foreground/80 transition-colors hover:text-gold-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Institucional
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/80 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Fale conosco
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li>
                <a
                  href={whatsappHref("Olá! Gostaria de saber mais sobre a coleção Anny Moda Executiva.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 transition-colors hover:text-gold-400"
                >
                  <Phone className="mt-0.5 size-4 shrink-0" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-2 transition-colors hover:text-gold-400">
                  <Mail className="mt-0.5 size-4 shrink-0" /> {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Newsletter
              </p>
              <NewsletterForm className="mt-4" />
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  )
}
