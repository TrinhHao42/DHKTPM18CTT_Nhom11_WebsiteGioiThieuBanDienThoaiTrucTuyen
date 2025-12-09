package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trans_id")
    int transId;

    // Webhook fields
    @Column(name = "webhook_id", length = 100)
    String webhookId; // id từ transaction object

    @Column(name = "payment_method", nullable = false, length = 50)
    String paymentMethod;

    @Column(name = "transaction_id", nullable = false, length = 100)
    String transactionId;

    @Column(name = "transaction_type", length = 50)
    String transactionType;

    @Column(name = "transaction_date")
    LocalDateTime transactionDate;

    @Column(name = "transaction_status", length = 50)
    String transactionStatus;

    @Column(name = "transaction_amount", nullable = false)
    BigDecimal transactionAmount;

    @Column(name = "transaction_currency", length = 10)
    String transactionCurrency;

    @Column(name = "authentication_status", length = 100)
    String authenticationStatus;

    // Additional webhook info
    @Column(name = "timestamp")
    Long timestamp;

    @Column(name = "notification_type", length = 50)
    String notificationType;

    @Column(name = "order_status", length = 50)
    String orderStatus;

    @Column(name = "order_invoice_number", length = 100)
    String orderInvoiceNumber;

    // Card information (nullable)
    @Column(name = "card_number", length = 50)
    String cardNumber;

    @Column(name = "card_holder_name", length = 100)
    String cardHolderName;

    @Column(name = "card_expiry", length = 20)
    String cardExpiry;

    @Column(name = "card_funding_method", length = 50)
    String cardFundingMethod;

    @Column(name = "card_brand", length = 50)
    String cardBrand;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User transUser;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true)
    Order order;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_refund_request_id")
    OrderRefund orderRefundRequest;
}

