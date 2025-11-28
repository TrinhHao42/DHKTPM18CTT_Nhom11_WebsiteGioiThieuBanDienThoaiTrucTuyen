package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Conversation;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public Conversation createConversation(@RequestParam String customerId) {
        // Kiểm tra xem đã có conversation active (PENDING hoặc IN_PROGRESS) chưa
        List<Conversation> existingConversations = conversationRepository.findByCustomerId(customerId);
        
        // Tìm conversation chưa đóng
        for (Conversation conv : existingConversations) {
            if ("PENDING".equals(conv.getStatus()) || "IN_PROGRESS".equals(conv.getStatus())) {
                // Trả về conversation đang active thay vì tạo mới
                return conv;
            }
        }
        
        // Nếu không có conversation active, tạo mới
        Conversation c = new Conversation();
        c.setCustomerId(customerId);
        c.setStatus("PENDING");
        c.setCreatedAt(Instant.now());
        Conversation saved = conversationRepository.save(c);
        
        // Broadcast conversation mới cho admin qua WebSocket
        messagingTemplate.convertAndSend("/topic/conversations", saved);
        
        return saved;
    }

    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable String id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @GetMapping("/customer/{customerId}")
    public List<Conversation> getByCustomer(@PathVariable String customerId) {
        return conversationRepository.findByCustomerId(customerId);
    }

    @GetMapping
    public Page<Conversation> getAllConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return conversationRepository.findAll(pageable);
    }

    @PatchMapping("/{id}")
    public Conversation updateConversation(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates
    ) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (updates.containsKey("status")) {
            conversation.setStatus((String) updates.get("status"));
            if ("CLOSED".equals(updates.get("status"))) {
                conversation.setClosedAt(Instant.now());
            }
        }

        if (updates.containsKey("agentId")) {
            conversation.setAgentId((String) updates.get("agentId"));
        }

        Conversation updated = conversationRepository.save(conversation);
        
        // Broadcast conversation đã update qua WebSocket
        messagingTemplate.convertAndSend("/topic/conversations", updated);
        
        return updated;
    }
}
