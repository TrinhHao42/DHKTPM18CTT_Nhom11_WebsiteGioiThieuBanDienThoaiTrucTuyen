package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnRequestResponse {
    
    Long returnRequestId;
    Integer orderId;
    Long userId;
    String userName;
    String userEmail;
    String reason;
    String imageUrl;
    RequestStatus status;
    String adminNote;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long processedBy;
    
    // Order details
    OrderSummary orderSummary;
    
    @Data
    @Builder
    public static class OrderSummary {
        Integer orderId;
        String orderDate;
        Double totalAmount;
        String paymentStatus;
        String shippingStatus;
        List<OrderItemSummary> items;
    }
    
    @Data
    @Builder
    public static class OrderItemSummary {
        String productName;
        String variantName;
        Integer quantity;
        Double price;
    }
}
