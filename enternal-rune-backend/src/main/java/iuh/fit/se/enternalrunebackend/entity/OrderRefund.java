package iuh.fit.se.enternalrunebackend.entity;

import iuh.fit.se.enternalrunebackend.entity.enums.OrderRefundStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.OrderRefundType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_refund_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRefund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "or_id")
    int orId;

    @Enumerated(EnumType.STRING)
    @Column(name = "or_type", nullable = false)
    OrderRefundType orType;

    @Column(name = "or_reason", length = 255)
    String orReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "or_status", nullable = false)
    OrderRefundStatus orStatus;

    @Column(name = "or_create_date", nullable = false)
    LocalDate orCreateDate;

    @Column(name = "or_refund_amount")
    double orRefundAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @OneToMany(mappedBy = "orderRefund", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    List<OrderRefundPaymentHistory> refundPaymentStatusHistories = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User orHandleBy;

    @OneToOne(mappedBy = "orderRefundRequest", cascade = CascadeType.ALL)
    Transaction refundTransaction;

    // Helper methods to get current payment status
    @Transient
    public PaymentStatus getCurrentPaymentStatus() {
        return refundPaymentStatusHistories.isEmpty() ? null : refundPaymentStatusHistories.getFirst().getPaymentStatus();
    }

    // Helper method to add new payment status with timestamp
    public void addPaymentStatus(PaymentStatus status, String note) {
        OrderRefundPaymentHistory history = OrderRefundPaymentHistory.builder()
                .orderRefund(this)
                .paymentStatus(status)
                .note(note)
                .build();
        refundPaymentStatusHistories.addFirst(history);
    }
}

