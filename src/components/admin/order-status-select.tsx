"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { OrderStatus } from "@prisma/client"
import { updateOrderStatusAction } from "@/actions/order-actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ORDER_STATUS_OPTIONS } from "@/components/admin/order-status"

interface OrderStatusSelectProps {
  orderId: string
  status: OrderStatus
}

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, value)
      if (!result.success) {
        toast.error(result.error ?? "Não foi possível atualizar o status.")
        return
      }
      toast.success("Status do pedido atualizado.")
      router.refresh()
    })
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
