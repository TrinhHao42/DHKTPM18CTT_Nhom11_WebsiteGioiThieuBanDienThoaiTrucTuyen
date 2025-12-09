package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO for product list views - only contains essential fields
 * Used for: /products/active-price, /products/filter, /products/latest
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductListResponse {
    private Integer prodId;
    private String prodName;
    private String prodModel;
    private String prodDescription;
    private String productStatus;
    private Double prodRating;
    
    // Brand info (minimal)
    private Integer brandId;
    private String brandName;
    
    // Price info (only active price) - matching frontend fields
    private Integer activePrice;
    private String discountName;  
    private Integer discountPrice;
    
    // Primary image only - matching frontend field
    private String primaryImageUrl;
    
    // Rating statistics for frontend display
    private Integer totalComments;
    private Double averageRating;
    
    // Basic color options (first 3 colors)
    private String availableColors;
    
    // Constructor for JPA projection
    public ProductListResponse(Integer prodId, String prodName, String prodModel, 
                              String prodDescription, String productStatus, Double prodRating,
                              Integer brandId, String brandName,
                              Integer activePrice, String discountName,
                              String primaryImageUrl, Integer totalComments, Double averageRating,
                              String availableColors) {
        this.prodId = prodId;
        this.prodName = prodName;
        this.prodModel = prodModel;
        this.prodDescription = prodDescription;
        this.productStatus = productStatus;
        this.prodRating = prodRating;
        this.brandId = brandId;
        this.brandName = brandName;
        this.activePrice = activePrice;
        this.discountName = discountName;
        this.primaryImageUrl = primaryImageUrl;
        this.totalComments = totalComments != null ? totalComments : 0;
        this.averageRating = averageRating != null ? averageRating : 0.0;
        this.availableColors = availableColors;
        
        // Calculate discount price if discount exists
        if (discountName != null && activePrice != null) {
            // Assuming discount is percentage-based - adjust logic as needed
            this.discountPrice = activePrice; // Set actual discount calculation logic
        }
    }
}