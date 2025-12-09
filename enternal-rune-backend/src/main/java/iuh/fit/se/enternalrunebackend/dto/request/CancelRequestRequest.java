package iuh.fit.se.enternalrunebackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CancelRequestRequest {
    
    @NotNull(message = "Order ID is required")
    Integer orderId;
    
    @NotBlank(message = "Reason is required")
    String reason;
}
