package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Order List Response DTO
 * Used for displaying orders in a list/table view (simplified info)
 * Constructor for JPQL projection
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
    
    // Constructor for JPQL NEW projection
    // Note: JPQL subqueries return Long for aggregate functions
    public OrderListResponse(
        Integer orderId,
        LocalDate orderDate, 
        BigDecimal totalAmount,
        Long totalProducts,  // Changed to Long because JPQL SUM returns Long
        String userName,
        String userEmail,
        String paymentStatusCode,
        String paymentStatusName,
        String shippingStatusCode,
        String shippingStatusName
    ) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.totalProducts = totalProducts != null ? totalProducts.intValue() : 0;
        this.userName = userName;
        this.userEmail = userEmail;
        this.currentPaymentStatus = (paymentStatusCode != null) 
            ? new OrderStatusInfo(paymentStatusCode, paymentStatusName) 
            : null;
        this.currentShippingStatus = (shippingStatusCode != null)
            ? new OrderStatusInfo(shippingStatusCode, shippingStatusName)
            : null;
    }
}

