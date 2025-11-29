package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderStatusInfo {
    Long statusId;
    String statusCode;
    String statusName;
    String description;
    LocalDateTime createdAt;
    String note;

    public OrderStatusInfo(String statusCode, String statusName) {
        this.statusCode = statusCode;
        this.statusName = statusName;
    }
}

