package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "product-variants")
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query("""
                SELECT pv FROM ProductVariant pv
                WHERE (:color IS NULL OR pv.prodvColor = :color)
                  AND (:version IS NULL OR pv.prodvVersion = :version)
                  AND (:storage IS NULL OR pv.prodvModel = :storage)
            """)
    Optional<ProductVariant> findByProductAndOptions(
            @Param("color") String color,
            @Param("version") String version,
            @Param("storage") String storage
    );
}
