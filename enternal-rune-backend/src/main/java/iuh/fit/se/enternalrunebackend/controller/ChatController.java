package iuh.fit.se.enternalrunebackend.controller;

import com.nimbusds.openid.connect.sdk.Prompt;
import iuh.fit.se.enternalrunebackend.service.ChatService;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
public class ChatController {


    private final ChatService chatService;
@Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }


    @PostMapping("/ai/generate")
    public String generate(@RequestBody String message) {
        return chatService.processUserInput(message);
    }
}