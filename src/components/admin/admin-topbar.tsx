"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { AdminSidebarNav } from "@/components/admin/admin-sidebar"

interface AdminTopbarProps {
  adminName?: string | null
}

export function AdminTopbar({ adminName }: AdminTopbarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <SheetContent side="left" className="w-60 p-0 sm:max-w-60">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <AdminSidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sm text-muted-foreground lg:hidden">Painel administrativo</span>
      </div>

      <div className="flex items-center gap-3">
        {adminName && (
          <span className="hidden text-sm text-muted-foreground sm:inline">{adminName}</span>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
