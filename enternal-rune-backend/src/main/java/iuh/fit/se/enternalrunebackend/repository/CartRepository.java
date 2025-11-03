package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Cart;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path="carts")
public interface CartRepository extends JpaRepository<Cart,Integer> {

    Optional<Cart> findByCartUser(User user);
    Optional<Cart> findByCartUser_UserId(Long userId);
}
