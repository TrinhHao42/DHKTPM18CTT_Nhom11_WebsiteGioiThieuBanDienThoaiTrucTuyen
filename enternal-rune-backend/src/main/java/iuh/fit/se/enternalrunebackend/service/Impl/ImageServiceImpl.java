package iuh.fit.se.enternalrunebackend.service.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.enternalrunebackend.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageServiceImpl implements ImageService {
    
    private final Cloudinary cloudinary;
    @Override
    public String upload(byte[] imageData, String fileName) throws IOException {
        
        // Validate inputs
        if (imageData == null || imageData.length == 0) {
            throw new IOException("Image data is empty");
        }
        
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IOException("File name is required");
        }

        try {
            // ===== 1. File size validation (5MB) =====
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (imageData.length > maxSize) {
                throw new IOException("File size exceeds 5MB limit");
            }

            // ===== 2. File format validation =====
            String lowerFileName = fileName.toLowerCase();
            if (!(lowerFileName.endsWith(".jpg") ||
                  lowerFileName.endsWith(".jpeg") ||
                  lowerFileName.endsWith(".png") ||
                  lowerFileName.endsWith(".webp"))) {
                throw new IOException("Unsupported file format. Only JPG, JPEG, PNG, WEBP allowed");
            }

            // ===== 3. Generate public_id =====
            String publicId = fileName.replaceFirst("[.][^.]+$", "") + "_" + System.currentTimeMillis();

            // ===== 4. Upload to Cloudinary =====
            log.info("Uploading image: {} (size: {} bytes)", fileName, imageData.length);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    imageData,
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "image",
                            "folder", "comment_images", // Organize in folder
                            "transformation", new Transformation<>()
                                    .width(1200)
                                    .height(1200)
                                    .crop("limit")
                                    .quality("auto")
                                    .fetchFormat("auto")
                    )
            );

            // ===== 5. Extract secure URL =====
            String secureUrl = (String) uploadResult.get("secure_url");
            if (secureUrl == null) {
                throw new IOException("Failed to get secure URL from Cloudinary response");
            }

            log.info("Successfully uploaded image: {} -> {}", fileName, secureUrl);
            return secureUrl;

        } catch (IOException e) {
            log.error("IO Error uploading image {}: {}", fileName, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error uploading image {}: {}", fileName, e.getMessage(), e);
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }
    
    /**
     * Alternative upload method với MultipartFile (nếu cần)
     */
    public String uploadMultipartFile(org.springframework.web.multipart.MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        return upload(file.getBytes(), file.getOriginalFilename());
    }

}