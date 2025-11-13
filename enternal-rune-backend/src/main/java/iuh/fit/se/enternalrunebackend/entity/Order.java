package iuh.fit.se.enternalrunebackend.entity;

import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "order_payment_status", nullable = false)
    PaymentStatus orderPaymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_shipping_status", nullable = false)
    ShippingStatus orderShippingStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderRefundRequest> orderRefundRequests = new ArrayList<>();

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
}
