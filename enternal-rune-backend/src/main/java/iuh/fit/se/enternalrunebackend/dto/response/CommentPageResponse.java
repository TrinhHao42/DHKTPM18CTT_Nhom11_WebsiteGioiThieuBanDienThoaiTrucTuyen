package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.Map;

/**
 * DTO cho paginated comment response
 * Bao gồm danh sách comments, thông tin phân trang và thống kê rating
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentPageResponse {
    
    // Danh sách comments trong page hiện tại
    private List<CommentResponse> comments;
    
    // Thông tin phân trang
    private Integer currentPage;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private Boolean hasNext;
    private Boolean hasPrevious;
    
    // Thống kê rating cho sản phẩm
    private Double averageRating;
    private Long totalRatings;
    
    // Phân bố rating (1->5 stars)
    // Key: rating value (1,2,3,4,5), Value: count
    private Map<Integer, Long> ratingDistribution;
}