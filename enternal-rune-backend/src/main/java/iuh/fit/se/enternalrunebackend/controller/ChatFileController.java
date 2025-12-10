package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Conversation;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ConversationRepository;
import iuh.fit.se.enternalrunebackend.service.ChatFileService;
import iuh.fit.se.enternalrunebackend.util.AssistanceChatSecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@Slf4j
public class ChatFileController {

    private final ChatFileService chatFileService;
    private final ConversationRepository conversationRepository;
    private final AssistanceChatSecurityUtil assistanceChatSecurityUtil;
    
    @PostMapping("/conversations/{conversationId}/image")
    public ResponseEntity<Message> uploadImage(
            @PathVariable String conversationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") String senderId,
            @RequestParam("senderRole") Role senderRole,
            @RequestParam(value = "caption", required = false) String caption
    ) throws Exception {
        
        // Validate conversation tồn tại
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> {
                    log.warn("Conversation không tồn tại: {}", conversationId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation không tồn tại");
                });

        // Validate ownership: senderId phải khớp với customerId hoặc agentId của conversation
        boolean isAuthorized = false;

        if (senderRole == Role.CUSTOMER) {
            // Customer chỉ có thể gửi ảnh trong conversation của chính mình
            if (conversation.getCustomerId() != null && conversation.getCustomerId().equals(senderId)) {
                isAuthorized = true;
            }
        } else if (senderRole == Role.AGENT) {
            // Agent chỉ có thể gửi ảnh trong conversation được assign cho mình
            if (conversation.getAgentId() != null && conversation.getAgentId().equals(senderId)) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            log.warn("Unauthorized: senderId {} không có quyền gửi ảnh trong conversation {}", 
                    senderId, conversationId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Không có quyền gửi ảnh trong conversation này");
        }

        // Validate senderId từ request phải khớp với user hiện tại (nếu có authentication)
        // Lưu ý: Với HTTP endpoint, có thể validate từ SecurityContext
        Long currentUserId = assistanceChatSecurityUtil.getCurrentUserId().orElse(null);
        if (currentUserId != null) {
            String currentUserIdStr = currentUserId.toString();
            if (senderRole == Role.CUSTOMER && !currentUserIdStr.equals(senderId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                        "senderId không khớp với user hiện tại");
            }
        }

        Message saved = chatFileService.uploadImageAndBroadcast(
                conversationId,
                senderId,
                senderRole,
                caption,
                file
        );

        return ResponseEntity.ok(saved);
    }
}
