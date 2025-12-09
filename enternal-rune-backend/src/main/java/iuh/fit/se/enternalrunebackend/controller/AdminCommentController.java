package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.AdminCommentDTO;
import iuh.fit.se.enternalrunebackend.dto.response.CommentPageResponse;
import iuh.fit.se.enternalrunebackend.service.AdminCommentService;
import iuh.fit.se.enternalrunebackend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin Controller for managing comments and reviews
 * Reuses existing CommentService for data retrieval
 */
@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminCommentController {

    private final CommentService commentService;
    private final AdminCommentService adminCommentService;

    /**
     * Get all comments across all products with pagination for admin dashboard
     * GET /api/admin/comments
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String ratingFilter,
            @RequestParam(required = false) String statusFilter) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AdminCommentDTO> commentsPage = adminCommentService.getAllCommentsForAdmin(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("comments", commentsPage.getContent());
            response.put("currentPage", page);
            response.put("pageSize", size);
            response.put("totalElements", commentsPage.getTotalElements());
            response.put("totalPages", commentsPage.getTotalPages());
            response.put("hasNext", commentsPage.hasNext());
            response.put("hasPrevious", commentsPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch comments");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("comments", java.util.Collections.emptyList());
            errorResponse.put("currentPage", page);
            errorResponse.put("pageSize", size);
            errorResponse.put("totalElements", 0);
            errorResponse.put("totalPages", 0);
            errorResponse.put("hasNext", false);
            errorResponse.put("hasPrevious", false);
            
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * Get comments for a specific product (reuse existing endpoint)
     * GET /api/admin/comments/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<CommentPageResponse> getCommentsByProduct(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        CommentPageResponse response = commentService.getComments(productId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get review metrics for admin dashboard
     * GET /api/admin/comments/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewMetrics() {
        try {
            Map<String, Object> response = adminCommentService.getReviewMetrics();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch metrics");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("totalReviews", 0);
            errorResponse.put("totalReplies", 0);
            errorResponse.put("averageRating", 0.0);
            errorResponse.put("recentReviews", 0);
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * Update comment status (approve, reject, etc.)
     * PUT /api/admin/comments/{commentId}/status
     */
    @PutMapping("/{commentId}/status")
    public ResponseEntity<Map<String, String>> updateCommentStatus(
            @PathVariable Integer commentId,
            @RequestParam String status) {
        
        // Tạm thời trả về success, sẽ implement logic sau
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Comment status updated successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Reply to a comment
     * POST /api/admin/comments/{commentId}/reply
     */
    @PostMapping("/{commentId}/reply")
    public ResponseEntity<Map<String, Object>> replyToComment(
            @PathVariable Integer commentId,
            @RequestBody Map<String, String> replyData) {
        
        try {
            String replyContent = replyData.get("reply");
            
            if (replyContent == null || replyContent.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Reply content cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            AdminCommentDTO replyDto = adminCommentService.createAdminReply(commentId, replyContent.trim());
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Reply added successfully");
            response.put("reply", replyDto);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to add reply: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}