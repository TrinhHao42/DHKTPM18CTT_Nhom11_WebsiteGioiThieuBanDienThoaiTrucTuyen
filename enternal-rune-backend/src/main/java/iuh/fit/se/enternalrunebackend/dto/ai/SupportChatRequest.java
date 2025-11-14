package iuh.fit.se.enternalrunebackend.dto.ai;

import jakarta.validation.constraints.NotBlank;

public record SupportChatRequest(
        @NotBlank(message = "Câu hỏi không được để trống")
        String question
) {
}

