package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="order_detail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="od_id")
    int odId;
    @Column(name = "quantity")
    int odQuantity;
    @Column(name = "total_price")
     double odTotalPrice;
    @ManyToOne
    @JoinColumn(name = "pp_id", nullable = false)
    ProductPrice odPrice;
    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false)
    ProductVariant odProductVariant;
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    Order order;
}
