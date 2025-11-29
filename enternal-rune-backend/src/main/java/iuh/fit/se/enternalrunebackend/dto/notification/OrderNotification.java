package iuh.fit.se.enternalrunebackend.dto.notification;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderNotification {
    private String type;
    private Long userId;
    private String userName;
    private String message;
    private LocalDateTime timestamp;
}
