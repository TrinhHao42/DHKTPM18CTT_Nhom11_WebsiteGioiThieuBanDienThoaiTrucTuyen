package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepository messageRepository;

    // Lấy lịch sử tin nhắn của conversation
    @GetMapping("/conversation/{conversationId}")
    public List<Message> getMessages(@PathVariable String conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    // Lấy chi tiết 1 tin nhắn
    @GetMapping("/{messageId}")
    public Message getMessage(@PathVariable String messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }
}
