package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.ShippingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingStatusRepository extends JpaRepository<ShippingStatus, Long> {
    
    Optional<ShippingStatus> findByStatusCode(String statusCode);
}
