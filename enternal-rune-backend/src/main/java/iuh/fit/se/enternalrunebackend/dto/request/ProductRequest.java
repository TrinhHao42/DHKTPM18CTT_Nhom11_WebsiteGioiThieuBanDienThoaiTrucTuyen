package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequest {
    private String productName;
    private String productModel;
    private String productStatus;
    private List<String> productVersion;
    private List<String> productColor;
    private String productDescription;
    private Integer brandId;
    private List<ImageRequest> images;
    private List<ProductPriceRequest> productPrices;

}
