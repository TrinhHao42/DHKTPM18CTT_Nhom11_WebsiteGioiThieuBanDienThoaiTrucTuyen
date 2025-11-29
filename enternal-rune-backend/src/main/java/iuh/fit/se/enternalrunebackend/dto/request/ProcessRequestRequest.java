package iuh.fit.se.enternalrunebackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcessRequestRequest {
    
    @NotBlank(message = "Action is required (APPROVE or REJECT)")
    String action;
    
    String adminNote;
}
