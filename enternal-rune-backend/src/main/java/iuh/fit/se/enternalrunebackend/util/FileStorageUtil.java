package iuh.fit.se.enternalrunebackend.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Utility class for handling file storage
 * Supports local filesystem storage with option to migrate to S3
 * 
 * Current implementation: Local storage in /public/uploads/comments/{productId}/
 * Future: Can be extended to support S3 or other cloud storage
 */
@Component
@Slf4j
public class FileStorageUtil {
    
    // Configuration constants
    private static final String UPLOAD_DIR = "public/uploads/comments";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    );
    
    /**
     * Save uploaded file to filesystem
     * @param file the multipart file
     * @param productId the product ID (for directory organization)
     * @return FileUploadResult with file info
     * @throws IOException if file operations fail
     * @throws IllegalArgumentException if validation fails
     */
    public FileUploadResult saveFile(MultipartFile file, Integer productId) throws IOException {
        // Validation
        validateFile(file);
        
        // Create directory structure
        Path uploadPath = createUploadDirectory(productId);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = generateUniqueFilename(fileExtension);
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Generate URL
        String url = String.format("/uploads/comments/%d/%s", productId, uniqueFilename);
        
        log.info("File saved successfully: {} -> {}", originalFilename, filePath);
        
        return FileUploadResult.builder()
            .originalFilename(originalFilename)
            .savedFilename(uniqueFilename)
            .url(url)
            .size(file.getSize())
            .mimeType(file.getContentType())
            .filePath(filePath.toString())
            .build();
    }
    
    /**
     * Validate uploaded file
     * @param file the multipart file
     * @throws IllegalArgumentException if validation fails
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("File type not allowed. Only images are supported: " + ALLOWED_MIME_TYPES);
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Filename is empty");
        }
        
        String extension = getFileExtension(filename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File extension not allowed: " + extension);
        }
    }
    
    /**
     * Create upload directory if not exists
     * @param productId the product ID
     * @return Path to upload directory
     * @throws IOException if directory creation fails
     */
    private Path createUploadDirectory(Integer productId) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR, productId.toString());
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Created upload directory: {}", uploadPath);
        }
        
        return uploadPath;
    }
    
    /**
     * Generate unique filename with timestamp and UUID
     * @param extension the file extension
     * @return unique filename
     */
    private String generateUniqueFilename(String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("%s_%s%s", timestamp, uuid, extension);
    }
    
    /**
     * Get file extension from filename
     * @param filename the filename
     * @return file extension (with dot)
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";
    }
    
    /**
     * Delete file from filesystem
     * @param filePath the file path
     * @return true if deleted successfully
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            boolean deleted = Files.deleteIfExists(path);
            if (deleted) {
                log.info("File deleted: {}", filePath);
            }
            return deleted;
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            return false;
        }
    }
    
    /**
     * Result class for file upload operations
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class FileUploadResult {
        private String originalFilename;
        private String savedFilename;
        private String url;
        private Long size;
        private String mimeType;
        private String filePath;
    }
}

/*
 * Migration Notes for S3:
 * 
 * 1. Add AWS S3 dependencies to pom.xml:
 *    <dependency>
 *        <groupId>software.amazon.awssdk</groupId>
 *        <artifactId>s3</artifactId>
 *    </dependency>
 * 
 * 2. Create S3FileStorageUtil implementing same interface:
 *    - Configure S3Client with credentials
 *    - Use bucket name from application properties
 *    - Generate presigned URLs for public access
 *    - Handle S3 exceptions appropriately
 * 
 * 3. Application properties:
 *    aws.s3.bucket-name=your-bucket-name
 *    aws.s3.region=your-region
 *    aws.access-key-id=your-access-key
 *    aws.secret-access-key=your-secret-key
 * 
 * 4. Use @Profile annotations to switch between local and S3 storage:
 *    @Profile("local") for FileStorageUtil
 *    @Profile("!local") for S3FileStorageUtil
 */