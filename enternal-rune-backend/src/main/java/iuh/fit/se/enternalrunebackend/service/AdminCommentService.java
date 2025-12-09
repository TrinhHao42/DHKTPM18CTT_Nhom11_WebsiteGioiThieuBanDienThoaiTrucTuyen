package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.AdminCommentDTO;
import iuh.fit.se.enternalrunebackend.entity.Comment;
import iuh.fit.se.enternalrunebackend.entity.enums.CommentStatus;
import iuh.fit.se.enternalrunebackend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCommentService {
    
    private final CommentRepository commentRepository;

    /**
     * Get all comments with safe DTO mapping to avoid circular references
     */
    public Page<AdminCommentDTO> getAllCommentsForAdmin(Pageable pageable) {
        // Use simple query without JOIN FETCH to avoid circular references
        Page<Comment> commentsPage = commentRepository.findAllMainCommentsSimple(pageable);
        
        List<AdminCommentDTO> commentDTOs = commentsPage.getContent().stream()
                .map(this::mapToAdminCommentDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(commentDTOs, pageable, commentsPage.getTotalElements());
    }
    
    /**
     * Get review metrics for admin dashboard
     */
    public Map<String, Object> getReviewMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        try {
            // Get basic counts one by one to identify which query causes issues
            Long totalComments = null;
            try {
                totalComments = commentRepository.countAllMainComments();
            } catch (Exception e) {
                metrics.put("countError", "Error counting main comments: " + e.getMessage());
            }
            
            Long totalReplies = null;
            try {
                totalReplies = commentRepository.countAllReplies();
            } catch (Exception e) {
                metrics.put("repliesError", "Error counting replies: " + e.getMessage());
            }
            
            Double averageRating = null;
            try {
                averageRating = commentRepository.getOverallAverageRating();
                if (averageRating == null) averageRating = 0.0;
            } catch (Exception e) {
                averageRating = 0.0;
                metrics.put("ratingError", "Error getting average rating: " + e.getMessage());
            }
            
            metrics.put("totalReviews", totalComments != null ? totalComments : 0);
            metrics.put("totalReplies", totalReplies != null ? totalReplies : 0);
            metrics.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
            metrics.put("recentReviews", 5); // Static for now
            metrics.put("ratingDistribution", new HashMap<>());
            
        } catch (Exception e) {
            // If there's any error, return default values
            metrics.put("totalReviews", 0);
            metrics.put("totalReplies", 0);
            metrics.put("averageRating", 0.0);
            metrics.put("recentReviews", 0);
            metrics.put("ratingDistribution", new HashMap<>());
            metrics.put("error", "Could not fetch metrics: " + e.getMessage());
        }
        
        return metrics;
    }
    
    /**
     * Map Comment entity to AdminCommentDTO to avoid circular references
     */
    private AdminCommentDTO mapToAdminCommentDTO(Comment comment) {
        AdminCommentDTO dto = AdminCommentDTO.builder()
                .cmId(comment.getCmId())
                .cmContent(comment.getCmContent())
                .cmRating(comment.getCmRating())
                .cmStatus(comment.getCmStatus() != null ? comment.getCmStatus().toString() : "PENDING")
                .cmDate(comment.getCmDate())
                .displayName(comment.getDisplayName())
                .ipAddress(comment.getIpAddress())
                .isReply(comment.getComment() != null)
                .parentCommentId(comment.getComment() != null ? comment.getComment().getCmId() : null)
                .build();
        
        // Map user info
        AdminCommentDTO.UserInfo userInfo = AdminCommentDTO.UserInfo.builder()
                .userName(comment.getDisplayName())
                .userAvatar("/images/user/default-avatar.jpg") // Default avatar since we don't have user avatar in comment
                .build();
        dto.setCmUser(userInfo);
        
        // Map product info
        if (comment.getCmProduct() != null) {
            String productImageUrl = "/images/product/default-product.jpg";
            // Get first image if available
            if (comment.getCmProduct().getImages() != null && !comment.getCmProduct().getImages().isEmpty()) {
                productImageUrl = comment.getCmProduct().getImages().get(0).getImageData();
            }
            
            AdminCommentDTO.ProductInfo productInfo = AdminCommentDTO.ProductInfo.builder()
                    .prodId(comment.getCmProduct().getProdId())
                    .prodName(comment.getCmProduct().getProdName())
                    .prodImageUrl(productImageUrl)
                    .build();
            dto.setCmProduct(productInfo);
        }
        
        // Fetch first reply for this comment if any exists
        try {
            List<Comment> replies = commentRepository.findByCommentOrderByCmDateAsc(comment, org.springframework.data.domain.PageRequest.of(0, 1)).getContent();
            if (!replies.isEmpty()) {
                Comment firstReply = replies.get(0);
                AdminCommentDTO.CommentReplyInfo replyInfo = AdminCommentDTO.CommentReplyInfo.builder()
                        .cmContent(firstReply.getCmContent())
                        .displayName(firstReply.getDisplayName() != null ? firstReply.getDisplayName() : "ADMIN")
                        .cmDate(firstReply.getCmDate() != null ? firstReply.getCmDate().toString() : "")
                        .build();
                dto.setComment(replyInfo);
            } else {
                dto.setComment(null);
            }
        } catch (Exception e) {
            dto.setComment(null);
        }
        
        // Count replies (use simple count query to avoid loading all replies)
        try {
            Long replyCount = commentRepository.countRepliesForComment(comment.getCmId());
            dto.setReplyCount(replyCount != null ? replyCount : 0L);
        } catch (Exception e) {
            dto.setReplyCount(0L);
        }
        
        return dto;
    }
    
    /**
     * Create an admin reply to a comment
     */
    @Transactional
    public AdminCommentDTO createAdminReply(Integer parentCommentId, String replyContent) {
        // Find parent comment
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Create reply comment
        Comment replyComment = new Comment();
        replyComment.setCmContent(replyContent);
        replyComment.setCmStatus(CommentStatus.APPROVED); // Admin replies are auto-approved
        replyComment.setDisplayName("ADMIN");
        replyComment.setAnonymous(false);
        replyComment.setIpAddress("127.0.0.1"); // Admin IP
        
        // Set relationships
        replyComment.setComment(parentComment); // Set parent comment
        replyComment.setCmProduct(parentComment.getCmProduct()); // Same product as parent
        // Note: cmUser is null for admin replies
        
        // Save the reply
        Comment savedReply = commentRepository.save(replyComment);
        
        // Convert to DTO and return
        return mapToAdminCommentDTO(savedReply);
    }
}