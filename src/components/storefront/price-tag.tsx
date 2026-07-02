import { formatCurrency, formatInstallments } from "@/lib/format"
import { cn } from "@/lib/utils"

export function PriceTag({
  priceCents,
  compareAtPriceCents,
  installmentsMax,
  className,
}: {
  priceCents: number
  compareAtPriceCents?: number | null
  installmentsMax?: number
  className?: string
}) {
  const installments = installmentsMax ? formatInstallments(priceCents, installmentsMax) : null

  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex items-baseline gap-2">
        {compareAtPriceCents && (
          <span className="text-sm text-muted-foreground line-through">
            {formatCurrency(compareAtPriceCents)}
          </span>
        )}
        <span className="font-heading text-lg text-foreground">
          {formatCurrency(priceCents)}
        </span>
      </div>
      {installments && (
        <p className="text-xs text-muted-foreground">{installments}</p>
      )}
    </div>
  )
}
