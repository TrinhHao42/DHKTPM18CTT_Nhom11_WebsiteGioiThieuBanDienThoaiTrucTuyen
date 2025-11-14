// Simplified ProductVariant DTO (không có circular reference)
export type ProductVariantDTO = {
    variantId: number;
    variantName: string;
    color?: string;
    storage?: string;
    version?: string;
    price: number;
    imageUrl?: string;
    productId: number;
    productName: string;
    brandName?: string;
}

// CartItem DTO
export type CartItem = {
    cartItemId: number;
    quantity: number;
    productVariant: ProductVariantDTO;
}

// Cart Response
export type CartResponse = {
    cartItems: CartItem[];
    totalItems: number;
    totalPrice: number;
}