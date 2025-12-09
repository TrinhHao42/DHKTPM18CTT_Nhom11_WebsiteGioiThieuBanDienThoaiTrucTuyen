package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderDetailResponse {
    Integer orderId;
    Integer quantity;
    Double totalPrice;
    ProductVariantResponse productVariantResponse;
}

