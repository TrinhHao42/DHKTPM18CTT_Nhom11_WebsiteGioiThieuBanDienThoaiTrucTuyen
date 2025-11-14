package iuh.fit.se.enternalrunebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import iuh.fit.se.enternalrunebackend.dto.ai.SupportChatResponse;
import iuh.fit.se.enternalrunebackend.dto.ai.SupportProductInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SupportChatService {

    private static final String REFUSAL_MESSAGE = "Xin lỗi, hiện tại tôi chỉ có thể cung cấp thông tin dựa trên dữ liệu sản phẩm có trong cửa hàng. Bạn vui lòng hỏi cụ thể về sản phẩm nhé!";
    private static final NumberFormat CURRENCY_FORMAT = NumberFormat.getCurrencyInstance(Locale.of("vi", "VN"));

    private final ProductEmbeddingService productEmbeddingService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String geminiApiKey;
    private final String geminiModel;

    public SupportChatService(ProductEmbeddingService productEmbeddingService,
                              RestTemplateBuilder restTemplateBuilder,
                              ObjectMapper objectMapper,
                              @Value("${spring.ai.vertex.ai.gemini.api-key:${spring.ai.google.gemini.api-key:}}") String geminiApiKey,
                              @Value("${spring.ai.vertex.ai.gemini.model:${spring.ai.google.gemini.chat.options.model:gemini-1.5-flash-latest}}") String geminiModel) {
        this.productEmbeddingService = productEmbeddingService;
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
        this.geminiApiKey = geminiApiKey;
        this.geminiModel = geminiModel;
    }

    @Transactional(readOnly = true)
    public SupportChatResponse ask(String rawQuestion) {
        String question = rawQuestion == null ? "" : rawQuestion.trim();
        if (question.isEmpty()) {
            return SupportChatResponse.fallback("Bạn vui lòng nhập câu hỏi cụ thể nhé!");
        }

        List<SupportProductInfo> sources = productEmbeddingService.searchRelevantProducts(question, 5);

        if (sources.isEmpty()) {
            return SupportChatResponse.fallback(REFUSAL_MESSAGE);
        }

        String context = buildContext(sources);
        String answer = callModel(question, context);

        boolean answered = answer != null && !answer.isBlank() && !answer.equals(REFUSAL_MESSAGE);
        if (!answered) {
            answer = buildFallbackSummary(sources);
        }
        return new SupportChatResponse(answer, answered, sources);
    }

    private String callModel(String question, String context) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.warn("Gemini API key chưa được cấu hình. Không thể gọi AI.");
            return REFUSAL_MESSAGE;
        }

        final String systemPrompt = """
                Bạn là trợ lý bán hàng cho cửa hàng thiết bị di động Enternal Rune.
                Bạn chỉ được phép sử dụng thông tin có trong khối CONTEXT để trả lời.
                Nếu câu hỏi không liên quan hoặc CONTEXT không có dữ liệu phù hợp, hãy trả lời đúng mẫu:
                "Xin lỗi, hiện tại tôi chỉ có thể cung cấp thông tin dựa trên sản phẩm có trong cửa hàng. Vui lòng hỏi về sản phẩm cụ thể nhé!"
                Trả lời ngắn gọn, tiếng Việt, tập trung vào lợi ích khách hàng.
                """;

        final String fullPrompt = """
                CONTEXT:
                %s

                CÂU HỎI: %s
                """.formatted(context, question);

        try {
            String endpoint = "https://generativelanguage.googleapis.com/v1/models/%s:generateContent?key=%s"
                    .formatted(geminiModel, geminiApiKey);

            ObjectNode payload = objectMapper.createObjectNode();
            ArrayNode contents = payload.putArray("contents");
            ObjectNode contentNode = contents.addObject();
            ArrayNode parts = contentNode.putArray("parts");
            parts.addObject().put("text", systemPrompt + "\n\n" + fullPrompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(endpoint, request, JsonNode.class);

            JsonNode root = response.getBody();
            if (root == null) {
                return buildFallbackSummaryFromContext(context);
            }

            JsonNode firstCandidate = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (firstCandidate.isMissingNode() || firstCandidate.asText().isBlank()) {
                return REFUSAL_MESSAGE;
            }

            return firstCandidate.asText().trim();
        } catch (Exception exception) {
            log.error("Không thể gọi mô hình AI hỗ trợ khách hàng", exception);
            return buildFallbackSummaryFromContext(context);
        }
    }

    private String buildContext(List<SupportProductInfo> sources) {
        return sources.stream()
                .map(info -> """
                        Tên: %s
                        Thương hiệu: %s
                        Giá bán: %s
                        Mô tả: %s
                        """.formatted(
                        info.name(),
                        info.brand(),
                        formatPrice(info.price()),
                        Objects.requireNonNullElse(info.description(), "Chưa có mô tả")))
                .collect(Collectors.joining("\n---\n"));
    }

    private String buildFallbackSummary(List<SupportProductInfo> sources) {
        if (sources == null || sources.isEmpty()) {
            return REFUSAL_MESSAGE;
        }
        String suggestions = sources.stream()
                .map(info -> "- %s (%s, giá %s)".formatted(
                        info.name(),
                        info.brand(),
                        formatPrice(info.price())))
                .collect(Collectors.joining("\n"));
        return """
                Tôi chưa thể trả lời chính xác câu hỏi, nhưng bạn có thể tham khảo những sản phẩm sau:
                %s
                """.formatted(suggestions);
    }

    private String buildFallbackSummaryFromContext(String context) {
        if (context == null || context.isBlank()) {
            return REFUSAL_MESSAGE;
        }
        String suggestions = Arrays.stream(context.split("---"))
                .map(String::trim)
                .filter(part -> !part.isBlank())
                .map(part -> part.lines()
                        .filter(line -> line.startsWith("Tên:") || line.startsWith("Giá bán:"))
                        .collect(Collectors.joining(" | ")))
                .filter(line -> !line.isBlank())
                .collect(Collectors.joining("\n"));
        if (suggestions.isBlank()) {
            return REFUSAL_MESSAGE;
        }
        return """
                Tôi chưa thể trả lời chi tiết, nhưng đây là một vài gợi ý trong cửa hàng:
                %s
                """.formatted(suggestions);
    }

    private String formatPrice(Double value) {
        if (value == null) {
            return "Đang cập nhật";
        }
        return CURRENCY_FORMAT.format(value);
    }
}

