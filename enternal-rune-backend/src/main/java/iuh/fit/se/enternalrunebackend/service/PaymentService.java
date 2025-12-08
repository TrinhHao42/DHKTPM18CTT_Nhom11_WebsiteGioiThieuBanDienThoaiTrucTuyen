package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.PaymentMetricsResponse;
import iuh.fit.se.enternalrunebackend.dto.response.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    
    /**
     * Lấy metrics tổng quan về payment
     */
    PaymentMetricsResponse getPaymentMetrics();
    
    /**
     * Lấy danh sách giao dịch với phân trang và lọc
     */
    Page<TransactionResponse> getTransactions(
            String status,
            String paymentMethod,
            String searchTerm,
            Pageable pageable
    );
    
    /**
     * Lấy chi tiết giao dịch theo ID
     */
    TransactionResponse getTransactionDetail(int transactionId);
}