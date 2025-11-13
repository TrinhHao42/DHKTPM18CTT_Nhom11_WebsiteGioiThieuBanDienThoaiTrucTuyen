package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.dto.response.ProductPriceResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductResponse {
    private int prodId;
    private String prodName;
    private String prodModel;
    private String productStatus;
    private List<String> prodVersion;
    private List<String> prodColor;
    private String prodDescription;
    private double prodRating;
    private BrandResponse prodBrand;
    private List<ImageResponse> images;
    private List<ProductPriceResponse> productPrices;
}
