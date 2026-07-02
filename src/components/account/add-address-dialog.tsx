"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { AddressForm } from "@/components/account/address-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AddAddressDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold-500 text-gold-foreground hover:bg-gold-400">
          <Plus className="size-4" />
          Adicionar endereço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo endereço</DialogTitle>
        </DialogHeader>
        <AddressForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
