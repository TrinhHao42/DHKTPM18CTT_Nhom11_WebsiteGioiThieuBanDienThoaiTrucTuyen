export type ProductVariantResponse = {
    variantId: number
    variantName: string
    version?: string | null
    color?: string | null
    storage?: string | null
    imageUrl?: string | null
    price?: number
}

export type OrderDetail = {
    orderId: number
    quantity: number | null
    totalPrice: number
    productVariantResponse: ProductVariantResponse
}
