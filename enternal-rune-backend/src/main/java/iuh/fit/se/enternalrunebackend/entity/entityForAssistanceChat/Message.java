package iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String conversationId;

    private String senderId;    // id user gửi
    @Enumerated(EnumType.STRING)
    private Role senderRole;  // CUSTOMER / AGENT / BOT
    private String content;     // nội dung text

    private String type;        // TEXT / IMAGE

    private Instant createdAt;
}
