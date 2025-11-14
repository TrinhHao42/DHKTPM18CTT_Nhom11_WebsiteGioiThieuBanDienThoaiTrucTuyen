package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.service.ProductEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai/embeddings")
@RequiredArgsConstructor
public class ProductEmbeddingController {

    private final ProductEmbeddingService productEmbeddingService;

    @PostMapping("/rebuild")
    public ResponseEntity<Map<String, Object>> rebuild() {
        productEmbeddingService.rebuildProductEmbeddings();
        return ResponseEntity.ok(Map.of(
                "message", "Đã kích hoạt quá trình rebuild embeddings. Kiểm tra log để xem chi tiết."
        ));
    }
}

