package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.OrderPaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderPaymentHistoryRepository extends JpaRepository<OrderPaymentHistory, Long> {
    
    @Query("SELECT h FROM OrderPaymentHistory h WHERE h.order.orderId = :orderId ORDER BY h.createdAt DESC")
    List<OrderPaymentHistory> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") int orderId);
}
