package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.ShippingStatus;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.exception.payment_exception.PaymentException;
import iuh.fit.se.enternalrunebackend.exception.payment_exception.PaymentExceptionEnum;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.SePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

            return true;
        } catch (Exception e) {
            return false;
        }
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
