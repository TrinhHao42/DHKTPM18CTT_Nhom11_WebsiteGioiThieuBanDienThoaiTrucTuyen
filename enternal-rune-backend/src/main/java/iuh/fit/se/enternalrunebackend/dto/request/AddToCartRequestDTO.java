package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDTO {
    private int productId;
    private long quantity;
}
