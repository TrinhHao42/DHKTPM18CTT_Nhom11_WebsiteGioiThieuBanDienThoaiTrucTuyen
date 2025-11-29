package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.ReturnRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import iuh.fit.se.enternalrunebackend.service.ReturnRequestService;
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
@RequestMapping("/return-requests")
@RequiredArgsConstructor
public class ReturnRequestController {

    private final ReturnRequestService returnRequestService;

    /**
     * Tạo yêu cầu trả hàng (cho user)
     * POST /return-requests
     */
    @PostMapping
    public ResponseEntity<?> createReturnRequest(
            @Valid @RequestBody ReturnRequestRequest request,
            @RequestParam Long userId
    ) {
        try {
            ReturnRequestResponse response = returnRequestService.createReturnRequest(request, userId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Yêu cầu trả hàng đã được gửi thành công!");
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
     * Lấy tất cả yêu cầu trả hàng (cho admin)
     * GET /return-requests?page=0&size=10&status=PENDING
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getAllReturnRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ReturnRequestResponse> returnRequestsPage;
            
            if (status != null && !status.isEmpty()) {
                RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
                returnRequestsPage = returnRequestService.getReturnRequestsByStatus(requestStatus, pageable);
            } else {
                returnRequestsPage = returnRequestService.getAllReturnRequests(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", returnRequestsPage.getContent());
            response.put("currentPage", returnRequestsPage.getNumber());
            response.put("totalItems", returnRequestsPage.getTotalElements());
            response.put("totalPages", returnRequestsPage.getTotalPages());
            response.put("pageSize", returnRequestsPage.getSize());
            response.put("hasNext", returnRequestsPage.hasNext());
            response.put("hasPrevious", returnRequestsPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách yêu cầu: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Lấy chi tiết yêu cầu trả hàng
     * GET /return-requests/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getReturnRequestById(@PathVariable Long id) {
        try {
            ReturnRequestResponse response = returnRequestService.getReturnRequestById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Xử lý yêu cầu trả hàng (chấp nhận hoặc từ chối)
     * PUT /return-requests/{id}/process
     */
    @PutMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> processReturnRequest(
            @PathVariable Long id,
            @Valid @RequestBody ProcessRequestRequest request,
            @RequestParam Long adminId
    ) {
        try {
            ReturnRequestResponse response = returnRequestService.processReturnRequest(id, request, adminId);
            
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
     * GET /return-requests/stats/count?status=PENDING
     */
    @GetMapping("/stats/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> countByStatus(@RequestParam String status) {
        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            long count = returnRequestService.countByStatus(requestStatus);
            
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
