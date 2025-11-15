import { Address } from "@/types/Address"
import { OrderDetail } from "@/types/OrderDetail"
import { User } from "@/types/User"
import { PaymentStatus } from "@/types/enums/PaymentStatus"
import { ShippingStatus } from "@/types/enums/ShippingStatus"

export type Order = {
    orderId: number
    orderUser: User
    orderDate: Date
    orderTotalAmount: number  // Backend trả về orderTotalAmount
    orderShippingAddress: Address
    orderPaymentStatus: PaymentStatus
    orderShippingStatus: ShippingStatus
    orderDetails: OrderDetail[]  // Backend trả về orderDetails
}