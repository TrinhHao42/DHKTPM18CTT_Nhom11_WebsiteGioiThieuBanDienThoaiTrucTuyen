package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name="notifications")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long notiId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User notiUser;

    String notiType; // ORDER, CANCEL_REQUEST, RETURN_REQUEST, etc.

    String notiUserName; // User name who triggered the notification

    String notiMessage;

    String targetRole; // ADMIN or USER - who should receive this notification

    LocalDateTime notiTime;

    @Builder.Default
    Boolean notiIsRead = false;
}
