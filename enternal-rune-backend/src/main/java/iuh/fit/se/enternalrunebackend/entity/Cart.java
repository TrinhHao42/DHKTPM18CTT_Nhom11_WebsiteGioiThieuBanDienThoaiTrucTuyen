package iuh.fit.se.enternalrunebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name="carts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private int cartId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User cartUser;

    @OneToMany(mappedBy = "ciCart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<CartItem> items = new ArrayList<>();

    public void addItem(CartItem item) {
        if (!items.contains(item)) {
            items.add(item);
            item.setCiCart(this);
        }
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCiCart(null);
    }
}

