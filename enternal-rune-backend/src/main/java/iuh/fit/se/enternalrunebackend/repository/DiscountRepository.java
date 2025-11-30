package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "discounts")
public interface DiscountRepository extends JpaRepository<Discount,Integer> {
    boolean existsByDiscountCode(String discountCode);
}
