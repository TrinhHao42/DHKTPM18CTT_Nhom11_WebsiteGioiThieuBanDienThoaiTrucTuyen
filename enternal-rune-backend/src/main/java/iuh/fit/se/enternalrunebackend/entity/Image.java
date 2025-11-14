package iuh.fit.se.enternalrunebackend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name="images")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Image {
    @Id
    @Column(name = "image_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer imageId;
    @Column(name = "image_name")
    String imageName;
    @Column(name="image_data",columnDefinition = "TEXT")
//    @Lob
    String imageData;
//    @ManyToOne
//    @JoinColumn(name = "product_id",nullable = false)
//    Product product;
}
