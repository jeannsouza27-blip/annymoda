import { listCustomers } from "@/services/user-service"
import { CustomersTable } from "@/components/admin/customers-table"

export default async function AdminCustomersPage() {
  const customers = await listCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">{customers.length} clientes cadastrados</p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}
