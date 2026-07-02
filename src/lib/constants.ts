export const siteConfig = {
  name: "Anny Moda Executiva",
  shortName: "Anny",
  tagline: "Elegância para mulheres que lideram.",
  description:
    "Moda executiva feminina de alto padrão: blazers, blusas, calças e conjuntos pensados para mulheres que lideram com presença e sofisticação.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5527997618290",
  email: "annyatelier03@gmail.com",
  address: {
    line1: "Rua Belmiro Teixeira Pimenta, 643 — Sala 03, Jardim Camburi",
    line2: "Vitória — ES",
  },
  social: {
    instagram: "https://www.instagram.com/annymodaexecutiva/",
    facebook: null as string | null,
  },
} as const

export const mainCategories = [
  { name: "Blazers", slug: "blazers" },
  { name: "Blusas", slug: "blusas" },
  { name: "Calças", slug: "calcas" },
  { name: "Conjuntos", slug: "conjuntos" },
  { name: "Novidades", slug: "novidades" },
  { name: "Promoções", slug: "promocoes" },
] as const

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
