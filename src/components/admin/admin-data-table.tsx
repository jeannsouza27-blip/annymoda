"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type AdminDataTableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
  sortValue?: (row: T) => string | number
}

interface AdminDataTableProps<T> {
  columns: AdminDataTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function AdminDataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "Nenhum registro encontrado.",
  onRowClick,
}: AdminDataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  const sortedData = React.useMemo(() => {
    if (!sort) return data
    const column = columns.find((c) => c.key === sort.key)
    if (!column?.sortValue) return data
    const copy = [...data]
    copy.sort((a, b) => {
      const va = column.sortValue!(a)
      const vb = column.sortValue!(b)
      if (va < vb) return sort.direction === "asc" ? -1 : 1
      if (va > vb) return sort.direction === "asc" ? 1 : -1
      return 0
    })
    return copy
  }, [data, columns, sort])

  function toggleSort(column: AdminDataTableColumn<T>) {
    if (!column.sortValue) return
    setSort((prev) => {
      if (!prev || prev.key !== column.key) return { key: column.key, direction: "asc" }
      if (prev.direction === "asc") return { key: column.key, direction: "desc" }
      return null
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {column.header}
                    {sort?.key === column.key ? (
                      sort.direction === "asc" ? (
                        <ArrowUp className="size-3.5" />
                      ) : (
                        <ArrowDown className="size-3.5" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3.5 opacity-40" />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row) => (
              <TableRow
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
