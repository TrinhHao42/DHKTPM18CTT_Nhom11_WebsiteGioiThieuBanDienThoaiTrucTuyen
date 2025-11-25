package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    int orderId;

    @Column(name = "order_date", nullable = false)
    LocalDate orderDate = LocalDate.now();

    @Column(name = "order_total_amount", nullable = false)
    BigDecimal orderTotalAmount;

    // One-to-many relationships with history tables (tracking status changes with timestamps)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    List<OrderPaymentHistory> paymentStatusHistories = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    List<OrderShippingHistory> shippingStatusHistories = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderRefund> orderRefundRequests = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    Transaction transactions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderDetail> orderDetails = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    Address orderShippingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User orderUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discount_id")
    Discount discount;

    // Helper methods to get current status
    @Transient
    public PaymentStatus getCurrentPaymentStatus() {
        return paymentStatusHistories.isEmpty() ? null : paymentStatusHistories.getFirst().getPaymentStatus();
    }

    @Transient
    public ShippingStatus getCurrentShippingStatus() {
        return shippingStatusHistories.isEmpty() ? null : shippingStatusHistories.getFirst().getShippingStatus();
    }

    // Helper methods to add new status with timestamp
    public void addPaymentStatus(PaymentStatus status, String note) {
        OrderPaymentHistory history = OrderPaymentHistory.builder()
                .order(this)
                .paymentStatus(status)
                .note(note)
                .build();
        paymentStatusHistories.addFirst(history);
    }

    public void addShippingStatus(ShippingStatus status, String note) {
        OrderShippingHistory history = OrderShippingHistory.builder()
                .order(this)
                .shippingStatus(status)
                .note(note)
                .build();
        shippingStatusHistories.addFirst(history);
    }
}
