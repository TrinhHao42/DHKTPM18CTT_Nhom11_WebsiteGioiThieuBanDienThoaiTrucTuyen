package iuh.fit.se.enternalrunebackend.repository;

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
    
    Page<CancelRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<CancelRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status, Pageable pageable);
    
    @Query("SELECT cr FROM CancelRequest cr " +
           "LEFT JOIN FETCH cr.order o " +
           "LEFT JOIN FETCH cr.user u " +
           "WHERE cr.cancelRequestId = :id")
    Optional<CancelRequest> findByIdWithDetails(@Param("id") Long id);
    
    long countByStatus(RequestStatus status);
}
