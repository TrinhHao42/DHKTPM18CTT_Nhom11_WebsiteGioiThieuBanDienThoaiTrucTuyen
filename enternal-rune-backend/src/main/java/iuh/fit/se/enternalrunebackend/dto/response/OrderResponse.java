package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.Image;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private int orderId;
    private LocalDate orderDate;
    private BigDecimal orderTotalAmount;
    
    // Current status (for user frontend - backward compatible)
    private PaymentStatus orderPaymentStatus;
    private ShippingStatus orderShippingStatus;
    
    // Full status history (for admin)
    private List<StatusHistoryInfo> paymentStatusHistory;
    private List<StatusHistoryInfo> shippingStatusHistory;
    
    private AddressResponse orderShippingAddress;
    private UserInfo orderUser;
    private List<OrderDetailInfo> orderDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusHistoryInfo {
        private Long statusId;
        private String statusCode;
        private String statusName;
        private String description;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private long userId;
        private String userName;
        private String userEmail;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetailInfo {
        private int orderDetailId;
        private int quantity;
        private double totalPrice;
        private ProductVariantInfo productVariant;
        private double price;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductVariantInfo {
        private long variantId;
        private String variantName;
        private String variantModel;
        private String variantVersion;
        private String variantColor;
        private String imageUrl;
        private long productId;
        private String productName;
    }
}