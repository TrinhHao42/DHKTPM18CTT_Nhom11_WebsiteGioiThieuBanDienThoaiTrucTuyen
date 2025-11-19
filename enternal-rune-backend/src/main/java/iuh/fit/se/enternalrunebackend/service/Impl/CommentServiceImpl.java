package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.CreateCommentRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CommentPageResponse;
import iuh.fit.se.enternalrunebackend.dto.response.CommentResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ImageInfo;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.CommentStatus;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.CommentService;
import iuh.fit.se.enternalrunebackend.util.FileStorageUtil;
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
    private final FileStorageUtil fileStorageUtil;
    
    // Business rules constants
    private static final int RATE_LIMIT_SECONDS = 10;
    private static final int MAX_IMAGES_PER_COMMENT = 6;
    private static final int MAX_CONTENT_LENGTH = 1000;
    
    @Override
    @Transactional(readOnly = true)
    public CommentPageResponse getComments(Integer productId, int page, int size) {
        log.info("Getting comments for product {} - page: {}, size: {}", productId, page, size);
        
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
    public CommentResponse createComment(Integer productId, CreateCommentRequest request, 
                                       MultipartFile[] images, Optional<User> currentUser, String ipAddress) {
        log.info("Creating comment for product {} from IP {}", productId, ipAddress);
        
        // Validate request
        validateCommentRequest(request, images);
        
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
        comment.setCmRating(request.getRating());
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
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found: " + request.getParentCommentId()));
            comment.setComment(parentComment);
        }
        
        // Save comment
        Comment savedComment = commentRepository.save(comment);
        log.info("Comment saved with ID: {}", savedComment.getCmId());
        
        // Handle image uploads
        List<CommentImage> commentImages = new ArrayList<>();
        if (images != null && images.length > 0) {
            commentImages = saveCommentImages(savedComment, images);
        }
        
        // Set images and save again to trigger cascade
        savedComment.setImages(commentImages);
        
        return mapToCommentResponse(savedComment, productId);
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
    }    @Override
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
    
    /**
     * Validate comment request
     */
    private void validateCommentRequest(CreateCommentRequest request, MultipartFile[] images) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
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
            throw new RuntimeException("Rate limit exceeded. Please wait " + RATE_LIMIT_SECONDS + " seconds between comments.");
        }
    }
    
    /**
     * Save comment images
     */
    private List<CommentImage> saveCommentImages(Comment comment, MultipartFile[] images) {
        List<CommentImage> commentImages = new ArrayList<>();
        
        for (int i = 0; i < images.length; i++) {
            MultipartFile image = images[i];
            if (image.isEmpty()) continue;
            
            try {
                FileStorageUtil.FileUploadResult uploadResult = fileStorageUtil.saveFile(image, comment.getCmProduct().getProdId());
                
                CommentImage commentImage = CommentImage.builder()
                        .url(uploadResult.getUrl())
                        .fileName(uploadResult.getOriginalFilename())
                        .size(uploadResult.getSize())
                        .displayOrder(i)
                        .comment(comment)
                        .build();
                
                CommentImage savedImage = commentImageRepository.save(commentImage);
                commentImages.add(savedImage);
                
                log.info("Image saved for comment {}: {}", comment.getCmId(), uploadResult.getOriginalFilename());
                
            } catch (Exception e) {
                log.error("Failed to save image for comment {}: {}", comment.getCmId(), e.getMessage());
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
        if (comment.getImages() != null) {
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
        
        // Get reply count
        int replyCount = comment.getCmReplyComment() != null ? comment.getCmReplyComment().size() : 0;
        
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
                    log.warn("User name for comment {} was not String, converted: {} -> {}", 
                        comment.getCmId(), nameObj.getClass().getSimpleName(), username);
                }
            }
        } catch (Exception e) {
            log.warn("Could not load user for comment {}: {}", comment.getCmId(), e.getMessage());
        }
        
        // Get parent comment ID safely (handle lazy loading)
        Integer parentCommentId = null;
        try {
            if (comment.getComment() != null) {
                parentCommentId = comment.getComment().getCmId();
            }
        } catch (Exception e) {
            log.warn("Could not load parent comment for comment {}: {}", comment.getCmId(), e.getMessage());
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
                .build();
    }
}