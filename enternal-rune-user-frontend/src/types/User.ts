import { Address } from "@/types/Address";

export type User = {
    userId: number
    userName: string
    userEmail: string
    userAddress: Address[]
}