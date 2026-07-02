"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateOrderTrackingAction } from "@/actions/order-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OrderTrackingFormProps {
  orderId: string
  trackingCode: string | null
}

export function OrderTrackingForm({ orderId, trackingCode }: OrderTrackingFormProps) {
  const router = useRouter()
  const [value, setValue] = React.useState(trackingCode ?? "")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateOrderTrackingAction(orderId, value)
      if (!result.success) {
        toast.error(result.error ?? "Não foi possível salvar o código de rastreio.")
        return
      }
      toast.success("Código de rastreio salvo.")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Código de rastreio"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar rastreio"}
      </Button>
    </form>
  )
}
