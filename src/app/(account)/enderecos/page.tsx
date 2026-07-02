import { MapPin } from "lucide-react"
import { requireUser } from "@/lib/auth-guards"
import { listAddressesForUser } from "@/services/address-service"
import { AddressCard } from "@/components/account/address-card"
import { AddAddressDialog } from "@/components/account/add-address-dialog"

export default async function EnderecosPage() {
  const user = await requireUser()
  const addresses = await listAddressesForUser(user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Endereços</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os endereços de entrega da sua conta.</p>
        </div>
        <AddAddressDialog />
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-card py-16 text-center ring-1 ring-foreground/10">
          <MapPin className="size-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-heading text-lg text-foreground">Nenhum endereço cadastrado</p>
            <p className="text-sm text-muted-foreground">Adicione um endereço para agilizar suas próximas compras.</p>
          </div>
          <AddAddressDialog />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  )
}
