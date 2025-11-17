package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Integer cartItemId;
    private Long quantity;
    private ProductVariantResponse productVariant;
}
