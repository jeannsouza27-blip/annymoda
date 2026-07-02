"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createCouponAction, updateCouponAction } from "@/actions/coupon-actions"
import type { Coupon } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { centsToReais, reaisToCents } from "@/components/admin/money-utils"

const formSchema = z.object({
  code: z.string().min(3, "Informe um código de cupom."),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("Informe um valor válido."),
  minOrderReais: z.string().optional(),
  maxUses: z.string().optional(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface CouponFormProps {
  coupon?: Coupon
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code ?? "",
      type: coupon?.type ?? "PERCENTAGE",
      value: coupon ? (coupon.type === "PERCENTAGE" ? coupon.value : coupon.value / 100) : 0,
      minOrderReais: coupon?.minOrderCents ? centsToReais(coupon.minOrderCents) : "",
      maxUses: coupon?.maxUses ? String(coupon.maxUses) : "",
      isActive: coupon?.isActive ?? true,
    },
  })

  const type = form.watch("type")

  function onSubmit(values: FormValues) {
    const payload = {
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.type === "PERCENTAGE" ? Math.round(values.value) : reaisToCents(values.value),
      minOrderCents: values.minOrderReais ? reaisToCents(values.minOrderReais) : undefined,
      maxUses: values.maxUses ? parseInt(values.maxUses, 10) : undefined,
      isActive: values.isActive,
    }

    startTransition(async () => {
      const result = coupon
        ? await updateCouponAction(coupon.id, payload)
        : await createCouponAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(coupon ? "Cupom atualizado." : "Cupom criado.")
      router.push("/admin/cupons")
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do cupom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: BEMVINDA10"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de desconto</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
                        <SelectItem value="FIXED">Valor fixo (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {type === "PERCENTAGE" ? "Valor do desconto (%)" : "Valor do desconto (R$)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step={type === "PERCENTAGE" ? "1" : "0.01"}
                        max={type === "PERCENTAGE" ? "100" : undefined}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="minOrderReais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido mínimo (R$, opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de usos (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" placeholder="Ilimitado" {...field} />
                    </FormControl>
                    <FormDescription>Deixe em branco para uso ilimitado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Cupom ativo</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/cupons")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar cupom"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
