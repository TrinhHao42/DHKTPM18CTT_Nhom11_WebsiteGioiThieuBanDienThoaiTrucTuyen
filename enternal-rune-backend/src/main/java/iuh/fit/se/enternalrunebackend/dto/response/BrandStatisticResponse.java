package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BrandStatisticResponse {
    private long totalBrands;
    private String mostPopularBrand;
    private double averageProductsPerBrand;
    private long emptyBrandCount;
}
