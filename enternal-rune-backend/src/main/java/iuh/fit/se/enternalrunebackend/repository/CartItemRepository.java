package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Cart;
import iuh.fit.se.enternalrunebackend.entity.CartItem;
import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "cart-items")
public interface CartItemRepository extends JpaRepository<CartItem,Integer> {
    Optional<CartItem> findByCiCartAndCiProductVariant(Cart cart, ProductVariant product);
}
