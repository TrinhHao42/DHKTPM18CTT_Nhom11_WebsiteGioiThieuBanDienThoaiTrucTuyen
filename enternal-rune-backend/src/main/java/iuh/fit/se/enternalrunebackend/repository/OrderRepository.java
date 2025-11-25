package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Order;
<<<<<<< Updated upstream
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
=======
>>>>>>> Stashed changes
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

    // Note: updateOrderStatusByID removed - use service layer to add status to history

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

<<<<<<< Updated upstream
//    ==========================SUMMARY========================
=======
    // ==========================SUMMARY========================
>>>>>>> Stashed changes
    // Tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o")
    long countTotalOrders();

    // Tổng số đơn hoàn thành (trạng thái giao hàng hiện tại = DELIVERED)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingStatusHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode = 'DELIVERED'")
    long countCompletedOrders();

    // Đơn đang xử lý (trạng thái giao hàng hiện tại thuộc PENDING hoặc PROCESSING)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingStatusHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode IN ('PENDING', 'PROCESSING')")
    long countProcessingOrders();

    // Doanh thu tháng hiện tại (chỉ tính đơn giao thành công ở trạng thái hiện tại)
    @Query("SELECT COALESCE(SUM(o.orderTotalAmount), 0) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingStatusHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode = 'DELIVERED' " +
           "AND EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    Double sumRevenueByMonth(@Param("year") int year, @Param("month") int month);

    // Số đơn hoàn tiền trong tháng (trạng thái thanh toán hiện tại = REFUNDED)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.paymentStatusHistories psh " +
           "JOIN psh.paymentStatus ps " +
           "WHERE psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentStatusHistory psh2 WHERE psh2.order = o) " +
           "AND ps.statusCode = 'REFUNDED' " +
           "AND EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    Integer countRefundsByMonth(@Param("year") int year, @Param("month") int month);

    Order getOrderByOrderId(int orderId);

    @Query("""
    SELECT o FROM Order o
    WHERE (LOWER(o.orderUser.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(o.orderUser.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR :keyword IS NULL)
      AND (o.orderPaymentStatus = :paymentStatus OR :paymentStatus IS NULL)
      AND (o.orderShippingStatus = :shippingStatus OR :shippingStatus IS NULL)
    """)
    Page<Order> searchOrders(
            @Param("keyword") String keyword,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("shippingStatus") ShippingStatus shippingStatus,
            Pageable pageable
    );

    @Query("SELECT SUM(o.orderTotalAmount) FROM Order o WHERE o.orderPaymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
    long countByOrderShippingStatus(ShippingStatus status);

}
