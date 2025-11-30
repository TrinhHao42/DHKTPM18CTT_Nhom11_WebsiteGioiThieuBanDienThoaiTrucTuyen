package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.CreateCommentRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CommentPageResponse;
import iuh.fit.se.enternalrunebackend.dto.response.CommentResponse;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Product Comments
 * Handles comment and rating operations with multipart file uploads
 * 
 * Endpoints:
 * - GET /api/products/{productId}/comments - Get paginated comments with
 * statistics
 * - POST /api/products/{productId}/comments - Create new comment with images
 * (multipart)
 * - POST /api/products/{productId}/comments/text - Create new text-only comment
 * (JSON)
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductCommentController {

    private final CommentService commentService;

    @GetMapping("/{productId}/comments")
    public ResponseEntity<CommentPageResponse> getComments(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Validate parameters
            if (page < 0)
                page = 0;
            if (size < 1 || size > 50)
                size = 10;

            CommentPageResponse response = commentService.getComments(productId, page, size);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{productId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Integer productId,
            @RequestPart("comment") @Valid CreateCommentRequest request,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = getClientIpAddress(httpRequest);
            Optional<User> currentUser = getCurrentUser();
            CommentResponse response = commentService.createComment(
                    productId, request, images, currentUser, ipAddress);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Rate limit")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{productId}/comments/text")
    public ResponseEntity<CommentResponse> createTextComment(
            @PathVariable Integer productId,
            @RequestBody @Valid CreateCommentRequest request,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = getClientIpAddress(httpRequest);
            Optional<User> currentUser = getCurrentUser();
            CommentResponse response = commentService.createComment(
                    productId, request, null, currentUser, ipAddress);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Rate limit")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<Map<Integer, Long>> getRatingDistribution(@PathVariable Integer productId) {
        try {
            Map<Integer, Long> distribution = commentService.getRatingDistribution(productId);
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<Double> getAverageRating(@PathVariable Integer productId) {
        try {
            double averageRating = commentService.getAverageRating(productId);
            return ResponseEntity.ok(averageRating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a reply to an existing comment
     * POST /api/products/{productId}/comments/{commentId}/replies
     */
    @PostMapping("/{productId}/comments/{commentId}/replies")
    public ResponseEntity<CommentResponse> createReply(
            @PathVariable Integer productId,
            @PathVariable Integer commentId,
            @RequestBody @Valid CreateCommentRequest request,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = getClientIpAddress(httpRequest);
            Optional<User> currentUser = getCurrentUser();

            // Set parentCommentId for reply
            request.setParentCommentId(commentId);

            CommentResponse response = commentService.createComment(
                    productId, request, null, currentUser, ipAddress);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Rate limit")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get replies for a specific comment
     * GET /api/products/{productId}/comments/{commentId}/replies
     */
    @GetMapping("/{productId}/comments/{commentId}/replies")
    public ResponseEntity<CommentPageResponse> getReplies(
            @PathVariable Integer productId,
            @PathVariable Integer commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Validate parameters
            if (page < 0)
                page = 0;
            if (size < 1 || size > 50)
                size = 10;

            var replies = commentService.getReplyComments(commentId, page, size);

            // Convert Page to CommentPageResponse
            CommentPageResponse response = CommentPageResponse.builder()
                    .comments(replies.getContent())
                    .currentPage(replies.getNumber())
                    .pageSize(replies.getSize())
                    .totalElements((long) replies.getTotalElements())
                    .totalPages(replies.getTotalPages())
                    .hasNext(replies.hasNext())
                    .hasPrevious(replies.hasPrevious())
                    .averageRating(0.0) // Replies don't have ratings
                    .totalRatings(0L)
                    .ratingDistribution(Map.of())
                    .build();

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take first IP if multiple
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    private Optional<User> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }
            return Optional.empty();

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Delete a comment image
     * DELETE /api/products/comments/images/{imageId}
     */
    @DeleteMapping("/comments/images/{imageId}")
    public ResponseEntity<Void> deleteCommentImage(@PathVariable Integer imageId) {
        try {
            Optional<User> currentUser = getCurrentUser();
            commentService.deleteCommentImage(imageId, currentUser);

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (e.getMessage().contains("Authentication required")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}