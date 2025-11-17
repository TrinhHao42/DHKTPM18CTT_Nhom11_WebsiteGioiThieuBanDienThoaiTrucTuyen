package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {
    private Long variantId;
    private String variantName;
    private String color;
    private String storage;
    private String version;
    private Double price;
    private String imageUrl;
    
    // Basic product info (không bao gồm toàn bộ Product để tránh circular reference)
    private Integer productId;
    private String productName;
    private String brandName;
}
