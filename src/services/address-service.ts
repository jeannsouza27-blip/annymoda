import { prisma } from "@/lib/prisma"

export function listAddressesForUser(userId: string) {
  return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } })
}

export function getAddressById(id: string) {
  return prisma.address.findUnique({ where: { id } })
}

export type AddressInput = {
  label?: string
  recipientName: string
  phone: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isDefault?: boolean
}

export async function createAddress(userId: string, data: AddressInput) {
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
  }
  return prisma.address.create({ data: { ...data, userId } })
}

export async function updateAddress(id: string, userId: string, data: Partial<AddressInput>) {
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
  }
  return prisma.address.update({ where: { id }, data })
}

export function deleteAddress(id: string) {
  return prisma.address.delete({ where: { id } })
}
