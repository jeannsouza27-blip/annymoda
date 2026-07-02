"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Address } from "@prisma/client"
import { deleteAddressAction } from "@/actions/address-actions"
import { AddressForm } from "@/components/account/address-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AddressCard({ address }: { address: Address }) {
  const [editOpen, setEditOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAddressAction(address.id)
      if (!result.success) {
        toast.error("Não foi possível remover este endereço.")
        return
      }
      toast.success("Endereço removido.")
    })
  }

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="font-heading text-base text-foreground">{address.label || "Endereço"}</p>
            {address.isDefault && (
              <Badge className="bg-gold-500/15 text-gold-700 dark:text-gold-400">Padrão</Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar endereço</DialogTitle>
                </DialogHeader>
                <AddressForm address={address} onSuccess={() => setEditOpen(false)} />
              </DialogContent>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Editar endereço"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Excluir endereço">
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O endereço será removido permanentemente da sua conta.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction disabled={isPending} onClick={handleDelete}>
                    {isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="text-foreground">{address.recipientName}</p>
          <p>
            {address.street}, {address.number}
            {address.complement ? ` — ${address.complement}` : ""}
          </p>
          <p>{address.neighborhood}</p>
          <p>
            {address.city} — {address.state}
          </p>
          <p>CEP {address.zipCode}</p>
          <p>{address.phone}</p>
        </div>
      </CardContent>
    </Card>
  )
}
