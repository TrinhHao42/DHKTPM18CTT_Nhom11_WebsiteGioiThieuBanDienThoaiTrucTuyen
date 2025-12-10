package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.ProductRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductCardResponse;



import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ProductService {
    List<Product> getAllProductsWithActivePrice();
    
    // Optimized: Get only necessary fields for list view
    List<ProductResponse> getProductSummaryWithActivePrice();

    List<Product> getFeaturedProducts(int limit);

    List<Product> getProductsByBrand(String brandName, int limit);

    Page<Product> filterProducts(
            List<Integer> brands,
            List<String> priceRanges,
            List<String> colors,
            List<String> memory,
            String search,
            int page,
            int size
    );
    public ProductDashboardResponse getProductDashboard();
//    public Page<ProductDashboardListResponse> getProductDashboardList(Pageable pageable);
    public Page<ProductDashboardListResponse> getProductDashboardList(
            String keyword, String brand, ProductStatus status, Pageable pageable
    );

    public void  addProduct(ProductRequest productRequest,List<MultipartFile> files)throws IOException;
    public void deleteProduct(Integer id);
    Product updateProduct(Integer id, ProductRequest request, List<MultipartFile> newFiles) throws IOException;
    Product getProductById(Integer id);
    
    // Rating calculation methods
    Double getAverageRating(Integer productId);
    Integer getTotalComments(Integer productId);
    Map<String, Integer> getRatingDistribution(Integer productId);
    
    // Batch rating statistics to avoid N+1 queries
    Map<Integer, Double> getAverageRatingsForProducts(List<Integer> productIds);
    Map<Integer, Integer> getTotalCommentsForProducts(List<Integer> productIds);
    
    // ===== OPTIMIZED METHODS FOR LIST VIEWS =====
    
    /**
     * Get product list with minimal data - single query, lightweight response
     */
    List<ProductListResponse> getProductListOptimized();
    
    /**
     * Get featured products as cards - minimal data, fastest response
     */
    List<ProductCardResponse> getFeaturedProductCards(int limit);
    
    /**
     * Get products by brand as cards - minimal data
     */
    List<ProductCardResponse> getProductCardsByBrand(String brandName, int limit);
    
    /**
     * Filter products with optimized pagination
     */
    Page<ProductListResponse> filterProductsOptimized(
            List<Integer> brands,
            List<String> priceRanges,
            List<String> colors,
            List<String> memory,
            String search,
            int page,
            int size
    );
}
