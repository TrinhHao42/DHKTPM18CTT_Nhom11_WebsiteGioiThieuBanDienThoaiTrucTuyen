package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.ai.SupportChatRequest;
import iuh.fit.se.enternalrunebackend.dto.ai.SupportChatResponse;
import iuh.fit.se.enternalrunebackend.service.SupportChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/support")
@RequiredArgsConstructor
public class SupportChatController {

    private final SupportChatService supportChatService;

    @PostMapping
    public ResponseEntity<SupportChatResponse> chat(@Valid @RequestBody SupportChatRequest request) {
        return ResponseEntity.ok(supportChatService.ask(request.question()));
    }
}

