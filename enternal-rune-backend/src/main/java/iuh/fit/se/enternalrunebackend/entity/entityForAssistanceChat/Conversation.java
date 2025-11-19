package iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private String customerId; // id user khách
    private String agentId;    // id agent (có thể null khi chưa assign)

    private String status;     // PENDING / IN_PROGRESS / CLOSED

    private Instant createdAt;
    private Instant closedAt;
}
