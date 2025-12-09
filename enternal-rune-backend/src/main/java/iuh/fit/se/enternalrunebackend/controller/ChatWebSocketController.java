package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.assistanceChat.ChatMessageDto;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversations/{conversationId}/send")
    public void sendMessage(
            @DestinationVariable String conversationId,
            @Payload ChatMessageDto chatMessageDto
    ) {
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(chatMessageDto.getSenderId());
        message.setSenderRole(chatMessageDto.getSenderRole());
        message.setContent(chatMessageDto.getContent());
        message.setType("TEXT");
        message.setCreatedAt(Instant.now());
        Message saved = messageRepository.save(message);
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                saved
        );
    }
}
