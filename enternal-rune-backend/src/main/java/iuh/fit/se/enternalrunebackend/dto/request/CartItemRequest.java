package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    private Integer cartItemId;
    private Long productId;
    private Long quantity;
}
