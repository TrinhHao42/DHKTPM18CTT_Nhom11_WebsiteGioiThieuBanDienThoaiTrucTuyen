package iuh.fit.se.enternalrunebackend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCommentDTO {
    private Integer cmId;
    private String cmContent;
    private Integer cmRating;
    private String cmStatus;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime cmDate;
    
    private String displayName;
    private String ipAddress;
    
    // User info
    private UserInfo cmUser;
    
    // Product info
    private ProductInfo cmProduct;
    
    // Reply info
    private CommentReplyInfo comment;
    
    // Reply count
    private Long replyCount;
    
    // Is this a reply to another comment?
    private boolean isReply;
    private Integer parentCommentId;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String userName;
        private String userAvatar;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfo {
        private Integer prodId;
        private String prodName;
        private String prodImageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentReplyInfo {
        private String cmContent;
        private String displayName;
        private String cmDate;
    }
}