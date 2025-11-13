package iuh.fit.se.enternalrunebackend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_items")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    int ciId;
    @Column(name = "cart_item_quantity")
    long ciQuantity;
    //relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="cart_id",nullable = false)
    @JsonBackReference
    Cart ciCart;
    @ManyToOne
    @JoinColumn(name="product_variant_id")
    ProductVariant ciProductVariant;
}
