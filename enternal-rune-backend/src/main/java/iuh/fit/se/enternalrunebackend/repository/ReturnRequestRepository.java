package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.ReturnRequest;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    
    @Query("SELECT DISTINCT rr FROM ReturnRequest rr " +
           "LEFT JOIN FETCH rr.order o " +
           "LEFT JOIN FETCH o.orderUser ou " +
           "LEFT JOIN FETCH rr.user u " +
           "ORDER BY rr.createdAt DESC")
    Page<ReturnRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT DISTINCT rr FROM ReturnRequest rr " +
           "LEFT JOIN FETCH rr.order o " +
           "LEFT JOIN FETCH o.orderUser ou " +
           "LEFT JOIN FETCH rr.user u " +
           "WHERE rr.status = :status " +
           "ORDER BY rr.createdAt DESC")
    Page<ReturnRequest> findByStatusOrderByCreatedAtDesc(@Param("status") RequestStatus status, Pageable pageable);
    
    @Query("SELECT rr FROM ReturnRequest rr " +
           "LEFT JOIN FETCH rr.order o " +
           "LEFT JOIN FETCH rr.user u " +
           "WHERE rr.returnRequestId = :id")
    Optional<ReturnRequest> findByIdWithDetails(@Param("id") Long id);
    
    
    long countByStatus(RequestStatus status);
    
    // Kiểm tra đơn hàng có pending return request không
    boolean existsByOrder_OrderIdAndStatus(int orderId, RequestStatus status);
    
    /**
     * OPTIMIZED: DTO projection - only select needed fields
     * Avoids loading full Order entity and its collections
     */
    @Query("SELECT new iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse(" +
           "rr.returnRequestId, rr.order.orderId, rr.user.userId, rr.user.name, rr.user.email, " +
           "rr.reason, rr.imageUrl, rr.status, rr.adminNote, rr.createdAt, rr.updatedAt, rr.processedBy) " +
           "FROM ReturnRequest rr JOIN rr.order o JOIN rr.user u ORDER BY rr.createdAt DESC")
    Page<ReturnRequestResponse> findAllWithDTO(Pageable pageable);
    
    @Query("SELECT new iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse(" +
           "rr.returnRequestId, rr.order.orderId, rr.user.userId, rr.user.name, rr.user.email, " +
           "rr.reason, rr.imageUrl, rr.status, rr.adminNote, rr.createdAt, rr.updatedAt, rr.processedBy) " +
           "FROM ReturnRequest rr JOIN rr.order o JOIN rr.user u WHERE rr.status = :status ORDER BY rr.createdAt DESC")
    Page<ReturnRequestResponse> findByStatusWithDTO(@Param("status") RequestStatus status, Pageable pageable);
}

