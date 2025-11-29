package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddToCartRequest {
    private Long productId;
    private Long quantity;
    private String color;
    private int imageId;
    private String storage;
    private String version;
}
