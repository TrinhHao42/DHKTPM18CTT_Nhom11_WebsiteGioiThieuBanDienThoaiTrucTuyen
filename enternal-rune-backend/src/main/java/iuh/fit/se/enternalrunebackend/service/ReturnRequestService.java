package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.ReturnRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReturnRequestService {
    
    ReturnRequestResponse createReturnRequest(ReturnRequestRequest request, Long userId);
    
    Page<ReturnRequestResponse> getAllReturnRequests(Pageable pageable);
    
    Page<ReturnRequestResponse> getReturnRequestsByStatus(RequestStatus status, Pageable pageable);
    
    ReturnRequestResponse getReturnRequestById(Long id);
    
    ReturnRequestResponse processReturnRequest(Long id, ProcessRequestRequest request, Long adminId);
    
    long countByStatus(RequestStatus status);
}
