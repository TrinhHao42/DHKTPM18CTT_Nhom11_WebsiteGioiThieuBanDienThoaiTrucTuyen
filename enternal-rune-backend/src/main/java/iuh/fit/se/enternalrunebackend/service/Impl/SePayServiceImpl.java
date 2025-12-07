package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.ShippingStatus;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.exception.payment_exception.PaymentException;
import iuh.fit.se.enternalrunebackend.exception.payment_exception.PaymentExceptionEnum;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import iuh.fit.se.enternalrunebackend.service.SePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Objects;

@Service
public class SePayServiceImpl implements SePayService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private OrderRefundRepository orderRefundRequestRepository;

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Autowired
    private NotificationService notificationService;

    public boolean sePayWebHookPayment(TransactionRequest transactionRequest) {
        try {
            if (Objects.isNull(transactionRequest)){
                throw new PaymentException(PaymentExceptionEnum.PAYMENT_PROCESS_ERROR);
            }

            String orderInvoiceNumber = transactionRequest.getOrder().getOrderInvoiceNumber();

            String orderIdStr = orderInvoiceNumber.replaceAll("\\D+", "");
            int orderId = Integer.parseInt(orderIdStr);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại với ID: " + orderId));

            String currentPaymentStatus = order.getCurrentPaymentStatus().getStatusCode();

            if ("PAID".equals(currentPaymentStatus))
                throw new PaymentException(PaymentExceptionEnum.PAYMENT_ALREADY_PAID);
            else if ("EXPIRED".equals(currentPaymentStatus))
                throw new PaymentException(PaymentExceptionEnum.PAYMENT_EXPIRED);
            else if ("CANCELLED".equals(currentPaymentStatus))
                throw new PaymentException(PaymentExceptionEnum.PAYMENT_CANCELLED);

            Transaction transaction = Transaction.builder()
                    .webhookId(transactionRequest.getTransaction().getId())
                    .paymentMethod(transactionRequest.getTransaction().getPaymentMethod())
                    .transactionId(transactionRequest.getTransaction().getTransactionId())
                    .transactionType(transactionRequest.getTransaction().getTransactionType())
                    .transactionDate(transactionRequest.getTransaction().getTransactionDate())
                    .transactionStatus(transactionRequest.getTransaction().getTransactionStatus())
                    .transactionAmount(transactionRequest.getTransaction().getTransactionAmount())
                    .transactionCurrency(transactionRequest.getTransaction().getTransactionCurrency())
                    .authenticationStatus(transactionRequest.getTransaction().getAuthenticationStatus())

                    .timestamp(transactionRequest.getTimestamp())
                    .notificationType(transactionRequest.getNotificationType())
                    .orderStatus(transactionRequest.getOrder().getOrderStatus())
                    .orderInvoiceNumber(orderInvoiceNumber)

                    .cardNumber(transactionRequest.getTransaction().getCardNumber())
                    .cardHolderName(transactionRequest.getTransaction().getCardHolderName())
                    .cardExpiry(transactionRequest.getTransaction().getCardExpiry())
                    .cardFundingMethod(transactionRequest.getTransaction().getCardFundingMethod())
                    .cardBrand(transactionRequest.getTransaction().getCardBrand())

                    .createdAt(LocalDateTime.now())
                    .transUser(order.getOrderUser())
                    .order(order)
                    .build();

            transactionRepository.save(transaction);

            PaymentStatus paidStatus = paymentStatusRepository.findByStatusCode("PAID")
                    .orElseThrow(() -> new RuntimeException("Shipping status CANCELLED not found"));
            order.addPaymentStatus(paidStatus, "Đơn hàng đã được thanh toán");
            orderRepository.save(order);

            // Gửi notification đến admin về thanh toán thành công
            OrderNotification paymentNotification = OrderNotification.builder()
                    .type("PAYMENT_SUCCESS")
                    .userId(order.getOrderUser().getUserId())
                    .userName(order.getOrderUser().getName())
                    .message(String.format("Khách hàng %s đã thanh toán thành công đơn hàng #%d với số tiền %s VNĐ",
                            order.getOrderUser().getName(),
                            order.getOrderId(),
                            transactionRequest.getTransaction().getTransactionAmount()))
                    .timestamp(LocalDateTime.now())
                    .build();
            notificationService.sendOrderNotificationToAdmin(paymentNotification);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean refundPayment(String orderInvoiceNumber) {
        String endpoint = "https://pgapi-sandbox.sepay.vn/v1/order/voidTransaction";

        String json = String.format(
                "{\"order_invoice_number\":\"%s\", \"reason\":\"Customer request\"}",
                orderInvoiceNumber
        );

        try {
            String secret = "your_secret_key_here:";
            String basicAuth = Base64.getEncoder()
                    .encodeToString(secret.getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Authorization", "Basic " + basicAuth)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            return response.statusCode() == 200;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
