import Link from "next/link"
import { listCustomers } from "@/services/user-service"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { formatDate } from "@/lib/format"

type CustomerRow = Awaited<ReturnType<typeof listCustomers>>[number]

export default async function AdminCustomersPage() {
  const customers = await listCustomers()

  const columns: AdminDataTableColumn<CustomerRow>[] = [
    {
      key: "name",
      header: "Nome",
      sortValue: (customer) => customer.name,
      cell: (customer) => (
        <Link
          href={`/admin/clientes/${customer.id}`}
          className="font-medium text-foreground hover:text-gold-600"
        >
          {customer.name}
        </Link>
      ),
    },
    {
      key: "email",
      header: "E-mail",
      cell: (customer) => <span className="text-muted-foreground">{customer.email}</span>,
    },
    {
      key: "phone",
      header: "Telefone",
      cell: (customer) => <span className="text-muted-foreground">{customer.phone ?? "—"}</span>,
    },
    {
      key: "orders",
      header: "Pedidos",
      sortValue: (customer) => customer._count.orders,
      cell: (customer) => customer._count.orders,
    },
    {
      key: "createdAt",
      header: "Cliente desde",
      sortValue: (customer) => customer.createdAt.getTime(),
      cell: (customer) => (
        <span className="text-muted-foreground">{formatDate(customer.createdAt)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">{customers.length} clientes cadastrados</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={customers}
        rowKey={(customer) => customer.id}
        emptyMessage="Nenhum cliente cadastrado ainda."
      />
    </div>
  )
}
