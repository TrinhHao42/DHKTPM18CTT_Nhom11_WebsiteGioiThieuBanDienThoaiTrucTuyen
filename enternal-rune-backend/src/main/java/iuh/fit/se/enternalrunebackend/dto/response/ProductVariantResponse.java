package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.ProductVariant;
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
    private Integer quantity;

    public static ProductVariantResponse toProductVariantResponse(ProductVariant productVariant) {
        ProductVariantResponse response = new ProductVariantResponse();
        response.setVariantId(productVariant.getProdvId());
        response.setVariantName(productVariant.getProdvName());
        response.setColor(productVariant.getProdvColor());
        response.setStorage(productVariant.getProdvModel());
        response.setVersion(productVariant.getProdvVersion());

        if (productVariant.getProdvPrice() != null) {
            response.setPrice(productVariant.getProdvPrice().getPpPrice());
        }

        if (productVariant.getProdvImg() != null) {
            response.setImageUrl(productVariant.getProdvImg().getImageData());
        }
        return response;
    }
}
