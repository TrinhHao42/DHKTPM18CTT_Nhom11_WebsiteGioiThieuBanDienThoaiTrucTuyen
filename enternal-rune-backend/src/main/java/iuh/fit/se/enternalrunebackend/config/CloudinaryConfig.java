package iuh.fit.se.enternalrunebackend.config;

import com.cloudinary.Cloudinary;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    /**
     * Cloudinary bean chính cho upload sản phẩm, review, v.v.
     */
    @Bean(name = "cloudinary")
    public Cloudinary cloudinary() {
        Dotenv dotenv = Dotenv.configure()
                .filename(".local.env")
                .load();

        return new Cloudinary(Map.of(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
        ));
    }

    /**
     * Cloudinary bean riêng cho Assistance Chat
     * Sử dụng CLOUDINARY_URL_FOR_ASSISTANCE_CHAT từ .local.env
     */
    @Bean(name = "cloudinaryForAssistanceChat")
    public Cloudinary cloudinaryForAssistanceChat() {
        Dotenv dotenv = Dotenv.configure()
                .filename(".local.env")
                .load();

        String cloudinaryUrl = dotenv.get("CLOUDINARY_URL_FOR_ASSISTANCE_CHAT");
        
        // Parse URL format: cloudinary://api_key:api_secret@cloud_name
        // Example: cloudinary://788367434994931:g9bVQKcNyuCA-ACrDWDOdFriE4Y@dz4zobnat
        return new Cloudinary(cloudinaryUrl);
    }
}
