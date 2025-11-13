package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.config.QRConfig;
import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefundRequest;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import iuh.fit.se.enternalrunebackend.repository.OrderRefundRequestRepository;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.TransactionRepository;
import iuh.fit.se.enternalrunebackend.service.SePayService;
import iuh.fit.se.enternalrunebackend.util.GenerateQRURL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class SePayServiceImpl implements SePayService {
    @Autowired
    private QRConfig qrConfig;

    @Autowired
    private GenerateQRURL generateQRURL;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private OrderRefundRequestRepository orderRefundRequestRepository;

    public QRCodeResponse getQRCode(BigDecimal amount, String description) throws IOException {
        String url = generateQRURL.getQRURL(qrConfig, amount, description);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return new QRCodeResponse(response.getBody());
        }

        return null;
    }

    public PaymentStatus getOrderStatus(int id) {
        return orderRepository.checkOrderStatusById(id);
    }

    public TransactionRequest sePayWebHook(TransactionRequest transactionRequest) {
        Transaction newTransaction = new Transaction();

        newTransaction.setTransGateway(transactionRequest.getGateway());
        newTransaction.setTransDate(transactionRequest.getTransactionDate().toLocalDate());
        newTransaction.setTransAccountNumber(transactionRequest.getAccountNumber());
        newTransaction.setTransContent(transactionRequest.getContent());
        newTransaction.setTransReferenceNumber(transactionRequest.getReferenceCode());
        newTransaction.setTransBody(transactionRequest.getDescription());
        newTransaction.setTransCreatedAt(transactionRequest.getTransactionDate().toLocalDate());

        if (transactionRequest.getTransferType().equals("in")) {
            newTransaction.setTransAmountIn(transactionRequest.getTransferAmount());
        }
        else {
            newTransaction.setTransAmountOut(transactionRequest.getTransferAmount());
        }

//        Transaction transactionSaved = transactionRepository.save(newTransaction);
//
//        int row = 0;
//        if (transactionSaved != null) {
//            row = orderRepository.updateOrderStatusByID(transactionSaved.getTransId(), transactionSaved.getTransAmountIn(), PaymentStatus.PAID, PaymentStatus.PENDING);
//        }

        return transactionRequest;
    }

    public Order createOrder(Order orderInformation) {
        return orderRepository.save(orderInformation);
    }

    @Override
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findOrdersByCustomerId(customerId);
    }

    @Override
    public OrderRefundRequest updateRefundRequestPaymentStatus(TransactionRequest transactionRequest) {
        // Extract refund request ID from transaction content or description
        // Assuming the content contains the refund request ID
        String content = transactionRequest.getContent();

        // Parse the ID from content (adjust parsing logic based on your format)
        // Example: "Refund for request #123" -> extract 123
        Integer refundRequestId = extractRefundRequestIdFromContent(content);

        if (refundRequestId != null) {
            OrderRefundRequest refundRequest = orderRefundRequestRepository.findById(refundRequestId)
                    .orElseThrow(() -> new RuntimeException("Refund request not found with ID: " + refundRequestId));

            // Update payment status to PAID
            refundRequest.setOrPayment(PaymentStatus.PAID);

            return orderRefundRequestRepository.save(refundRequest);
        }

        throw new RuntimeException("Cannot extract refund request ID from transaction content");
    }

    @Override
    public Order updateOrderShippingStatus(int orderId, ShippingStatus shippingStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        order.setOrderShippingStatus(shippingStatus);

        return orderRepository.save(order);
    }

    private Integer extractRefundRequestIdFromContent(String content) {
        // Extract ID from content - adjust this logic based on your actual format
        // This is a simple example assuming format like "Refund-123" or "123"
        try {
            if (content == null || content.isEmpty()) {
                return null;
            }

            // Try to find numbers in the content
            String numbers = content.replaceAll("[^0-9]", "");
            if (!numbers.isEmpty()) {
                return Integer.parseInt(numbers);
            }
        } catch (NumberFormatException e) {
            return null;
        }
        return null;
    }
}
