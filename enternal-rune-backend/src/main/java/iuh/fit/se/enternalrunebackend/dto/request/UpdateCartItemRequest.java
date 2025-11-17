package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCartItemRequest {
    private Integer cartItemId;
    private Long quantity;
}
