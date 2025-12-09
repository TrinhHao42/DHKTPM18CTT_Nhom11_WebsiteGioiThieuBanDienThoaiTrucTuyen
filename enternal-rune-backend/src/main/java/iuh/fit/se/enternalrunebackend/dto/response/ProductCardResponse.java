package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Enhanced DTO for product cards - includes all fields needed for frontend display
 * Supports product card UI with description, pricing, and rating information
 */
@Data
@NoArgsConstructor
public class ProductCardResponse {
    private Integer prodId;
    private String prodName;
    private String prodModel;
    private String prodDescription; // Added for frontend description
    private Double prodRating;

    // Brand info
    private String brandName;

    // Price info - matching frontend fields
    private Integer currentPrice;
    private Integer originalPrice; // for discount display
    private String discountLabel; // e.g., "20% OFF"

    // Image - matching frontend field
    private String imageUrl;

    // Rating statistics for frontend display
    private Integer totalComments;
    private Double averageRating;

    // Colors for frontend variant selection
    private String availableColors; // Comma-separated color list

    // Constructor for JPA native query projection (enhanced)
    public ProductCardResponse(Integer prodId, String prodName, String prodModel, 
            String prodDescription, Double prodRating, String brandName,
            Integer currentPrice, Integer originalPrice, String discountLabel,
            String imageUrl, Integer totalComments, Double averageRating,
            String availableColors) {
        this.prodId = prodId;
        this.prodName = prodName;
        this.prodModel = prodModel;
        this.prodDescription = prodDescription;
        this.prodRating = prodRating != null ? prodRating : 0.0;
        this.brandName = brandName;
        this.currentPrice = currentPrice != null ? currentPrice : 0;
        this.originalPrice = originalPrice != null ? originalPrice : 0;
        this.discountLabel = discountLabel;
        this.imageUrl = imageUrl;
        this.totalComments = totalComments != null ? totalComments : 0;
        this.averageRating = averageRating != null ? averageRating : 0.0;
        this.availableColors = availableColors;
    }


}