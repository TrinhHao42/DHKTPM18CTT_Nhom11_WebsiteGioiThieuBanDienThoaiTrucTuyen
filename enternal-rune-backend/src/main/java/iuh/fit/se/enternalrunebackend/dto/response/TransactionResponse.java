package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    int transId;
    String transactionCode; // Same as transactionId
    int orderId;
    String orderInvoiceNumber;
    String customerName;
    String customerEmail;
    BigDecimal amount;
    String paymentMethod;
    String status;
    LocalDateTime createdAt;
    LocalDateTime completedAt;
    String gatewayRef; // webhookId
    BigDecimal gatewayFee;
    BigDecimal netAmount;
    boolean reconciled;
    
    // Card info if available
    String cardNumber;
    String cardHolderName;
    String cardBrand;
}