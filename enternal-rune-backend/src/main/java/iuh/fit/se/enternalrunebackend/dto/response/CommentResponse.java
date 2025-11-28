package iuh.fit.se.enternalrunebackend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.se.enternalrunebackend.entity.enums.CommentStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO cho comment response
 * Bao gồm tất cả thông tin comment để hiển thị cho user
 * Có thể chứa replies (comment con) và images
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    
    private Integer id;
    private String content;
    private Integer rating;
    private String displayName;
    private String username; // từ User entity nếu có
    private boolean isAnonymous;
    private CommentStatus status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    // Thông tin sản phẩm
    private Integer productId;
    
    // Thông tin parent comment cho reply
    private Integer parentCommentId;
    
    // Danh sách ảnh đính kèm
    private List<ImageInfo> images;
    
    // Danh sách reply comments (tùy chọn)
    private List<CommentResponse> replies;
    
    // Metadata
    private Integer replyCount;
}
