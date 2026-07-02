"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mainCategories } from "@/lib/constants"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {mainCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "novidades" || cat.slug === "promocoes" ? `/${cat.slug}` : `/categoria/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="border-b py-3 text-sm font-medium uppercase tracking-wide"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/sobre" onClick={() => setOpen(false)} className="border-b py-3 text-sm">
            Nossa história
          </Link>
          <Link href="/entrar" onClick={() => setOpen(false)} className="border-b py-3 text-sm">
            Entrar / Cadastrar
          </Link>
          <Link href="/contato" onClick={() => setOpen(false)} className="py-3 text-sm">
            Contato
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
