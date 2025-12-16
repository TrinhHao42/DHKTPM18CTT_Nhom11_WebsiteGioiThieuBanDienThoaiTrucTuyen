package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Conversation;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ConversationRepository;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import iuh.fit.se.enternalrunebackend.util.AssistanceChatSecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AssistanceChatSecurityUtil assistanceChatSecurityUtil;

    @PostMapping
    public Conversation createConversation(@RequestParam String customerId) {
        // Kiểm tra user hiện tại có phải là customerId không
        Long currentUserId = assistanceChatSecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập"));
        
        String currentUserIdStr = currentUserId.toString();
        if (!currentUserIdStr.equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền tạo conversation cho user khác");
        }

        List<Conversation> existingConversations = conversationRepository.findByCustomerId(customerId);

        for (Conversation conv : existingConversations) {
            if ("PENDING".equals(conv.getStatus()) || "IN_PROGRESS".equals(conv.getStatus())) {
                return conv;
            }
        }
        
        Conversation c = new Conversation();
        c.setCustomerId(customerId);
        c.setStatus("PENDING");
        c.setCreatedAt(Instant.now());
        Conversation saved = conversationRepository.save(c);

        messagingTemplate.convertAndSend("/topic/conversations", saved);
        
        return saved;
    }

    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable String id) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation không tồn tại"));
        
        // Kiểm tra quyền truy cập: chỉ customer owner hoặc agent được assign mới được xem
        Long currentUserId = assistanceChatSecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập"));
        
        String currentUserIdStr = currentUserId.toString();
        
        // Customer chỉ được xem conversation của chính mình
        if (conversation.getCustomerId() != null && conversation.getCustomerId().equals(currentUserIdStr)) {
            return conversation;
        }
        
        // Agent được assign có thể xem
        if (conversation.getAgentId() != null && conversation.getAgentId().equals(currentUserIdStr)) {
            return conversation;
        }
        
        // Admin/Staff có thể xem tất cả (có thể thêm role check ở đây nếu cần)
        // Hiện tại chỉ cho phép customer và agent được assign
        
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền truy cập conversation này");
    }

    @GetMapping("/customer/{customerId}")
    public List<Conversation> getByCustomer(@PathVariable String customerId) {
        // Kiểm tra user hiện tại có phải là customerId không
        Long currentUserId = assistanceChatSecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập"));
        
        String currentUserIdStr = currentUserId.toString();
        if (!currentUserIdStr.equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xem conversation của user khác");
        }
        
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
    @GetMapping("/unread-counts")
    public Map<String, Integer> getUnreadCounts(@RequestParam String agentId) {
        Map<String, Integer> unreadCounts = new HashMap<>();
        List<Conversation> allConversations = conversationRepository.findAll();
        
        for (Conversation conversation : allConversations) {
            List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
            
            if (!messages.isEmpty()) {
                Message lastMessage = messages.get(messages.size() - 1);
                if (lastMessage.getSenderRole() == Role.CUSTOMER ||
                   (lastMessage.getSenderRole() == Role.AGENT && !lastMessage.getSenderId().equals(agentId))) {
                    unreadCounts.put(conversation.getId(), 1);
                }
            }
        }
        
        return unreadCounts;
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
        messagingTemplate.convertAndSend("/topic/conversations", updated);
        
        return updated;
    }
}
