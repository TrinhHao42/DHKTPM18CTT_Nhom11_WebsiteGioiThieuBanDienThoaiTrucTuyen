package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ProductDashboardResponse {
    private long totalProducts;
    private double totalProductsChange;

    private long totalCategories;
    private double totalCategoriesChange;

    private long availableProducts;
    private double availableChange;

    private long outOfStockProducts;
    private double outOfStockChange;
}