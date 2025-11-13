package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @Column(name = "trans_gateway", nullable = false)
    String transGateway;

    @Column(name = "trans_date", nullable = false)
    LocalDate transDate;

    @Column(name = "trans_account_number", nullable = false, length = 50)
    String transAccountNumber;

    @Column(name = "trans_amount_in", nullable = false)
    BigDecimal transAmountIn;

    @Column(name = "trans_amount_out", nullable = false)
    BigDecimal transAmountOut;

    @Column(name = "trans_reference_number")
    String transReferenceNumber;

    @Column(name = "trans_body", length = 255)
    String transBody;

    @Column(name = "trans_content", length = 255)
    String transContent;

    @Column(name = "trans_created_at", nullable = false)
    LocalDate transCreatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
     User transUser;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    Order order;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_refund_request_id")
    OrderRefundRequest orderRefundRequest;
}

