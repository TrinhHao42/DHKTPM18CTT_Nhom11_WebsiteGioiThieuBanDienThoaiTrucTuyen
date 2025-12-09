package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Map;

@RepositoryRestResource(path = "transactions")
public interface TransactionRepository extends JpaRepository<Transaction,Integer> {
    
    /**
     * Optimized query with JOIN FETCH to avoid N+1 problem
     * Load all related entities (order, user) in one query
     */
    @Query("SELECT DISTINCT t FROM Transaction t " +
           "LEFT JOIN FETCH t.order o " +
           "LEFT JOIN FETCH o.orderUser u " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findAllWithOrderAndUser();
    
    @Query("SELECT DISTINCT t FROM Transaction t " +
           "LEFT JOIN FETCH t.order o " +
           "LEFT JOIN FETCH o.orderUser u " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findAllWithOrderAndUser(Pageable pageable);
    
    /**
     * ULTRA OPTIMIZED: Get ALL payment metrics in ONE single database query
     * Database calculates everything, returns scalar values
     * Result: [totalTransactions, totalRevenue, paidOrders, pendingOrders]
     */
    @Query(value = """
        SELECT 
            (SELECT COUNT(*) FROM transactions) as total_transactions,
            (SELECT COALESCE(SUM(transaction_amount), 0) 
             FROM transactions 
             WHERE LOWER(transaction_status) IN ('success', 'completed')) as total_revenue,
            (SELECT COUNT(DISTINCT o.order_id)
             FROM orders o
             INNER JOIN order_payment_history oph ON o.order_id = oph.order_id
             INNER JOIN payment_statuses ps ON oph.status_id = ps.status_id
             WHERE ps.status_code = 'PAID'
             AND oph.created_at = (SELECT MAX(oph2.created_at) FROM order_payment_history oph2 WHERE oph2.order_id = o.order_id)) as paid_orders,
            (SELECT COUNT(DISTINCT o.order_id)
             FROM orders o
             INNER JOIN order_payment_history oph ON o.order_id = oph.order_id
             INNER JOIN payment_statuses ps ON oph.status_id = ps.status_id
             WHERE ps.status_code = 'PENDING'
             AND oph.created_at = (SELECT MAX(oph2.created_at) FROM order_payment_history oph2 WHERE oph2.order_id = o.order_id)) as pending_orders
        """, nativeQuery = true)
    Map<String, Object> getPaymentMetricsInOneQuery();
}
