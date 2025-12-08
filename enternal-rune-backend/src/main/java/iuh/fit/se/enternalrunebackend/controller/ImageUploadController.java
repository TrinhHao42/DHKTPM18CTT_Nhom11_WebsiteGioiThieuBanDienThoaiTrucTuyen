package iuh.fit.se.enternalrunebackend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/upload")
public class ImageUploadController {

    private final Cloudinary cloudinary;

    public ImageUploadController(@Qualifier("cloudinaryForAssistanceChat") Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload ảnh lên Cloudinary
     * POST /upload/image
     *
     * form-data:
     *  - file: (binary) ảnh
     */
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        
        if (file.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "File không được để trống");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Chỉ chấp nhận file ảnh");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "return-requests",
                        "resource_type", "image"
                )
        );
        
        String imageUrl = (String) uploadResult.get("secure_url");
        
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        response.put("url", imageUrl);
        
        return ResponseEntity.ok(response);
    }
}
