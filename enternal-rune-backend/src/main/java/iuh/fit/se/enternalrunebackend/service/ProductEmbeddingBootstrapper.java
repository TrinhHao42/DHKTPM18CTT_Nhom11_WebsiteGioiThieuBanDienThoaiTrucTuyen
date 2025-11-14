package iuh.fit.se.enternalrunebackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductEmbeddingBootstrapper {

    private final ProductEmbeddingService productEmbeddingService;

    @Value("${app.ai.embedding.bootstrap-on-startup:true}")
    private boolean bootstrapOnStartup;

    @EventListener(ApplicationReadyEvent.class)
    public void ensureEmbeddings() {
        if (!bootstrapOnStartup) {
            log.info("Bỏ qua bootstrap embeddings theo cấu hình.");
            return;
        }
        productEmbeddingService.rebuildProductEmbeddingsIfEmpty();
    }
}

