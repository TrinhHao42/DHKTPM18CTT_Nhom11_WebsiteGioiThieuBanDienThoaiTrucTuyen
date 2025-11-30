package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.CreateCommentRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CommentPageResponse;
import iuh.fit.se.enternalrunebackend.dto.response.CommentResponse;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

/**
 * Service interface for Comment operations
 * Provides business logic for comment management, rating statistics, and file uploads
 */
public interface CommentService {
    
    /**
     * Get paginated comments for a product
     * @param productId the product ID
     * @param page page number (0-based)
     * @param size page size
     * @return paginated comment response with statistics
     */
    CommentPageResponse getComments(Integer productId, int page, int size);
    
    /**
     * Create a new comment
     * @param productId the product ID
     * @param request the comment request data
     * @param images optional image files (max 6, max 5MB each)
     * @param currentUser optional authenticated user
     * @param ipAddress client IP address for rate limiting
     * @return created comment response
     * @throws IllegalArgumentException if validation fails
     * @throws RuntimeException if rate limit exceeded or other errors
     */
    CommentResponse createComment(
            Integer productId, 
            CreateCommentRequest request, 
            MultipartFile[] images, 
            Optional<User> currentUser, 
            String ipAddress
    );
    
    /**
     * Get rating distribution for a product
     * @param productId the product ID
     * @return map of rating (1-5) to count
     */
    Map<Integer, Long> getRatingDistribution(Integer productId);
    
    /**
     * Get average rating for a product
     * @param productId the product ID
     * @return average rating (0.0 if no ratings)
     */
    double getAverageRating(Integer productId);
    
    /**
     * Get reply comments for a parent comment
     * @param parentCommentId the parent comment ID
     * @param page page number (0-based)
     * @param size page size
     * @return paginated reply comments
     */
    Page<CommentResponse> getReplyComments(Integer parentCommentId, int page, int size);
    
    /**
     * Delete a comment image from Cloudinary and database
     * @param imageId the comment image ID
     * @param currentUser optional authenticated user (for authorization)
     * @throws IllegalArgumentException if image not found
     * @throws RuntimeException if deletion fails
     */
    void deleteCommentImage(Integer imageId, Optional<User> currentUser);
}