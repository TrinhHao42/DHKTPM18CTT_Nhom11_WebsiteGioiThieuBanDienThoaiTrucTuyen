package iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByCustomerId(String customerId);

    List<Conversation> findByAgentId(String agentId);
}
