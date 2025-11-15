import { ProductVariant } from "@/types/ProductVariant";

export type OrderDetail = {
    orderDetailId: number
    quantity: number
    totalPrice: number
    productVariant: {
        variantId: number
        variantName: string
        variantModel: string
        variantVersion: string
        variantColor: string
        imageUrl: string
        productId: number
        productName: string
    }
    price: number
}