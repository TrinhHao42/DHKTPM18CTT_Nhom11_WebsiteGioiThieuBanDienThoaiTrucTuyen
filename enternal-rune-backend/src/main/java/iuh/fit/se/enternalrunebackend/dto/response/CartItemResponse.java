package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.CartItem;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Integer cartItemId;
    private Long quantity;
    private ProductVariantResponse productVariantResponse;

    public static CartItemResponse toCartItemResponse(CartItem cartItem) {
        ProductVariantResponse variantResponse = ProductVariantResponse.toProductVariantResponse(
            cartItem.getCiProductVariant()
        );

        return CartItemResponse.builder()
                .cartItemId(cartItem.getCiId())
                .quantity(cartItem.getCiQuantity())
                .productVariantResponse(variantResponse)
                .build();
    }
}
