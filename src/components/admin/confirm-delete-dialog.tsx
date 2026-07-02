"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
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

interface ConfirmDeleteDialogProps {
  trigger: React.ReactNode
  title?: string
  description?: string
  onConfirm: () => Promise<void> | void
}

export function ConfirmDeleteDialog({
  trigger,
  title = "Excluir item",
  description = "Esta ação não pode ser desfeita. O item será removido permanentemente.",
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await onConfirm()
        setOpen(false)
      } catch {
        toast.error("Não foi possível concluir a exclusão.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
