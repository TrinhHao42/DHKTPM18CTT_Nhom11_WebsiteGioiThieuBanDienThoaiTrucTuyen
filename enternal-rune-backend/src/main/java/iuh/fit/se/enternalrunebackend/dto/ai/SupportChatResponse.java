package iuh.fit.se.enternalrunebackend.dto.ai;

import java.util.List;

public record SupportChatResponse(
        String answer,
        boolean fromKnowledgeBase,
        List<SupportProductInfo> sources
) {
    public static SupportChatResponse fallback(String message) {
        return new SupportChatResponse(message, false, List.of());
    }
}

