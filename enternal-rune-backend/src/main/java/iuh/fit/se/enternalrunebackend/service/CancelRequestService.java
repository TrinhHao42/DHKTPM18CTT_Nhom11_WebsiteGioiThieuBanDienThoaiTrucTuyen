package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.CancelRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CancelRequestService {
    
    CancelRequestResponse createCancelRequest(CancelRequestRequest request, Long userId);
    
    Page<CancelRequestResponse> getAllCancelRequests(Pageable pageable);
    
    Page<CancelRequestResponse> getCancelRequestsByStatus(RequestStatus status, Pageable pageable);
    
    CancelRequestResponse getCancelRequestById(Long id);
    
    CancelRequestResponse processCancelRequest(Long id, ProcessRequestRequest request, Long adminId);
    
    long countByStatus(RequestStatus status);
}
