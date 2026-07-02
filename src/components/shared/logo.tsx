import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading text-2xl tracking-wide text-foreground",
        className
      )}
      aria-label="Anny Moda Executiva — Início"
    >
      Anny
      <span className="text-gold-600 dark:text-gold-400"> Moda</span>
      <span className="block text-[0.6rem] font-sans font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Executiva
      </span>
    </Link>
  )
}
