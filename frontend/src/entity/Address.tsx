export interface Address{
    id: string,
    createdAt: string,
    updatedAt: string,
    fullName: string,
    street: string,
    houseNumber: string,
    city: string,
    country: string,
    postalCode: string
}

export type CreateAddressPayload = Omit<Address, "id" | "createdAt" | "updatedAt">;