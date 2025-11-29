package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.CancelRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import iuh.fit.se.enternalrunebackend.service.CancelRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cancel-requests")
@RequiredArgsConstructor
public class CancelRequestController {

    private final CancelRequestService cancelRequestService;

    /**
     * Tạo yêu cầu hủy đơn (cho user)
     * POST /cancel-requests
     */
    @PostMapping
    public ResponseEntity<?> createCancelRequest(
            @Valid @RequestBody CancelRequestRequest request,
            @RequestParam Long userId
    ) {
        try {
            CancelRequestResponse response = cancelRequestService.createCancelRequest(request, userId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Yêu cầu hủy đơn đã được gửi thành công!");
            result.put("data", response);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Lấy tất cả yêu cầu hủy đơn (cho admin)
     * GET /cancel-requests?page=0&size=10&status=PENDING
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getAllCancelRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CancelRequestResponse> cancelRequestsPage;
            
            if (status != null && !status.isEmpty()) {
                RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
                cancelRequestsPage = cancelRequestService.getCancelRequestsByStatus(requestStatus, pageable);
            } else {
                cancelRequestsPage = cancelRequestService.getAllCancelRequests(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", cancelRequestsPage.getContent());
            response.put("currentPage", cancelRequestsPage.getNumber());
            response.put("totalItems", cancelRequestsPage.getTotalElements());
            response.put("totalPages", cancelRequestsPage.getTotalPages());
            response.put("pageSize", cancelRequestsPage.getSize());
            response.put("hasNext", cancelRequestsPage.hasNext());
            response.put("hasPrevious", cancelRequestsPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách yêu cầu: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Lấy chi tiết yêu cầu hủy đơn
     * GET /cancel-requests/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getCancelRequestById(@PathVariable Long id) {
        try {
            CancelRequestResponse response = cancelRequestService.getCancelRequestById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Xử lý yêu cầu hủy đơn (chấp nhận hoặc từ chối)
     * PUT /cancel-requests/{id}/process
     */
    @PutMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> processCancelRequest(
            @PathVariable Long id,
            @Valid @RequestBody ProcessRequestRequest request,
            @RequestParam Long adminId
    ) {
        try {
            CancelRequestResponse response = cancelRequestService.processCancelRequest(id, request, adminId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Yêu cầu đã được xử lý thành công!");
            result.put("data", response);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Thống kê số lượng yêu cầu theo trạng thái
     * GET /cancel-requests/stats/count?status=PENDING
     */
    @GetMapping("/stats/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> countByStatus(@RequestParam String status) {
        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            long count = cancelRequestService.countByStatus(requestStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
