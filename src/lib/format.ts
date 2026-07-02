const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100)
}

export function formatInstallments(priceCents: number, installmentsMax: number) {
  if (installmentsMax <= 1) return null
  const installmentCents = Math.ceil(priceCents / installmentsMax)
  return `${installmentsMax}x de ${formatCurrency(installmentCents)} sem juros`
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d)
}
