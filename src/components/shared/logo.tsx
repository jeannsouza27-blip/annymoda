import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label="Anny Moda Executiva — Início"
    >
      <Image
        src="/logo.jpeg"
        alt="Anny Moda Executiva"
        width={160}
        height={159}
        priority
        className="h-12 w-auto object-contain sm:h-14"
      />
    </Link>
  )
}
