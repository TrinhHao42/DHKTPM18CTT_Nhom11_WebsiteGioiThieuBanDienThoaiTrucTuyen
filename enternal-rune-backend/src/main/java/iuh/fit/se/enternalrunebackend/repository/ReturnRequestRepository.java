package iuh.fit.se.enternalrunebackend.repository;

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
    
    Page<ReturnRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<ReturnRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status, Pageable pageable);
    
    @Query("SELECT rr FROM ReturnRequest rr " +
           "LEFT JOIN FETCH rr.order o " +
           "LEFT JOIN FETCH rr.user u " +
           "WHERE rr.returnRequestId = :id")
    Optional<ReturnRequest> findByIdWithDetails(@Param("id") Long id);
    
    long countByStatus(RequestStatus status);
    
    // Kiểm tra đơn hàng có pending return request không
    boolean existsByOrder_OrderIdAndStatus(int orderId, RequestStatus status);
}
