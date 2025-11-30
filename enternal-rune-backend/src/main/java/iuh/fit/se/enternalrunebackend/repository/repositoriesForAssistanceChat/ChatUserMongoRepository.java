package iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat;

import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatUserMongoRepository extends MongoRepository<User, String> {
    Optional<User> findById(String id);
}
