package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.CancelRequest;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CancelRequestRepository extends JpaRepository<CancelRequest, Long> {
    
    @Query("SELECT DISTINCT cr FROM CancelRequest cr " +
           "LEFT JOIN FETCH cr.order o " +
           "LEFT JOIN FETCH o.orderUser ou " +
           "LEFT JOIN FETCH cr.user u " +
           "ORDER BY cr.createdAt DESC")
    Page<CancelRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT DISTINCT cr FROM CancelRequest cr " +
           "LEFT JOIN FETCH cr.order o " +
           "LEFT JOIN FETCH o.orderUser ou " +
           "LEFT JOIN FETCH cr.user u " +
           "WHERE cr.status = :status " +
           "ORDER BY cr.createdAt DESC")
    Page<CancelRequest> findByStatusOrderByCreatedAtDesc(@Param("status") RequestStatus status, Pageable pageable);
    
    @Query("SELECT cr FROM CancelRequest cr " +
           "LEFT JOIN FETCH cr.order o " +
           "LEFT JOIN FETCH cr.user u " +
           "WHERE cr.cancelRequestId = :id")
    Optional<CancelRequest> findByIdWithDetails(@Param("id") Long id);
    
    
    long countByStatus(RequestStatus status);
    
    // Kiểm tra đơn hàng có pending cancel request không
    boolean existsByOrder_OrderIdAndStatus(int orderId, RequestStatus status);
    
    /**
     * OPTIMIZED: DTO projection - only select needed fields
     * Avoids loading full Order entity and its collections
     */
    @Query("SELECT new iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse(" +
           "cr.cancelRequestId, cr.order.orderId, cr.user.userId, cr.user.name, cr.user.email, " +
           "cr.reason, cr.status, cr.adminNote, cr.createdAt, cr.updatedAt, cr.processedBy) " +
           "FROM CancelRequest cr JOIN cr.order o JOIN cr.user u ORDER BY cr.createdAt DESC")
    Page<CancelRequestResponse> findAllWithDTO(Pageable pageable);
    
    @Query("SELECT new iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse(" +
           "cr.cancelRequestId, cr.order.orderId, cr.user.userId, cr.user.name, cr.user.email, " +
           "cr.reason, cr.status, cr.adminNote, cr.createdAt, cr.updatedAt, cr.processedBy) " +
           "FROM CancelRequest cr JOIN cr.order o JOIN cr.user u WHERE cr.status = :status ORDER BY cr.createdAt DESC")
    Page<CancelRequestResponse> findByStatusWithDTO(@Param("status") RequestStatus status, Pageable pageable);
}

