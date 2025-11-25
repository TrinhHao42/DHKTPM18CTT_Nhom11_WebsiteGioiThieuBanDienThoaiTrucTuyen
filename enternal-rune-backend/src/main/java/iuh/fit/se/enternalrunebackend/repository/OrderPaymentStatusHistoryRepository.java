package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.OrderPaymentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderPaymentStatusHistoryRepository extends JpaRepository<OrderPaymentStatusHistory, Long> {
    
    @Query("SELECT h FROM OrderPaymentStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.createdAt DESC")
    List<OrderPaymentStatusHistory> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") int orderId);
}
