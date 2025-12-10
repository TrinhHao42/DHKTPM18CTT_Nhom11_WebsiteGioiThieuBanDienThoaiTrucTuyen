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
  private static final int BATCH_SIZE = 99;

  @EventListener(ApplicationReadyEvent.class)
  @Transactional
  public void syncProductsToVector() {
    if (vectorStore.similaritySearch("products").isEmpty()) {

      List<Product> products = productService.getAllProductsWithActivePrice();

      List<Document> documents = products.stream()
          .map(p -> Document.builder()
              .id(UUID.randomUUID().toString())
              .text("Tên sản phẩm: " + p.getProdName()
                  + " - Thương hiệu: " + p.getProdBrand().getBrandName()
                  + " - Giá: " + p.getProductPrices().getFirst().getPpPrice())
              .metadata(Map.of(
                  "entity", "product",
                  "productId", p.getProdId(),
                  "name", p.getProdName(),
                  "model", p.getProdModel(),
                  "price", p.getProductPrices().getFirst().getPpPrice(),
                  "brand", p.getProdBrand().getBrandName()))
              .build())
          .toList();

      for (int i = 0; i < documents.size(); i += BATCH_SIZE) {
        int end = Math.min(i + BATCH_SIZE, documents.size());
        List<Document> batch = documents.subList(i, end);

        vectorStore.add(batch);
        System.out.println("Đã nhúng batch " + (i / BATCH_SIZE + 1)
            + " (" + batch.size() + " items)");
      }
      System.out.println("Tổng cộng đã nhúng " + documents.size() + " sản phẩm vào vector_store");
    }
  }
}