package iuh.fit.se.enternalrunebackend.repository;
import iuh.fit.se.enternalrunebackend.dto.response.OrderListResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> ,JpaSpecificationExecutor<Order>{

    /**
     * Optimized query to fetch single order with all details for detail view
     * Eliminates N+1 queries by fetching all relations in 2 queries (due to multiple collections)
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderShippingAddress " +
           "LEFT JOIN FETCH o.orderUser " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.odProductVariant pv " +
           "LEFT JOIN FETCH pv.prodvImg " +
           "LEFT JOIN FETCH pv.prodvPrice " +
           "LEFT JOIN FETCH pv.pvProduct " +
           "WHERE o.orderId = :orderId")
    Order findByIdWithOrderDetails(@Param("orderId") int orderId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.paymentStatusHistories psh " +
           "LEFT JOIN FETCH psh.paymentStatus " +
           "WHERE o.orderId = :orderId")
    Order findByIdWithPaymentHistory(@Param("orderId") int orderId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.shippingStatusHistories ssh " +
           "LEFT JOIN FETCH ssh.shippingStatus " +
           "WHERE o.orderId = :orderId")
    Order findByIdWithShippingHistory(@Param("orderId") int orderId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderShippingAddress " +
           "LEFT JOIN FETCH o.orderUser " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.odProductVariant pv " +
           "LEFT JOIN FETCH pv.prodvImg " +
           "LEFT JOIN FETCH pv.prodvPrice " +
           "WHERE o.orderUser.userId = :customerId " +
           "ORDER BY o.orderDate DESC, o.orderId DESC")
    Page<Order> findOrdersByCustomerIdWithDetails(@Param("customerId") Long customerId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderShippingAddress " +
           "LEFT JOIN FETCH o.orderUser " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.odProductVariant pv " +
           "LEFT JOIN FETCH pv.prodvImg " +
           "LEFT JOIN FETCH pv.prodvPrice " +
           "WHERE o.orderUser.userId = :customerId " +
           "AND EXISTS (SELECT 1 FROM OrderShippingHistory ssh " +
           "            JOIN ssh.shippingStatus ss " +
           "            WHERE ssh.order = o " +
           "            AND ss.statusCode = :shippingStatus " +
           "            AND ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o)) " +
           "ORDER BY o.orderDate DESC, o.orderId DESC")
    Page<Order> findOrdersByCustomerIdAndShippingStatusWithDetails(
        @Param("customerId") Long customerId, 
        @Param("shippingStatus") String shippingStatus, 
        Pageable pageable);
    
    /**
     * Optimized query to fetch orders with all necessary joins for admin list
     * Uses multiple queries with batch fetching to avoid Cartesian product
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderUser u " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "WHERE o IN :orders")
    List<Order> findOrdersWithDetails(@Param("orders") List<Order> orders);

    // Tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o")
    long countTotalOrders();

    // Đơn đang xử lý (trạng thái giao hàng hiện tại thuộc PROCESSING hoặc SHIPPED)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode IN ('PROCESSING', 'SHIPPED')")
    long countProcessingOrders();

    // Đơn hoàn thành (trạng thái giao hàng = DELIVERED hoặc RECEIVED)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode IN ('DELIVERED', 'RECEIVED')")
    long countCompletedOrders();

    /**
     * Kiểm tra user đã mua sản phẩm cụ thể hay chưa (đơn hàng đã thanh toán)
     * Sử dụng native query để tránh lỗi JPQL phức tạp
     */
    @Query(value = """
        SELECT COUNT(*) > 0
        FROM orders o
        INNER JOIN order_detail od ON o.order_id = od.order_id
        INNER JOIN product_variants pv ON od.product_variant_id = pv.product_variant_id
        INNER JOIN products p ON pv.product_id = p.prod_id
        INNER JOIN order_payment_history oph ON o.order_id = oph.order_id
        INNER JOIN payment_statuses ps ON oph.status_id = ps.status_id
        WHERE o.user_id = :userId
        AND p.prod_id = :productId
        AND ps.status_code = 'PAID'
        AND pv.product_id IS NOT NULL
        AND oph.created_at = (
            SELECT MAX(oph2.created_at)
            FROM order_payment_history oph2
            WHERE oph2.order_id = o.order_id
        )
        """, nativeQuery = true)
    boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Integer productId);

    /**
     * Lấy danh sách sản phẩm user đã mua (đơn hàng đã thanh toán)
     * Sử dụng native query để đảm bảo performance và tránh lỗi mapping
     */
    @Query(value = """
        SELECT DISTINCT p.product_id 
        FROM orders o
        INNER JOIN order_detail od ON o.order_id = od.order_id
        INNER JOIN product_variants pv ON od.product_variant_id = pv.product_variant_id  
        INNER JOIN products p ON pv.product_id = p.product_id
        INNER JOIN order_payment_history oph ON o.order_id = oph.order_id
        INNER JOIN payment_statuses ps ON oph.status_id = ps.status_id
        WHERE o.user_id = :userId 
        AND ps.status_code = 'PAID'
        AND oph.created_at = (
            SELECT MAX(oph2.created_at) 
            FROM order_payment_history oph2 
            WHERE oph2.order_id = o.order_id
        )
        """, nativeQuery = true)
    List<Integer> getPurchasedProductIdsByUser(@Param("userId") Long userId);

    /**
     * JPQL Version - Đã sửa lỗi mapping và syntax 
     * Version 1: Sử dụng JOIN trực tiếp (khuyến nghị)
     */
    @Query("""
        SELECT DISTINCT pv.pvProduct.prodId 
        FROM Order o 
        JOIN o.orderDetails od 
        JOIN od.odProductVariant pv 
        JOIN o.paymentStatusHistories psh
        WHERE o.orderUser.userId = :userId 
        AND psh.paymentStatus.statusCode = 'PAID'
        AND psh.createdAt = (
            SELECT MAX(psh2.createdAt) 
            FROM OrderPaymentHistory psh2 
            WHERE psh2.order.orderId = o.orderId
        )
        """)
    List<Integer> getPurchasedProductIdsByUserJPQL(@Param("userId") Long userId);

    /**
     * JPQL Version 2: Sử dụng subquery đơn giản hơn
     */
    @Query("""
        SELECT DISTINCT pv.pvProduct.prodId 
        FROM Order o 
        JOIN o.orderDetails od 
        JOIN od.odProductVariant pv 
        WHERE o.orderUser.userId = :userId 
        AND o.orderId IN (
            SELECT DISTINCT psh.order.orderId
            FROM OrderPaymentHistory psh
            WHERE psh.paymentStatus.statusCode = 'PAID'
            AND psh.createdAt = (
                SELECT MAX(psh2.createdAt) 
                FROM OrderPaymentHistory psh2 
                WHERE psh2.order.orderId = psh.order.orderId
            )
        )
        """)
    List<Integer> getPurchasedProductIdsByUserJPQLSimple(@Param("userId") Long userId);

    /**
     * JPQL Version 3: Sử dụng getCurrentPaymentStatus() method từ Entity
     */
    @Query("""
        SELECT DISTINCT pv.pvProduct.prodId 
        FROM Order o 
        JOIN o.orderDetails od 
        JOIN od.odProductVariant pv 
        WHERE o.orderUser.userId = :userId 
        AND SIZE(o.paymentStatusHistories) > 0
        """)
    List<Integer> getPurchasedProductIdsByUserSimple(@Param("userId") Long userId);

    // Doanh thu tháng hiện tại (chỉ tính đơn giao thành công ở trạng thái hiện tại)
    @Query("SELECT COALESCE(SUM(o.orderTotalAmount), 0) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode = 'DELIVERED' " +
           "AND EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    Double sumRevenueByMonth(@Param("year") int year, @Param("month") int month);

    // Số đơn hoàn tiền trong tháng (trạng thái thanh toán hiện tại = REFUNDED)
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.paymentStatusHistories psh " +
           "JOIN psh.paymentStatus ps " +
           "WHERE psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentHistory psh2 WHERE psh2.order = o) " +
           "AND ps.statusCode = 'REFUNDED' " +
           "AND EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    Integer countRefundsByMonth(@Param("year") int year, @Param("month") int month);

    Order getOrderByOrderId(int orderId);

    /**
     * Optimized query using DTO projection to avoid N+1
     * Directly select only needed fields into OrderListResponse
     */
    @Query("""
    SELECT new iuh.fit.se.enternalrunebackend.dto.response.OrderListResponse(
        o.orderId,
        o.orderDate,
        o.orderTotalAmount,
        (SELECT COALESCE(SUM(od.odQuantity), 0) FROM OrderDetail od WHERE od.order.orderId = o.orderId),
        u.name,
        u.email,
        (SELECT ps.statusCode FROM OrderPaymentHistory psh 
         JOIN psh.paymentStatus ps 
         WHERE psh.order.orderId = o.orderId 
         ORDER BY psh.createdAt DESC LIMIT 1),
        (SELECT ps.statusName FROM OrderPaymentHistory psh 
         JOIN psh.paymentStatus ps 
         WHERE psh.order.orderId = o.orderId 
         ORDER BY psh.createdAt DESC LIMIT 1),
        (SELECT ss.statusCode FROM OrderShippingHistory ssh 
         JOIN ssh.shippingStatus ss 
         WHERE ssh.order.orderId = o.orderId 
         ORDER BY ssh.createdAt DESC LIMIT 1),
        (SELECT ss.statusName FROM OrderShippingHistory ssh 
         JOIN ssh.shippingStatus ss 
         WHERE ssh.order.orderId = o.orderId 
         ORDER BY ssh.createdAt DESC LIMIT 1)
    )
    FROM Order o
    JOIN o.orderUser u
    WHERE (LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR :keyword IS NULL)
      AND (:paymentStatusCode IS NULL OR 
           EXISTS (SELECT 1 FROM OrderPaymentHistory psh2 
                   JOIN psh2.paymentStatus ps2 
                   WHERE psh2.order.orderId = o.orderId 
                   AND ps2.statusCode = :paymentStatusCode
                   AND psh2.createdAt = (SELECT MAX(psh3.createdAt) 
                                        FROM OrderPaymentHistory psh3 
                                        WHERE psh3.order.orderId = o.orderId)))
      AND (:shippingStatusCode IS NULL OR 
           EXISTS (SELECT 1 FROM OrderShippingHistory ssh2 
                   JOIN ssh2.shippingStatus ss2 
                   WHERE ssh2.order.orderId = o.orderId 
                   AND ss2.statusCode = :shippingStatusCode
                   AND ssh2.createdAt = (SELECT MAX(ssh3.createdAt) 
                                        FROM OrderShippingHistory ssh3 
                                        WHERE ssh3.order.orderId = o.orderId)))
    ORDER BY o.orderDate DESC, o.orderId DESC
    """)
    Page<OrderListResponse> searchOrdersWithDTO(
            @Param("keyword") String keyword,
            @Param("paymentStatusCode") String paymentStatusCode,
            @Param("shippingStatusCode") String shippingStatusCode,
            Pageable pageable
    );

    @Query("""
    SELECT DISTINCT o FROM Order o
    LEFT JOIN FETCH o.orderUser u
    LEFT JOIN FETCH o.orderDetails od
    LEFT JOIN FETCH od.odProductVariant pv
    LEFT JOIN FETCH pv.prodvPrice
    LEFT JOIN FETCH pv.prodvImg
    LEFT JOIN o.paymentStatusHistories psh
    LEFT JOIN psh.paymentStatus ps
    LEFT JOIN o.shippingStatusHistories ssh
    LEFT JOIN ssh.shippingStatus ss
    WHERE (LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR :keyword IS NULL)
      AND (:paymentStatusCode IS NULL OR 
           (ps.statusCode = :paymentStatusCode AND 
            psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentHistory psh2 WHERE psh2.order = o)))
      AND (:shippingStatusCode IS NULL OR 
           (ss.statusCode = :shippingStatusCode AND 
            ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o)))
    """)
    Page<Order> searchOrders(
            @Param("keyword") String keyword,
            @Param("paymentStatusCode") String paymentStatusCode,
            @Param("shippingStatusCode") String shippingStatusCode,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.orderTotalAmount), 0) FROM Order o " +
           "JOIN o.paymentStatusHistories psh " +
           "JOIN psh.paymentStatus ps " +
           "WHERE psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentHistory psh2 WHERE psh2.order = o) " +
           "AND ps.statusCode = 'PAID'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.shippingStatusHistories ssh " +
           "JOIN ssh.shippingStatus ss " +
           "WHERE ssh.createdAt = (SELECT MAX(ssh2.createdAt) FROM OrderShippingHistory ssh2 WHERE ssh2.order = o) " +
           "AND ss.statusCode = :statusCode")
    long countByCurrentShippingStatus(@Param("statusCode") String statusCode);

    List<Order> findByOrderUser_UserId(Long userId);
    
    // Dashboard queries
    @Query("SELECT COUNT(o) FROM Order o " +
           "WHERE EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    int countOrdersInMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT COALESCE(SUM(o.orderTotalAmount), 0) FROM Order o " +
           "JOIN o.paymentStatusHistories psh " +
           "JOIN psh.paymentStatus ps " +
           "WHERE psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentHistory psh2 WHERE psh2.order = o) " +
           "AND ps.statusCode IN ('PAID', 'COMPLETED') " +
           "AND EXTRACT(YEAR FROM o.orderDate) = :year " +
           "AND EXTRACT(MONTH FROM o.orderDate) = :month")
    BigDecimal getTotalRevenueInMonth(@Param("year") int year, @Param("month") int month);
    
    /**
     * OPTIMIZED: Get all monthly summaries in ONE query instead of 24+ queries
     * Returns: [month, revenue, orderCount] for each month in the year
     */
    @Query("SELECT EXTRACT(MONTH FROM o.orderDate) as month, " +
           "COALESCE(SUM(CASE WHEN ps.statusCode IN ('PAID', 'COMPLETED') THEN o.orderTotalAmount ELSE 0 END), 0) as revenue, " +
           "COUNT(o) as orderCount " +
           "FROM Order o " +
           "LEFT JOIN o.paymentStatusHistories psh ON psh.createdAt = (SELECT MAX(psh2.createdAt) FROM OrderPaymentHistory psh2 WHERE psh2.order = o) " +
           "LEFT JOIN psh.paymentStatus ps " +
           "WHERE EXTRACT(YEAR FROM o.orderDate) = :year " +
           "GROUP BY EXTRACT(MONTH FROM o.orderDate) " +
           "ORDER BY month")
    List<Object[]> getMonthlySummariesForYear(@Param("year") int year);
}

