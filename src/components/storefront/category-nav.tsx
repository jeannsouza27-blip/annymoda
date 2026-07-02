import Link from "next/link"
import { mainCategories } from "@/lib/constants"

export function CategoryNav() {
  return (
    <nav
      aria-label="Categorias"
      className="hidden items-center gap-8 lg:flex"
    >
      {mainCategories.map((cat) => (
        <Link
          key={cat.slug}
          href={cat.slug === "novidades" || cat.slug === "promocoes" ? `/${cat.slug}` : `/categoria/${cat.slug}`}
          className="text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:text-gold-600 dark:hover:text-gold-400"
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  )
}
