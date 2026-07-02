"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { submitReviewAction } from "@/actions/review-actions"
import { cn } from "@/lib/utils"

const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Selecione uma nota.").max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Conte um pouco mais sobre sua experiência."),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

export function ReviewForm({ productId, canReview }: { productId: string; canReview: boolean }) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, title: "", comment: "" },
  })

  if (!canReview) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <Link
          href="/entrar"
          className="font-medium text-gold-600 underline-offset-4 hover:underline dark:text-gold-400"
        >
          Faça login
        </Link>{" "}
        para avaliar este produto.
      </div>
    )
  }

  function onSubmit(values: ReviewFormValues) {
    startTransition(async () => {
      const result = await submitReviewAction({ productId, ...values })
      if (result?.success) {
        toast.success("Obrigada pela sua avaliação! Ela será publicada após aprovação.")
        form.reset({ rating: 0, title: "", comment: "" })
      } else {
        toast.error(result?.error ?? "Não foi possível enviar sua avaliação.")
      }
    })
  }

  const rating = form.watch("rating")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-border p-6">
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>Sua nota</FormLabel>
              <FormControl>
                <div className="flex gap-1" role="radiogroup" aria-label="Sua nota de 1 a 5 estrelas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                      onClick={() => form.setValue("rating", n, { shouldValidate: true })}
                    >
                      <Star
                        className={cn(
                          "size-6",
                          n <= rating ? "fill-gold-500 text-gold-500" : "fill-transparent text-muted-foreground/40"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Resuma sua experiência" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu comentário</FormLabel>
              <FormControl>
                <Textarea placeholder="Conte como foi sua experiência com esta peça" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground"
        >
          {isPending ? "Enviando..." : "Enviar avaliação"}
        </Button>
      </form>
    </Form>
  )
}
