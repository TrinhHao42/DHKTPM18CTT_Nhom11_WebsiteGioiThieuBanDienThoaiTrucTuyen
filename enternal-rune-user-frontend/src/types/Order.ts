import { Address } from "./Address"
import { OrderDetail } from "./OrderDetail"
import { User } from "./User"

export type Order = {
    orderId: number
    orderUser: User
    orderDate: string
    orderTotalAmount: number
    orderShippingAddress: Address

    currentPaymentStatus: {
        statusId: number
        statusCode: string
        statusName: string
        description: string
        createdAt: string | null
        note: string | null
    }

    currentShippingStatus: {
        statusId: number
        statusCode: string
        statusName: string
        description: string
        createdAt: string | null
        note: string | null
    }

    paymentStatusHistory: {
        statusId: number
        statusCode: string
        statusName: string
        description: string
        createdAt: string
        note: string
    }[]

    shippingStatusHistory: {
        statusId: number
        statusCode: string
        statusName: string
        description: string
        createdAt: string
        note: string
    }[]

    orderDetails: OrderDetail[]
}
