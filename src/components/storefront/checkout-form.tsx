"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCart, useCartTotals } from "@/hooks/use-cart"
import { createOrderAndCheckout } from "@/actions/checkout-actions"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

const checkoutFormSchema = z.object({
  recipientName: z.string().min(2, "Informe o nome completo."),
  phone: z.string().min(8, "Informe um telefone válido."),
  zipCode: z.string().min(8, "Informe um CEP válido."),
  street: z.string().min(2, "Informe a rua."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)."),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["CREDIT_CARD", "PIX"]),
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

const paymentOptions = [
  { value: "PIX" as const, label: "PIX", description: "Aprovação imediata" },
  { value: "CREDIT_CARD" as const, label: "Cartão de crédito", description: "Em até 10x" },
]

export function CheckoutForm() {
  const items = useCart((s) => s.items)
  const { subtotalCents } = useCartTotals()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipientName: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      couponCode: "",
      paymentMethod: "PIX",
    },
  })

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl">Sua sacola está vazia</h1>
        <p className="text-muted-foreground">Adicione produtos à sacola antes de finalizar a compra.</p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
          <Link href="/carrinho">Voltar para a sacola</Link>
        </Button>
      </div>
    )
  }

  function onSubmit(values: CheckoutFormValues) {
    startTransition(async () => {
      const result = await createOrderAndCheckout({
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        couponCode: values.couponCode || undefined,
        recipientName: values.recipientName,
        phone: values.phone,
        zipCode: values.zipCode,
        street: values.street,
        number: values.number,
        complement: values.complement || undefined,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state.toUpperCase(),
        paymentMethod: values.paymentMethod,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      useCart.getState().clear()
      // redirectUrl may be an internal confirmation page or an external
      // Mercado Pago checkout URL — window.location.href handles both.
      window.location.href = result.redirectUrl
    })
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div className="lg:col-span-2">
        <h1 className="mb-8 font-heading text-3xl">Finalizar compra</h1>
        <Form {...form}>
          <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-heading text-lg">Dados de entrega</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, bloco, referência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado (UF)</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-lg">Cupom de desconto</h2>
              <FormField
                control={form.control}
                name="couponCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Cupom de desconto</FormLabel>
                    <FormControl>
                      <Input placeholder="Se tiver um cupom, informe aqui" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-lg">Forma de pagamento</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Forma de pagamento">
                        {paymentOptions.map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 transition-colors",
                              field.value === option.value && "border-gold-500 bg-gold-50/60 dark:bg-gold-900/20"
                            )}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option.value}
                              checked={field.value === option.value}
                              onChange={() => field.onChange(option.value)}
                              className="size-4 accent-gold-500"
                            />
                            <span>
                              <span className="block text-sm font-medium">{option.label}</span>
                              <span className="block text-xs text-muted-foreground">{option.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </form>
        </Form>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {items.map((item) => (
                <li key={`${item.productId}::${item.variantId ?? ""}`} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                  </span>
                  <span className="shrink-0">{formatCurrency(item.priceCents * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Frete e descontos são calculados na confirmação do pedido.
            </p>
            <Separator />
            <div className="flex items-center justify-between font-heading text-lg">
              <span>Total estimado</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground"
            >
              {isPending ? "Processando..." : "Confirmar pedido"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
