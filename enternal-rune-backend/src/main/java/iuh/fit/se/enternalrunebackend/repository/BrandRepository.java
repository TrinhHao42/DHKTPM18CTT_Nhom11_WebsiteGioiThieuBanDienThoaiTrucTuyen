package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "brands")
public interface BrandRepository extends JpaRepository<Brand,Integer> {
    // Tổng danh mục
    @Query("SELECT COUNT(b) FROM Brand b")
    long countTotalBrands();
}
