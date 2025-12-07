package iuh.fit.se.enternalrunebackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Service
public class ChatFileService {

    private final Cloudinary cloudinaryForAssistanceChat;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Constructor injection với @Qualifier để chỉ định bean cụ thể
    public ChatFileService(
            @Qualifier("cloudinaryForAssistanceChat") Cloudinary cloudinaryForAssistanceChat,
            MessageRepository messageRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.cloudinaryForAssistanceChat = cloudinaryForAssistanceChat;
        this.messageRepository = messageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Message uploadImageAndBroadcast(
            String conversationId,
            String senderId,
            Role senderRole,
            String caption,
            MultipartFile file
    ) throws IOException {

        // 1. Upload file lên Cloudinary (sử dụng cloudinary riêng cho assistance chat)
        Map uploadResult = cloudinaryForAssistanceChat.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "chat-images/" + conversationId,
                        "resource_type", "image"
                )
        );

        String imageUrl = (String) uploadResult.get("secure_url");

        // 2. Tạo Message kiểu IMAGE
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setSenderRole(senderRole);
        message.setContent(caption); // có thể null nếu không có caption
        message.setType("IMAGE");
        message.setFileUrl(imageUrl);
        message.setCreatedAt(Instant.now());

        Message saved = messageRepository.save(message);

        // 3. Broadcast qua WebSocket
        String destination = "/topic/conversations/" + conversationId;
        messagingTemplate.convertAndSend(destination, saved);

        return saved;
    }
}
