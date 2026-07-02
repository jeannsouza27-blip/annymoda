import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  variant?: "default" | "warning"
  hint?: string
}

export function StatsCard({ label, value, icon: Icon, variant = "default", hint }: StatsCardProps) {
  return (
    <Card
      className={cn(
        variant === "warning" && "ring-gold-500/40 bg-gold-50/40 dark:bg-gold-900/10"
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="font-heading text-2xl leading-tight text-foreground">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            variant === "warning" && "bg-gold-500/15 text-gold-600"
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  )
}
