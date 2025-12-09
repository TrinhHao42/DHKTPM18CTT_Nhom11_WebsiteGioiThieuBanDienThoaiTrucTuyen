package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.dto.response.ProductPriceResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import iuh.fit.se.enternalrunebackend.dto.response.ProductSpecificationsResponse;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
    private ProductSpecificationsResponse prodSpecs;
    
    // Comment/Rating data
    private Integer totalComments;
    private Double averageRating;
    private Map<String, Integer> ratingDistribution; // "1": 5, "2": 3, "3": 10, etc.
}
