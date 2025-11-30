package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.dto.response.BrandDashboardListResponse;
import iuh.fit.se.enternalrunebackend.entity.Brand;
import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "brands")
public interface BrandRepository extends JpaRepository<Brand,Integer> {
    // Tổng danh mục
    @Query("SELECT COUNT(b) FROM Brand b")
    long countTotalBrands();


    @Query("""
    SELECT b FROM Brand b
    WHERE (:keyword IS NULL OR :keyword = '' OR b.brandName LIKE %:keyword%)
""")
    Page<Brand> searchBrands(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    Optional<Brand> findByBrandName(String brandName);


    // Tổng số sản phẩm tất cả brand
    @Query("SELECT COUNT(p) FROM Brand b JOIN b.products p")
    long getTotalProducts();

    // Thương hiệu có nhiều sản phẩm nhất
    @Query("""
        SELECT b.brandName
        FROM Brand b 
        LEFT JOIN b.products p 
        GROUP BY b 
        ORDER BY COUNT(p) DESC 
        LIMIT 1
    """)
    String getMostPopularBrand();

    // Brand không có sản phẩm nào
    @Query("SELECT COUNT(b) FROM Brand b WHERE b.products IS EMPTY")
    long countEmptyBrands();

}
