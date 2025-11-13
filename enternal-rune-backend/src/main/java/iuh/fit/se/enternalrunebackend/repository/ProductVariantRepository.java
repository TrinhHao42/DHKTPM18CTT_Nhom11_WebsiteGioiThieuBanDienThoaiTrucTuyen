package iuh.fit.se.enternalrunebackend.repository;
import iuh.fit.se.enternalrunebackend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="product-variants")
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}
