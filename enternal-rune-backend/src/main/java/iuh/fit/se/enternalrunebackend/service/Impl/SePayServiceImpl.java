package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.config.QRConfig;
import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefundRequest;
import iuh.fit.se.enternalrunebackend.entity.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.repository.OrderRefundRequestRepository;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.PaymentStatusRepository;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SePayServiceImpl implements SePayService {
    @Autowired
    private QRConfig qrConfig;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private OrderRefundRequestRepository orderRefundRequestRepository;

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Autowired
    private GenerateQRURL generateQRURL;

    public QRCodeResponse getQRCode(BigDecimal amount, String description) throws IOException {
        String url = generateQRURL.getQRURL(qrConfig, amount, description);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return new QRCodeResponse(response.getBody());
        }

        return null;
    }

    public boolean sePayWebHookPayment(TransactionRequest transactionRequest) {

        Pattern pattern = Pattern.compile("ORD\\s*(\\d+)");
        Matcher matcher = pattern.matcher(transactionRequest.getDescription());

        int orderId = 0;

        if (matcher.find()) {
            orderId = Integer.parseInt(matcher.group(1));
        } else {
            System.out.println("Không tìm thấy ORD");
        }

        Transaction newTransaction = new Transaction();

        newTransaction.setTransGateway(transactionRequest.getGateway());
        newTransaction.setTransDate(transactionRequest.getTransactionDate().toLocalDate());
        newTransaction.setTransAccountNumber(transactionRequest.getAccountNumber());
        newTransaction.setTransContent(transactionRequest.getContent());
        newTransaction.setTransReferenceNumber(transactionRequest.getReferenceCode());
        newTransaction.setTransBody(transactionRequest.getDescription());
        newTransaction.setTransCreatedAt(transactionRequest.getTransactionDate().toLocalDate());

        newTransaction.setTransAmountIn(transactionRequest.getTransferAmount());
        newTransaction.setTransAmountOut(BigDecimal.ZERO);

        Order orderPayment = orderRepository.getOrderByOrderId(orderId);
        newTransaction.setOrder(orderPayment);

        newTransaction.setTransUser(orderPayment.getOrderUser());

        Transaction transactionSaved = transactionRepository.save(newTransaction);

        if (transactionSaved != null) {
            // Update order payment status by adding PAID status to history
            PaymentStatus paidStatus = paymentStatusRepository.findByStatusCode("PAID")
                    .orElseThrow(() -> new RuntimeException("Payment status PAID not found"));
            orderPayment.addPaymentStatus(paidStatus, "Thanh toán thành công qua SePay");
            orderRepository.save(orderPayment);
            return true;
        }

        return false;
    }

    private Integer extractRefundRequestIdFromContent(String content) {
        try {
            if (content == null || content.isEmpty()) {
                return null;
            }

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
