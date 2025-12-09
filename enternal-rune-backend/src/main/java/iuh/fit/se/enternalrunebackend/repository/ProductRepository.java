package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;


@RepositoryRestResource(path = "products")
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

  // Optimized: Query only necessary fields for list view (no specs, no full details)
  @Query("""
      SELECT DISTINCT p.prodId, p.prodName, p.prodModel, p.productStatus, 
             p.prodDescription, p.prodRating,
             b.brandId, b.brandName
      FROM Product p
      JOIN p.prodBrand b
      JOIN p.productPrices pp
      WHERE pp.ppPriceStatus = 'ACTIVE'
      """)
  List<Object[]> findProductSummaryWithActivePrice();
  
  // Get images for specific products (native query vì không có relationship từ Image -> Product)
  @Query(value = """
      SELECT i.product_id, i.image_id, i.image_name, i.image_data
      FROM images i
      WHERE i.product_id IN :productIds
      """, nativeQuery = true)
  List<Object[]> findImagesByProductIds(@Param("productIds") List<Integer> productIds);
  
  // Get active prices for specific products (native query vì không có relationship từ ProductPrice -> Product)
  @Query(value = """
      SELECT pp.product_id, pp.pp_id, pp.pp_price, pp.pp_price_status,
             pp.pp_start_date, pp.pp_end_date,
             pp.discount_id, d.discount_name
      FROM product_price pp
      LEFT JOIN discounts d ON d.discount_id = pp.discount_id
      WHERE pp.product_id IN :productIds
      AND pp.pp_price_status = 'ACTIVE'
      """, nativeQuery = true)
  List<Object[]> findActivePricesByProductIds(@Param("productIds") List<Integer> productIds);
  
  // Get versions and colors
  @Query("""
      SELECT p.prodId, p.prodVersion, p.prodColor
      FROM Product p
      WHERE p.prodId IN :productIds
      """)
  List<Object[]> findVersionsAndColorsByProductIds(@Param("productIds") List<Integer> productIds);

  // Step 1: Get product IDs with active price
  @Query("""
          SELECT DISTINCT p.prodId FROM Product p
          JOIN p.productPrices pp
          WHERE pp.ppPriceStatus = 'ACTIVE'
      """)
  List<Integer> findProductIdsWithActivePrice();
  
  // Step 2: Fetch products with all relations using IN query
  @Query("""
          SELECT DISTINCT p FROM Product p
          LEFT JOIN FETCH p.prodBrand
          LEFT JOIN FETCH p.images
          LEFT JOIN FETCH p.productSpecifications
          WHERE p.prodId IN :ids
      """)
  List<Product> findProductsByIdsWithRelations(@Param("ids") List<Integer> ids);
  
  // Step 3: Fetch product prices separately
  @Query("""
          SELECT DISTINCT p FROM Product p
          LEFT JOIN FETCH p.productPrices pp
          WHERE p.prodId IN :ids
      """)
  List<Product> findProductsByIdsWithPrices(@Param("ids") List<Integer> ids);

  // Original method - keep for compatibility
  @Query("""
          SELECT DISTINCT p FROM Product p
          LEFT JOIN FETCH p.productPrices pp
          LEFT JOIN FETCH p.images
          LEFT JOIN FETCH p.prodBrand
          LEFT JOIN FETCH p.productSpecifications
          WHERE pp.ppPriceStatus = 'ACTIVE'
      """)
  List<Product> findAllWithActivePrice();

  @Query(value = """
      SELECT p.*
      FROM products p
      JOIN product_price pp ON pp.product_id = p.prod_id
      JOIN brands b ON b.brand_id = p.brand_id
      WHERE pp.pp_price_status = 'ACTIVE'
        AND pp.pp_start_date = (
            SELECT MAX(pp2.pp_start_date)
            FROM product_price pp2
            JOIN products p2 ON p2.prod_id = pp2.product_id
            WHERE pp2.pp_price_status = 'ACTIVE'
              AND p2.brand_id = p.brand_id
        )
      GROUP BY b.brand_id, p.prod_id
      ORDER BY p.product_rating DESC
      """, nativeQuery = true)
  List<Product> findFeaturedProducts(Pageable pageable);

  @Query(value = """
          SELECT p.*
          FROM products p
          JOIN brands b ON b.brand_id = p.brand_id
          JOIN product_price pp ON pp.product_id = p.prod_id
          WHERE b.brand_name ILIKE :brandName
            AND pp.pp_price_status = 'ACTIVE'
          ORDER BY pp.pp_start_date DESC
          LIMIT :limit
      """, nativeQuery = true)
  List<Product> findProductsByBrand(@Param("brandName") String brandName, @Param("limit") int limit);
  // Tổng số sản phẩm
    @Query("SELECT COUNT(p) FROM Product p")
    long countTotalProducts();

    // Số sản phẩm còn hàng
    @Query("SELECT COUNT(p) FROM Product p WHERE p.productStatus = 'ACTIVE'")
    long countAvailableProducts();

    // Số sản phẩm hết hàng
    @Query("SELECT COUNT(p) FROM Product p WHERE p.productStatus = 'OUT_OF_STOCK'")
    long countOutOfStockProducts();

    // Đếm sản phẩm được tạo trong 1 tháng cụ thể
    @Query("""
        SELECT COUNT(p)
        FROM Product p
        WHERE EXTRACT(YEAR FROM p.createdAt) = :year
          AND EXTRACT(MONTH FROM p.createdAt) = :month
    """)
    long countProductsByMonth(@Param("year") int year, @Param("month") int month);


  @Query("""
      SELECT DISTINCT p
      FROM Product p
      LEFT JOIN p.prodBrand b
      WHERE LOWER(p.prodName) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(COALESCE(p.prodDescription, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(COALESCE(b.brandName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
      """)
  List<Product> searchProductsForAssistant(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        JOIN p.prodBrand b
        WHERE (:keyword IS NULL OR p.prodName LIKE %:keyword% OR p.prodModel LIKE %:keyword%)
          AND (:brand IS NULL OR b.brandName = :brand)
          AND (:status IS NULL OR p.productStatus = :status)
        """)
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("brand") String brand,
            @Param("status") ProductStatus status,
            Pageable pageable
    );
    @Query("SELECT COUNT(p) FROM Product p WHERE p.prodBrand.brandId = :brandId")
    Long countByBrandId(@Param("brandId") int brandId);

}
