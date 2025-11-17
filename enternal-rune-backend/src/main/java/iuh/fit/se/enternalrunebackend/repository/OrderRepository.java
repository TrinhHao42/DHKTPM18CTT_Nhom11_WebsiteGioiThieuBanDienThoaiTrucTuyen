package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.math.BigDecimal;
import java.util.List;

@RepositoryRestResource(path = "orders")
public interface OrderRepository extends JpaRepository<Order,Integer> ,JpaSpecificationExecutor<Order>{

    @Transactional
    @Modifying
    @Query("UPDATE Order o SET o.orderPaymentStatus = :status WHERE o.orderId = :id and o.orderPaymentStatus = :preStatus")
    int updateOrderStatusByID(@Param("id") Integer id, @Param("status") PaymentStatus status, @Param("preStatus")  PaymentStatus preStatus);

    @Query("SELECT o FROM Order o WHERE o.orderUser.userId = :customerId")
    List<Order> findOrdersByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderShippingAddress " +
           "LEFT JOIN FETCH o.orderUser " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.odProductVariant pv " +
           "LEFT JOIN FETCH pv.prodvImg " +
           "LEFT JOIN FETCH pv.prodvProduct " +
           "LEFT JOIN FETCH pv.prodvPrice " +
           "WHERE o.orderUser.userId = :customerId " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersByCustomerIdWithDetails(@Param("customerId") Long customerId, Pageable pageable);

//    ==========================SUMMARY========================
// Tổng số đơn hàng
@Query("SELECT COUNT(o) FROM Order o")
long countTotalOrders();

    // Tổng số đơn hoàn thành
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderShippingStatus = 'DELIVERED'")
    long countCompletedOrders();

    // Đơn đang xử lý (PENDING hoặc PROCESSING)
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.orderShippingStatus = 'PENDING'
           OR o.orderShippingStatus = 'PROCESSING'
    """)
    long countProcessingOrders();

    // Doanh thu tháng hiện tại (chỉ tính đơn giao thành công)
    @Query("""
        SELECT COALESCE(SUM(o.orderTotalAmount), 0)
        FROM Order o
        WHERE o.orderShippingStatus = 'DELIVERED'
          AND EXTRACT(YEAR FROM o.orderDate) = :year
          AND EXTRACT(MONTH FROM o.orderDate) = :month
    """)
    Double sumRevenueByMonth(@Param("year") int year, @Param("month") int month);

    // Số đơn hoàn tiền trong tháng
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.orderShippingStatus = 'REFUNDED'
          AND EXTRACT(YEAR FROM o.orderDate) = :year
          AND EXTRACT(MONTH FROM o.orderDate) = :month
    """)
    Integer countRefundsByMonth(@Param("year") int year, @Param("month") int month);

    @Transactional
    @Query("SELECT o.orderPaymentStatus FROM Order o WHERE o.orderId = :id")
    PaymentStatus getOrderPaymentStatus(@Param("id") int orderId);

    Order getOrderByOrderId(int orderId);
}
