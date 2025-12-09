package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.CreateCommentRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CommentPageResponse;
import iuh.fit.se.enternalrunebackend.dto.response.CommentResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ImageInfo;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.CommentStatus;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.CommentService;
import iuh.fit.se.enternalrunebackend.service.ImageService;
import iuh.fit.se.enternalrunebackend.service.PurchaseCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of CommentService
 * Handles business logic for comment operations, validation, and file uploads
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentImageRepository commentImageRepository;
    private final ProductRepository productRepository;
    private final PurchaseCheckService purchaseCheckService;
    private final ImageService imageService;

    // Business rules constants
    private static final int RATE_LIMIT_SECONDS = 10;
    private static final int MAX_IMAGES_PER_COMMENT = 6;
    private static final int MAX_CONTENT_LENGTH = 1000;

    @Override
    @Transactional(readOnly = true)
    public CommentPageResponse getComments(Integer productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findByProductIdOrderByCmDateDesc(productId, pageable);

        List<CommentResponse> commentResponses = commentPage.getContent().stream()
                .map(comment -> mapToCommentResponse(comment, productId))
                .collect(Collectors.toList());

        // Get rating statistics
        Double averageRating = commentRepository.getAverageRating(productId);
        Long totalRatings = commentRepository.countByProductId(productId);
        Map<Integer, Long> ratingDistribution = getRatingDistribution(productId);

        // Fill missing ratings with 0
        Map<Integer, Long> completeRatingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            completeRatingDistribution.put(i, ratingDistribution.getOrDefault(i, 0L));
        }

        return CommentPageResponse.builder()
                .comments(commentResponses)
                .currentPage(page)
                .pageSize(size)
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .hasNext(commentPage.hasNext())
                .hasPrevious(commentPage.hasPrevious())
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalRatings(totalRatings)
                .ratingDistribution(completeRatingDistribution)
                .build();
    }

    @Override
    @Transactional
    public CommentResponse createComment(Integer productId, CreateCommentRequest request,
            MultipartFile[] images, Optional<User> currentUser, String ipAddress) {
        // Xác định đã mua hàng chưa - sử dụng service thay vì trực tiếp repository
        boolean hasPurchased = false;
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            // Kiểm tra user đã mua hàng với productId hay chưa
            hasPurchased = purchaseCheckService.hasUserPurchasedProduct(user.getUserId(), productId);
        }
        // Nếu chưa mua, không cho phép gửi rating (ép về null)
        if (!hasPurchased && request.getParentCommentId() == null) {
            request.setRating(null);
        }
        // Validate request
        validateCommentRequest(request, images, hasPurchased);

        // Rate limiting check
        checkRateLimit(ipAddress);

        // Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        // Determine display name and anonymous flag
        String displayName;
        boolean isAnonymous = currentUser.isEmpty();

        if (currentUser.isPresent()) {
            User user = currentUser.get();
            displayName = user.getName(); // Use actual username if logged in
            if (request.getDisplayName() != null && !request.getDisplayName().trim().isEmpty()) {
                displayName = request.getDisplayName().trim(); // Allow override
            }
        } else {
            displayName = request.getDisplayName() != null && !request.getDisplayName().trim().isEmpty()
                    ? request.getDisplayName().trim()
                    : "Khách";
        }

        // Create comment entity
        Comment comment = new Comment();
        comment.setCmContent(request.getContent() != null ? request.getContent().trim() : "");
        // Nếu chưa mua thì không set rating (hoặc set null)
        if (hasPurchased && request.getRating() != null) {
            comment.setCmRating(request.getRating());
        } else {
            comment.setCmRating(null); // Integer cho phép null
        }
        comment.setDisplayName(displayName);
        comment.setIpAddress(ipAddress);
        comment.setAnonymous(isAnonymous);
        comment.setCmStatus(CommentStatus.APPROVED); // Auto-approve for now, can be PENDING for moderation
        comment.setCmUser(currentUser.orElse(null));
        comment.setCmProduct(product);
        comment.setCmDate(LocalDateTime.now());

        // Handle parent comment for replies
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Parent comment not found: " + request.getParentCommentId()));
            comment.setComment(parentComment);
        }

        // Save comment
        Comment savedComment = commentRepository.save(comment);

        // Handle image uploads
        List<CommentImage> commentImages = new ArrayList<>();
        if (images != null && images.length > 0) {
            commentImages = saveCommentImages(savedComment, images);
        }

        // Set images and save again to trigger cascade
        savedComment.setImages(commentImages);
        commentRepository.saveAndFlush(savedComment);

        CommentResponse response = mapToCommentResponse(savedComment, productId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Long> getRatingDistribution(Integer productId) {
        // Gọi repository method để lấy danh sách phân bố rating từ database
        List<Object[]> rawResults = commentRepository.getRatingDistributionList(productId);

        // Chuyển đổi từ List<Object[]> thành Map<Integer, Long>
        Map<Integer, Long> distribution = new HashMap<>();
        for (Object[] row : rawResults) {
            // row[0] = rating, row[1] = count
            Integer rating = (Integer) row[0];
            Long count = ((Number) row[1]).longValue();
            distribution.put(rating, count);
        }

        // Đảm bảo tất cả rating từ 1-5 đều có trong map, nếu không có thì gán giá trị 0
        Map<Integer, Long> result = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            result.put(i, distribution.getOrDefault(i, 0L));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public double getAverageRating(Integer productId) {
        Double average = commentRepository.getAverageRating(productId);
        return average != null ? average : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getReplyComments(Integer parentCommentId, int page, int size) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found: " + parentCommentId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> replyPage = commentRepository.findByCommentOrderByCmDateAsc(parentComment, pageable);

        // Get productId from parent comment
        Integer productId = parentComment.getCmProduct().getProdId();

        return replyPage.map(comment -> mapToCommentResponse(comment, productId));
    }

    @Override
    @Transactional
    public void deleteCommentImage(Integer imageId, Optional<User> currentUser) {
        // Find the image
        CommentImage commentImage = commentImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Comment image not found: " + imageId));

        Comment comment = commentImage.getComment();

        // Authorization check - only comment owner or admin can delete
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            if (!comment.getCmUser().equals(user) && !isAdmin(user)) {
                throw new RuntimeException("Unauthorized to delete this image");
            }
        } else {
            throw new RuntimeException("Authentication required to delete image");
        }

        // Note: We don't delete from Cloudinary for comment images
        // as they use the same ImageService as products and we don't want to break
        // product images
        // Cloudinary will handle cleanup through its auto-deletion policies

        // Delete from database
        commentImageRepository.delete(commentImage);
    }

    /**
     * Check if user is admin (implement based on your role system)
     */
    private boolean isAdmin(User user) {
        // Implement based on your role system
        // For now, return false - you can update this based on your User entity
        // structure
        return false;
    }

    /**
     * Validate comment request
     */
    private void validateCommentRequest(CreateCommentRequest request, MultipartFile[] images) {
        // Allow rating 0 for replies, cho phép rating = 0 cho comment nếu chưa mua hàng
        validateCommentRequest(request, images, false);
    }

    // Overload: validate với hasPurchased
    private void validateCommentRequest(CreateCommentRequest request, MultipartFile[] images, boolean hasPurchased) {
        if (request.getParentCommentId() == null) {
            // Regular comment
            if (hasPurchased) {
                // Đã mua: yêu cầu rating 1-5
                if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
                    throw new IllegalArgumentException("Rating must be between 1 and 5 for comments");
                }
            } else {
                // Chưa mua: không cho phép gửi rating
                if (request.getRating() != null) {
                    throw new IllegalArgumentException("Không được gửi rating khi chưa mua hàng");
                }
            }
        } else {
            // Reply - allow rating 0, but still check upper bound
            if (request.getRating() != null && (request.getRating() < 0 || request.getRating() > 5)) {
                throw new IllegalArgumentException("Rating must be between 0 and 5 for replies");
            }
        }

        if (request.getContent() != null && request.getContent().length() > MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException("Content must not exceed " + MAX_CONTENT_LENGTH + " characters");
        }

        if (images != null && images.length > MAX_IMAGES_PER_COMMENT) {
            throw new IllegalArgumentException("Maximum " + MAX_IMAGES_PER_COMMENT + " images allowed per comment");
        }

        if (request.getDisplayName() != null && request.getDisplayName().length() > 100) {
            throw new IllegalArgumentException("Display name must not exceed 100 characters");
        }
    }

    /**
     * Check rate limiting
     */
    private void checkRateLimit(String ipAddress) {
        LocalDateTime checkTime = LocalDateTime.now().minusSeconds(RATE_LIMIT_SECONDS);
        int recentComments = commentRepository.countByIpAddressAndCmDateAfter(ipAddress, checkTime);

        if (recentComments > 0) {
            throw new RuntimeException(
                    "Rate limit exceeded. Please wait " + RATE_LIMIT_SECONDS + " seconds between comments.");
        }
    }

    /**
     * Save comment images using ImageService (same as ProductService)
     */
    private List<CommentImage> saveCommentImages(Comment comment, MultipartFile[] images) {
        List<CommentImage> commentImages = new ArrayList<>();

        for (int i = 0; i < images.length; i++) {
            MultipartFile image = images[i];
            if (image.isEmpty())
                continue;

            try {
                // Upload to Cloudinary using ImageService (same as ProductService)
                String imageUrl = imageService.upload(image.getBytes(), image.getOriginalFilename());

                CommentImage commentImage = CommentImage.builder()
                        .url(imageUrl)
                        .fileName(image.getOriginalFilename())
                        .size(image.getSize())
                        .displayOrder(i)
                        .comment(comment)
                        .build();

                CommentImage savedImage = commentImageRepository.save(commentImage);
                commentImages.add(savedImage);

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
            }
        }

        return commentImages;
    }

    /**
     * Map Comment entity to CommentResponse DTO
     */
    private CommentResponse mapToCommentResponse(Comment comment, Integer productId) {
        List<ImageInfo> imageInfos = new ArrayList<>();
        
        // Safe access to images - handle lazy loading gracefully
        try {
            if (comment.getImages() != null && !comment.getImages().isEmpty()) {
                imageInfos = comment.getImages().stream()
                        .map(img -> ImageInfo.builder()
                                .id(img.getId())
                                .fileName(img.getFileName())
                                .url(img.getUrl())
                                .size(img.getSize())
                                .displayOrder(img.getDisplayOrder())
                                .build())
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Failed to load images for comment {}: {}", comment.getCmId(), e.getMessage());
            imageInfos = new ArrayList<>(); // Return empty list on error
        }

        // Get reply count safely
        int replyCount = 0;
        try {
            replyCount = comment.getCmReplyComment() != null ? comment.getCmReplyComment().size() : 0;
        } catch (Exception e) {
            log.warn("Failed to count replies for comment {}: {}", comment.getCmId(), e.getMessage());
        }

        // Check purchase status của COMMENT AUTHOR (không phải current user)
        boolean hasPurchased = false;
        if (comment.getCmUser() != null && comment.getCmUser().getUserId() != null) {
            try {
                Long authorUserId = comment.getCmUser().getUserId();
                hasPurchased = purchaseCheckService.hasUserPurchasedProduct(authorUserId, productId);
            } catch (Exception e) {
                log.warn("Failed to check purchase status for comment author {}: {}", 
                         comment.getCmUser().getUserId(), e.getMessage());
                hasPurchased = false;
            }
        }

        // Get username safely (handle lazy loading and type issues)
        String username = null;
        try {
            if (comment.getCmUser() != null) {
                Object nameObj = comment.getCmUser().getName();
                if (nameObj instanceof String) {
                    username = (String) nameObj;
                } else if (nameObj != null) {
                    // Handle case where name is Integer or other type
                    username = String.valueOf(nameObj);
                }
            }
        } catch (Exception e) {
        }

        // Get parent comment ID safely (handle lazy loading)
        Integer parentCommentId = null;
        try {
            if (comment.getComment() != null) {
                parentCommentId = comment.getComment().getCmId();
            }
        } catch (Exception e) {
        }

        return CommentResponse.builder()
                .id(comment.getCmId())
                .content(comment.getCmContent())
                .rating(comment.getCmRating())
                .displayName(comment.getDisplayName())
                .username(username)
                .isAnonymous(comment.isAnonymous())
                .status(comment.getCmStatus())
                .createdAt(comment.getCmDate())
                .productId(productId) // Use parameter instead of lazy-loaded entity
                .parentCommentId(parentCommentId)
                .images(imageInfos)
                .replyCount(replyCount)
                .hasPurchased(hasPurchased) // Purchase status của comment author
                .build();
    }

}