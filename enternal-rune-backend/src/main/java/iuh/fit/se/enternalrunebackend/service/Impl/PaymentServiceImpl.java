package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.response.PaymentMetricsResponse;
import iuh.fit.se.enternalrunebackend.dto.response.TransactionResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.TransactionRepository;
import iuh.fit.se.enternalrunebackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {
    
    private final TransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    
    @Override
    public PaymentMetricsResponse getPaymentMetrics() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();
        
        // Tính tổng số giao dịch
        long totalTransactions = allTransactions.size();
        
        // Tính tổng doanh thu từ các giao dịch thành công
        BigDecimal totalRevenue = allTransactions.stream()
                .filter(tx -> "success".equalsIgnoreCase(tx.getTransactionStatus()) || 
                             "completed".equalsIgnoreCase(tx.getTransactionStatus()))
                .map(Transaction::getTransactionAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Đếm các đơn hàng đã thanh toán
        long paidTransactions = allOrders.stream()
                .filter(order -> {
                    PaymentStatus currentStatus = order.getCurrentPaymentStatus();
                    return currentStatus != null && "PAID".equals(currentStatus.getStatusCode());
                })
                .count();
        
        // Đếm các đơn hàng chờ thanh toán
        long pendingTransactions = allOrders.stream()
                .filter(order -> {
                    PaymentStatus currentStatus = order.getCurrentPaymentStatus();
                    return currentStatus != null && "PENDING".equals(currentStatus.getStatusCode());
                })
                .count();
        
        // TODO: Tính trend (so với tháng trước) - cần implement sau
        double transactionsTrend = 22.5; // Mock data
        double revenueTrend = 28.3;
        double paidTrend = 15.8;
        double pendingTrend = -7.2;
        
        return PaymentMetricsResponse.builder()
                .totalTransactions(totalTransactions)
                .totalRevenue(totalRevenue)
                .paidTransactions(paidTransactions)
                .pendingTransactions(pendingTransactions)
                .transactionsTrend(transactionsTrend)
                .revenueTrend(revenueTrend)
                .paidTrend(paidTrend)
                .pendingTrend(pendingTrend)
                .build();
    }
    
    @Override
    public Page<TransactionResponse> getTransactions(
            String status,
            String paymentMethod,
            String searchTerm,
            Pageable pageable
    ) {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        // Lọc theo điều kiện
        List<Transaction> filteredTransactions = allTransactions.stream()
                .filter(tx -> status == null || status.isEmpty() || 
                             status.equalsIgnoreCase(tx.getTransactionStatus()) ||
                             (status.equals("completed") && ("success".equalsIgnoreCase(tx.getTransactionStatus()) || 
                              "completed".equalsIgnoreCase(tx.getTransactionStatus()))) ||
                             (status.equals("pending") && "pending".equalsIgnoreCase(tx.getTransactionStatus())) ||
                             (status.equals("failed") && "failed".equalsIgnoreCase(tx.getTransactionStatus())))
                .filter(tx -> paymentMethod == null || paymentMethod.isEmpty() || 
                             paymentMethod.equalsIgnoreCase(tx.getPaymentMethod()))
                .filter(tx -> searchTerm == null || searchTerm.isEmpty() ||
                             tx.getTransactionId().toLowerCase().contains(searchTerm.toLowerCase()) ||
                             tx.getOrderInvoiceNumber().toLowerCase().contains(searchTerm.toLowerCase()) ||
                             (tx.getOrder() != null && tx.getOrder().getOrderUser() != null &&
                              (tx.getOrder().getOrderUser().getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                               tx.getOrder().getOrderUser().getEmail().toLowerCase().contains(searchTerm.toLowerCase()))))
                .collect(Collectors.toList());
        
        // Phân trang thủ công
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredTransactions.size());
        List<Transaction> paginatedTransactions = filteredTransactions.subList(start, end);
        
        // Convert sang DTO
        List<TransactionResponse> transactionDTOs = paginatedTransactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(transactionDTOs, pageable, filteredTransactions.size());
    }
    
    @Override
    public TransactionResponse getTransactionDetail(int transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch với ID: " + transactionId));
        
        return mapToTransactionResponse(transaction);
    }
    
    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        // Tính toán gateway fee (giả sử 1.5% của amount)
        BigDecimal gatewayFee = transaction.getTransactionAmount()
                .multiply(BigDecimal.valueOf(0.015));
        BigDecimal netAmount = transaction.getTransactionAmount().subtract(gatewayFee);
        
        // Xác định status
        String status = mapTransactionStatus(transaction.getTransactionStatus());
        
        // Lấy thông tin customer từ order
        String customerName = "";
        String customerEmail = "";
        int orderId = 0;
        
        if (transaction.getOrder() != null) {
            orderId = transaction.getOrder().getOrderId();
            if (transaction.getOrder().getOrderUser() != null) {
                customerName = transaction.getOrder().getOrderUser().getName();
                customerEmail = transaction.getOrder().getOrderUser().getEmail();
            }
        }
        
        // Xác định completedAt dựa trên status
        LocalDateTime completedAt = null;
        if ("completed".equals(status) || "success".equalsIgnoreCase(transaction.getTransactionStatus())) {
            completedAt = transaction.getTransactionDate();
        }
        
        return TransactionResponse.builder()
                .transId(transaction.getTransId())
                .transactionCode(transaction.getTransactionId())
                .orderId(orderId)
                .orderInvoiceNumber(transaction.getOrderInvoiceNumber())
                .customerName(customerName)
                .customerEmail(customerEmail)
                .amount(transaction.getTransactionAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .status(status)
                .createdAt(transaction.getCreatedAt())
                .completedAt(completedAt)
                .gatewayRef(transaction.getWebhookId())
                .gatewayFee(gatewayFee)
                .netAmount(netAmount)
                .reconciled(true) // Giả sử tất cả đều đã reconciled
                .cardNumber(transaction.getCardNumber())
                .cardHolderName(transaction.getCardHolderName())
                .cardBrand(transaction.getCardBrand())
                .build();
    }
    
    private String mapTransactionStatus(String originalStatus) {
        if (originalStatus == null) return "pending";
        
        switch (originalStatus.toLowerCase()) {
            case "success":
            case "completed":
                return "completed";
            case "pending":
            case "processing":
                return "pending";
            case "failed":
            case "error":
                return "failed";
            case "refunded":
                return "refunded";
            default:
                return "pending";
        }
    }
}