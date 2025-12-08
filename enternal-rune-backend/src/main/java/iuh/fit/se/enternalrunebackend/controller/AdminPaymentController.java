package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.PaymentMetricsResponse;
import iuh.fit.se.enternalrunebackend.dto.response.TransactionResponse;
import iuh.fit.se.enternalrunebackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * Lấy metrics tổng quan về payment
     * GET /api/admin/payments/metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<?> getPaymentMetrics() {
        try {
            PaymentMetricsResponse metrics = paymentService.getPaymentMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy thống kê payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Lấy danh sách giao dịch với phân trang và lọc
     * GET /api/admin/payments/transactions?page=0&size=10&status=&method=&search=
     */
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<TransactionResponse> transactionsPage = paymentService.getTransactions(
                status, method, search, pageable
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("content", transactionsPage.getContent());
            response.put("currentPage", transactionsPage.getNumber());
            response.put("totalItems", transactionsPage.getTotalElements());
            response.put("totalPages", transactionsPage.getTotalPages());
            response.put("pageSize", transactionsPage.getSize());
            response.put("hasNext", transactionsPage.hasNext());
            response.put("hasPrevious", transactionsPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách giao dịch: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Lấy chi tiết giao dịch theo ID
     * GET /api/admin/payments/transactions/{id}
     */
    @GetMapping("/transactions/{id}")
    public ResponseEntity<?> getTransactionDetail(@PathVariable int id) {
        try {
            TransactionResponse transaction = paymentService.getTransactionDetail(id);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy chi tiết giao dịch: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}