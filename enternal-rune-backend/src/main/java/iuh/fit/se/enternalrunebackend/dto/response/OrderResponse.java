package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.Image;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private PaymentStatus orderPaymentStatus;
    private ShippingStatus orderShippingStatus;
    private AddressResponse orderShippingAddress;
    private UserInfo orderUser;
    private List<OrderDetailInfo> orderDetails;

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