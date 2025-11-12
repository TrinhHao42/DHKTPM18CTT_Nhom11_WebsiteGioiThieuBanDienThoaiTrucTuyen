package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ProductDashboardResponse {
    private long totalProducts;
    private long totalCategories;
    private long availableProducts;
    private long outOfStockProducts;
}