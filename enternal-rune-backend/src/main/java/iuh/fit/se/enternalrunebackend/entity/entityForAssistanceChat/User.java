package iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String displayName; // tên hiển thị
    @Enumerated(EnumType.STRING)
    private Role role;        // CUSTOMER / AGENT / ADMIN
}
