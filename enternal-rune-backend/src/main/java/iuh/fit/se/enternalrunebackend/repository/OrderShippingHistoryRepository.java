package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.OrderShippingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderShippingHistoryRepository extends JpaRepository<OrderShippingHistory, Long> {
    
    @Query("SELECT h FROM OrderShippingHistory h WHERE h.order.orderId = :orderId ORDER BY h.createdAt DESC")
    List<OrderShippingHistory> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") int orderId);
}
