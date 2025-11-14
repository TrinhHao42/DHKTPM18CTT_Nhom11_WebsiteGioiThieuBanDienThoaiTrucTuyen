package iuh.fit.se.enternalrunebackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class EnternalRuneBackendApplication {

    public static void main(String[] args) {
        // Load biến môi trường từ file .local.env
        Dotenv dotenv = Dotenv.configure()
                .filename(".local.env")
                .ignoreIfMissing()
                .load();
        
        // Đặt biến môi trường vào System để Spring Boot có thể sử dụng
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SpringApplication.run(EnternalRuneBackendApplication.class, args);
    }
}
