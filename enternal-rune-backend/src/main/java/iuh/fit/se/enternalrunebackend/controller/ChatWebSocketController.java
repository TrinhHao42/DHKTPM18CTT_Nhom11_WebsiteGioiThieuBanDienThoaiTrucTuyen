package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.assistanceChat.ChatMessageDto;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ConversationRepository;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversations/{conversationId}/send")
    public void sendMessage(
            @DestinationVariable String conversationId,
            @Payload ChatMessageDto chatMessageDto
    ) {
        // Validate conversation tồn tại
        var conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> {
                    log.warn("Conversation không tồn tại: {}", conversationId);
                    return new RuntimeException("Conversation không tồn tại");
                });

        String senderId = chatMessageDto.getSenderId();
        Role senderRole = chatMessageDto.getSenderRole();

        // Validate ownership: senderId phải khớp với customerId hoặc agentId của conversation
        boolean isAuthorized = false;

        if (senderRole == Role.CUSTOMER) {
            // Customer chỉ có thể gửi tin nhắn trong conversation của chính mình
            if (conversation.getCustomerId() != null && conversation.getCustomerId().equals(senderId)) {
                isAuthorized = true;
            }
        } else if (senderRole == Role.AGENT) {
            // Agent chỉ có thể gửi tin nhắn trong conversation được assign cho mình
            if (conversation.getAgentId() != null && conversation.getAgentId().equals(senderId)) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            log.warn("Unauthorized: senderId {} không có quyền gửi tin nhắn trong conversation {}", 
                    senderId, conversationId);
            throw new RuntimeException("Không có quyền gửi tin nhắn trong conversation này");
        }

        // Tạo và lưu message
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setSenderRole(senderRole);
        message.setContent(chatMessageDto.getContent());
        message.setType("TEXT");
        message.setCreatedAt(Instant.now());
        
        Message saved = messageRepository.save(message);
        
        // Broadcast message đến tất cả subscribers của conversation
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                saved
        );
    }
}
