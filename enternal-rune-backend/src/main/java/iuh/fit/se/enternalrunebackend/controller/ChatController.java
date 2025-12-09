package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
public class ChatController {

    private final ChatService chatService;
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ai/generate")
    public String generate(@RequestBody String message) {
        return chatService.processUserInput(message);
    }
}