package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.service.serviceClass.ChatFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatFileController {

    private final ChatFileService chatFileService;

    /**
     * Upload ảnh cho một conversation:
     * POST /api/chat/conversations/{conversationId}/image
     *
     * form-data:
     *  - file: (binary) ảnh
     *  - senderId: user id
     *  - senderRole: CUSTOMER / AGENT
     *  - caption: (optional)
     */
    @PostMapping("/conversations/{conversationId}/image")
    public ResponseEntity<Message> uploadImage(
            @PathVariable String conversationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") String senderId,
            @RequestParam("senderRole") Role senderRole,
            @RequestParam(value = "caption", required = false) String caption
    ) throws Exception {

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
