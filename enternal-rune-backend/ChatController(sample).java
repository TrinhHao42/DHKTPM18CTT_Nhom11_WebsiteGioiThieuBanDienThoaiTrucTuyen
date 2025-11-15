package iuh.fit.se.nguyenphihung.controller;

import iuh.fit.se.nguyenphihung.service.ChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;
    @GetMapping
    public String chatPage() {
        return "chat";
    }

    @PostMapping
    @ResponseBody
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");

            if (userMessage == null || userMessage.isBlank()) {
                return Map.of("error", "Message must not be empty.");
            }

            String aiResponse = chatService.processUserInput(userMessage);
            return Map.of("response", aiResponse);

        } catch (Exception e) {
            return Map.of("error", "Đã có lỗi xảy ra: " + e.getMessage());
        }
    }
}
