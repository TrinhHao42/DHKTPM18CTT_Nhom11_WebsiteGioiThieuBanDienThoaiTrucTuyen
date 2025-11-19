package iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);
}
