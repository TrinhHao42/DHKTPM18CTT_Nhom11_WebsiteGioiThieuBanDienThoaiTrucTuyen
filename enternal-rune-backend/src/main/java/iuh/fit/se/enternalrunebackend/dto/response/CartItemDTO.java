package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Integer cartItemId;
    private Long quantity;
    private ProductVariantDTO productVariant;
}
