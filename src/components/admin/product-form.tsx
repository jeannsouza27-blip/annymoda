"use client"

import * as React from "react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProductAction, updateProductAction } from "@/actions/product-actions"
import type { ProductWithImages } from "@/services/product-service"
import type { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { centsToReais, reaisToCents } from "@/components/admin/money-utils"

const formSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto."),
  description: z.string().min(10, "Descreva o produto."),
  priceReais: z.string().min(1, "Informe o preço."),
  compareAtPriceReais: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0, "Informe um estoque válido."),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  installmentsMax: z.number().int().min(1).max(12),
})

type FormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  product?: ProductWithImages
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = React.useState<UploadedImage[]>(
    product?.images.map((img) => ({
      url: img.url,
      altText: img.altText ?? "",
      isPrimary: img.isPrimary,
      position: img.position,
    })) ?? []
  )
  const [imagesError, setImagesError] = React.useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      priceReais: product ? centsToReais(product.priceCents) : "",
      compareAtPriceReais: product?.compareAtPriceCents
        ? centsToReais(product.compareAtPriceCents)
        : "",
      sku: product?.sku ?? "",
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      installmentsMax: product?.installmentsMax ?? 10,
    },
  })

  function onSubmit(values: FormValues) {
    if (images.length === 0) {
      setImagesError("Adicione ao menos uma imagem.")
      return
    }
    setImagesError(null)

    const payload = {
      name: values.name,
      description: values.description,
      priceCents: reaisToCents(values.priceReais),
      compareAtPriceCents: values.compareAtPriceReais
        ? reaisToCents(values.compareAtPriceReais)
        : null,
      sku: values.sku || undefined,
      stock: values.stock,
      categoryId: values.categoryId,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      installmentsMax: values.installmentsMax,
      images: images.map((img, index) => ({
        url: img.url,
        altText: img.altText || undefined,
        isPrimary: img.isPrimary ?? index === 0,
        position: index,
      })),
    }

    startTransition(async () => {
      const result = product
        ? await updateProductAction(product.id, payload)
        : await createProductAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(product ? "Produto atualizado." : "Produto criado.")
      router.push("/admin/produtos")
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
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Blazer Alfaiataria Preto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Descreva o produto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priceReais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="399.90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compareAtPriceReais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço &quot;de&quot; (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="499.90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: BLZ-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installmentsMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas máximas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="12"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2.5">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Produto ativo</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2.5">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Produto em destaque</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <Label>Imagens do produto</Label>
            <ImageUploader value={images} onChange={setImages} multiple />
            {imagesError && <p className="text-sm text-destructive">{imagesError}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/produtos")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar produto"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
