// Small local helpers to convert between a reais decimal string (e.g. "399.90")
// used in admin form inputs and the integer-cents values stored in the database.
// Intentionally not added to `@/lib/format` per project instructions.

export function reaisToCents(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0
  const num = typeof value === "number" ? value : parseFloat(value.replace(",", "."))
  if (Number.isNaN(num)) return 0
  return Math.round(num * 100)
}

export function centsToReais(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ""
  return (cents / 100).toFixed(2)
}
