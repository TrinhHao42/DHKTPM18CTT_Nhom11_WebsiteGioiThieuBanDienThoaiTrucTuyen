package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Order List Response DTO
 * Used for displaying orders in a list/table view (simplified info)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListResponse {
    private Integer orderId;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private Integer totalProducts;
    private String userName;
    private String userEmail;

    private OrderStatusInfo currentPaymentStatus;
    private OrderStatusInfo currentShippingStatus;
}

