package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;



import iuh.fit.se.enternalrunebackend.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<Product> getAllProductsWithActivePrice();

    List<Product> getFeaturedProducts(int limit);

    List<Product> getProductsByBrand(String brandName, int limit);

    Page<Product> filterProducts(
            List<Integer> brands,
            List<String> priceRanges,
            List<String> colors,
            List<String> memory,
            int page,
            int size
    );
    public ProductDashboardResponse getProductDashboard();
}
