package iuh.fit.se.enternalrunebackend.dto.assistanceChat;

import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import lombok.Data;

@Data
public class ChatMessageDto {

    private String conversationId;
    private String senderId;
    private Role senderRole;  // CUSTOMER / AGENT
    private String content;
}
