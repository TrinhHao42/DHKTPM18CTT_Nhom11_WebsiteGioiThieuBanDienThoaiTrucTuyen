package iuh.fit.se.enternalrunebackend.service.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.enternalrunebackend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final Cloudinary cloudinary;
    public String upload(byte[] imageData, String fileName) throws IOException {

        // ===== 1. Giới hạn kích thước (5MB) =====
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (imageData.length > maxSize) {
            throw new IOException("Kích thước file vượt quá giới hạn 5MB.");
        }
        String lower = fileName.toLowerCase();
        if (!(lower.endsWith(".jpg") ||
                lower.endsWith(".jpeg") ||
                lower.endsWith(".png") ||
                lower.endsWith(".webp"))) {

            throw new IOException("Định dạng file không được hỗ trợ! Chỉ cho phép JPG, JPEG, PNG, WEBP");
        }
        String publicId = fileName.replaceFirst("[.][^.]+$", "");
        Map uploadResult = cloudinary.uploader().upload(
                imageData,
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "image",
                        "transformation", new com.cloudinary.Transformation()
                                .width(1200)
                                .height(1200)
                                .crop("limit")
                )
        );
        return uploadResult.get("secure_url").toString();
    }

}