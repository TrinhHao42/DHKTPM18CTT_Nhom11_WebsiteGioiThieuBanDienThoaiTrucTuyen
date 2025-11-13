package iuh.fit.se.enternalrunebackend.entity;

import iuh.fit.se.enternalrunebackend.entity.enums.PriceStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="product_price")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="pp_id")
    int ppId;
    @Column(name = "pp_price")
    double ppPrice;
    @Enumerated(EnumType.STRING)
    @Column(name="pp_price_status")
    PriceStatus ppPriceStatus;
    @Column(name = "pp_start_date")
    LocalDate ppStartDate;
    @Column(name="pp_end_date")
    LocalDate ppEndDate;
    //relationship
//    @ManyToOne
//    @JoinColumn(name="product_id",nullable = false)
//    Product ppProduct;
    @ManyToOne
    @JoinColumn(name="discount_id")
    Discount discount;
//    @OneToMany(mappedBy = "odPrice", cascade = CascadeType.ALL)
//    List<OrderDetail> orderDetails = new ArrayList<>();

}