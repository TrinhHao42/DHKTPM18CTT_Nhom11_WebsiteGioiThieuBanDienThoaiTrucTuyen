package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.OrderDetail;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderResponse {
    Integer orderId;
    LocalDate orderDate;
    BigDecimal orderTotalAmount;

    OrderStatusInfo currentPaymentStatus;
    OrderStatusInfo currentShippingStatus;

    List<OrderStatusInfo> paymentStatusHistory;
    List<OrderStatusInfo> shippingStatusHistory;

    AddressResponse orderShippingAddress;
    OrderUserInfo orderUser;

    List<OrderDetailResponse> orderDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderUserInfo{
        private String userName;
        private String userEmail;
    }
}