"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  createShippingRuleAction,
  updateShippingRuleAction,
} from "@/actions/shipping-actions"
import type { ShippingRule } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
  name: z.string().min(2, "Informe o nome da regra."),
  state: z.string().max(2).optional(),
  zipPrefix: z.string().optional(),
  priceReais: z.string().min(1, "Informe o valor do frete."),
  estimatedDaysMin: z.number().int().min(1, "Informe um prazo válido."),
  estimatedDaysMax: z.number().int().min(1, "Informe um prazo válido."),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface ShippingRuleFormProps {
  rule?: ShippingRule
}

export function ShippingRuleForm({ rule }: ShippingRuleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: rule?.name ?? "",
      state: rule?.state ?? "",
      zipPrefix: rule?.zipPrefix ?? "",
      priceReais: rule ? centsToReais(rule.priceCents) : "",
      estimatedDaysMin: rule?.estimatedDaysMin ?? 1,
      estimatedDaysMax: rule?.estimatedDaysMax ?? 5,
      isActive: rule?.isActive ?? true,
    },
  })

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      state: values.state ? values.state.toUpperCase() : undefined,
      zipPrefix: values.zipPrefix || undefined,
      priceCents: reaisToCents(values.priceReais),
      estimatedDaysMin: values.estimatedDaysMin,
      estimatedDaysMax: values.estimatedDaysMax,
      isActive: values.isActive,
    }

    startTransition(async () => {
      const result = rule
        ? await updateShippingRuleAction(rule.id, payload)
        : await createShippingRuleAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(rule ? "Regra de frete atualizada." : "Regra de frete criada.")
      router.push("/admin/frete")
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da regra</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Frete Sudeste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: SP"
                        maxLength={2}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Deixe em branco para usar como regra padrão (demais estados).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefixo de CEP (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: 01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priceReais"
              render={({ field }) => (
                <FormItem className="max-w-48">
                  <FormLabel>Valor do frete (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="29.90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="estimatedDaysMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo mínimo (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDaysMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo máximo (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                      />
                    </FormControl>
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
                  <FormLabel className="!mt-0">Regra ativa</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/frete")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar regra"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
