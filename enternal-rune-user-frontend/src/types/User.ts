import { Address } from "@/types/Address";
import { Role } from "@/types/enums/UserRole";

export type User = {
    userId: number
    userName: string
    userEmail: string
    userAddress: Address
}