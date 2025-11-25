package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.OrderShippingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderShippingStatusHistoryRepository extends JpaRepository<OrderShippingStatusHistory, Long> {
    
    @Query("SELECT h FROM OrderShippingStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.createdAt DESC")
    List<OrderShippingStatusHistory> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") int orderId);
}
