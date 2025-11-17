package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddToCartRequest {
    private Long productId;        // Product ID (không phải ProductVariant ID)
    private Long quantity;
    private String color;          // Màu sắc được chọn (optional)
    private String storage;        // Dung lượng (optional)
    private String version;        // Phiên bản (optional)
}
