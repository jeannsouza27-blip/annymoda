import Link from "next/link"
import { cn } from "@/lib/utils"

function MannequinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="50" cy="8" r="6" />
      <rect x="47" y="14" width="6" height="10" />
      <path d="M30 26 C24 26 22 34 24 42 C26 50 34 54 34 62 C34 68 26 70 24 80 C22 90 24 100 34 104 L66 104 C76 100 78 90 76 80 C74 70 66 68 66 62 C66 54 74 50 76 42 C78 34 76 26 70 26 C62 22 38 22 30 26 Z" />
      <rect x="47" y="104" width="6" height="20" />
      <path
        d="M50 124 L30 138 M50 124 L70 138 M50 124 L50 140"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="Anny Moda Executiva — Início"
    >
      <MannequinIcon className="h-8 w-auto shrink-0 text-gold-600 dark:text-gold-400 sm:h-9" />
      <span className="font-heading leading-none">
        <span className="text-2xl tracking-wide text-foreground">
          Anny
          <span className="text-gold-600 dark:text-gold-400"> Moda</span>
        </span>
        <span className="block text-[0.6rem] font-sans font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Executiva
        </span>
      </span>
    </Link>
  )
}
