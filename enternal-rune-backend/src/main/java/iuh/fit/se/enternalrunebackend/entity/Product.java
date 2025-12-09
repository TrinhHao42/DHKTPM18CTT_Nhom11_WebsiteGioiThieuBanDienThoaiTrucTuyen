package iuh.fit.se.enternalrunebackend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "products")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prod_id")
    Integer prodId;

    @Column(name = "product_name", nullable = false, length = 255)
    String prodName;

    @Column(name = "product_model", length = 255)
    String prodModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_status", nullable = false)
    ProductStatus productStatus;

    @ElementCollection
    @CollectionTable(name = "product_versions", joinColumns = @JoinColumn(name = "prod_id"))
    @Column(name = "version")
    List<String> prodVersion;

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "prod_id"))
    @Column(name = "color")
    List<String> prodColor;

    @Column(name = "product_description", columnDefinition = "TEXT")
    String prodDescription;

    @Column(name = "product_rating")
    double prodRating;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    Brand prodBrand;
    // ngày tạo sản phẩm
    @Column(name = "created_at")
    LocalDate createdAt = LocalDate.now();

//    @OneToMany(mappedBy = "ciProduct", cascade = CascadeType.ALL, orphanRemoval = true)
//    List<CartItem> cartItems;
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id")
    List<Image> images;

    @OneToMany(mappedBy = "cmProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id")
    List<ProductPrice> productPrices = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = true)
    ProductSpecifications productSpecifications;

//    @OneToMany(mappedBy = "odProduct", cascade = CascadeType.ALL, orphanRemoval = true)
//    List<OrderDetail> orderDetails = new ArrayList<>();
}
