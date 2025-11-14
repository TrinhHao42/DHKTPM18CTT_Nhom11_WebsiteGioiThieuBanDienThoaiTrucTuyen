package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.ProductSpecifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProductSpecificationsRepository extends JpaRepository<ProductSpecifications, Integer> {

    @Query("""
            SELECT ps
            FROM ProductSpecifications ps
            WHERE ps.product.prodId IN :ids
            """)
    List<ProductSpecifications> findByProductIds(@Param("ids") Collection<Integer> productIds);
}

