package iuh.fit.se.enternalrunebackend.service.serviceClass;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatFileService {

    private final Cloudinary cloudinary;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Message uploadImageAndBroadcast(
            String conversationId,
            String senderId,
            Role senderRole,
            String caption,
            MultipartFile file
    ) throws IOException {

        // 1. Upload file lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
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
