package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "product_variants")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_variant_id")
    Long prodvId;

    String prodvName;

    String prodvModel;

    String prodvVersion;

    String prodvColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    Product pvProduct;

    @ManyToOne
    @JoinColumn(name = "pp_price")
    ProductPrice prodvPrice;

    @ManyToOne
    @JoinColumn(name = "image_id")
    Image prodvImg;
}
