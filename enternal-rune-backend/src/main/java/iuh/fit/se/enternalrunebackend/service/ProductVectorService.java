package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.entity.Product;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.ai.document.Document;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductVectorService {

    private final VectorStore vectorStore;
    private final ProductService productService;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional // BẮT BUỘC: giữ session mở
    public void syncProductsToVector() {
        if(vectorStore.similaritySearch("products").isEmpty()) {
            List<Product> products = productService.getAllProductsWithActivePrice();
            List<Document> documents = products.stream()
                    .map(p -> Document.builder()
                            .id(UUID.randomUUID().toString())  // id duy nhất
                            .text(p.getProdName() + " - " + p.getProdDescription() +
                                    ". Giá: " + p.getProductPrices().getFirst().getPpPrice())
                            .metadata(Map.of(
                                    "entity", "product",
                                    "productId", p.getProdId(),
                                    "price", p.getProductPrices().getFirst().getPpPrice(),
                                    "brand", p.getProdBrand().getBrandName(),
                                    "description", p.getProdDescription()
                            ))
                            .build())
                    .toList();

            vectorStore.add(documents);
            System.out.println("Đã nhúng " + documents.size() + " sản phẩm vào vector_store");
        }

    }
}