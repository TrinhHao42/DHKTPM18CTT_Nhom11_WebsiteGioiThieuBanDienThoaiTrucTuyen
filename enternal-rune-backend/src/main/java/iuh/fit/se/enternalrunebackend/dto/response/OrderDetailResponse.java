package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailResponse {
    private int orderId;
    private String userName;
    private String userEmail;
    private PaymentStatus paymentStatus;
    private ShippingStatus shippingStatus;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private List<ProductDetail> products;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class ProductDetail {
        private Long variantId;
        private String name;
        private String model;
        private String version;
        private String color;
        private double price;
        private String imageUrl;
        private int quantity;
    }
}

