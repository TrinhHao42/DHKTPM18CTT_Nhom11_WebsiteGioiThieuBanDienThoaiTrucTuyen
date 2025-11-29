package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.ProductRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;



import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public Product updateProduct(Integer productId, ProductRequest request);

    Product getProductById(Integer id);
}
