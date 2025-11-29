package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.Transaction;
import iuh.fit.se.enternalrunebackend.repository.OrderRefundRepository;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.PaymentStatusRepository;
import iuh.fit.se.enternalrunebackend.repository.TransactionRepository;
import iuh.fit.se.enternalrunebackend.service.SePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
            String orderInvoiceNumber = transactionRequest.getOrder().getOrderInvoiceNumber();

            String orderIdStr = orderInvoiceNumber.replaceAll("\\D+", "");
            int orderId = Integer.parseInt(orderIdStr);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order không tồn tại với ID: " + orderId));

            System.out.println(order);
//            if ("APPROVED".equals(transactionRequest.getTransaction().getTransactionStatus())) {
//
//                Transaction transaction = Transaction.builder()
//                        .webhookId(transactionRequest.getTransaction().getId())
//                        .paymentMethod(transactionRequest.getTransaction().getPaymentMethod())
//                        .transactionId(transactionRequest.getTransaction().getTransactionId())
//                        .transactionType(transactionRequest.getTransaction().getTransactionType())
//                        .transactionDate(transactionRequest.getTransaction().getTransactionDate())
//                        .transactionStatus(transactionRequest.getTransaction().getTransactionStatus())
//                        .transactionAmount(transactionRequest.getTransaction().getTransactionAmount())
//                        .transactionCurrency(transactionRequest.getTransaction().getTransactionCurrency())
//                        .authenticationStatus(transactionRequest.getTransaction().getAuthenticationStatus())
//
//                        .timestamp(transactionRequest.getTimestamp())
//                        .notificationType(transactionRequest.getNotificationType())
//                        .orderStatus(transactionRequest.getOrder().getOrderStatus())
//                        .orderInvoiceNumber(orderInvoiceNumber)
//
//                        .cardNumber(transactionRequest.getTransaction().getCardNumber())
//                        .cardHolderName(transactionRequest.getTransaction().getCardHolderName())
//                        .cardExpiry(transactionRequest.getTransaction().getCardExpiry())
//                        .cardFundingMethod(transactionRequest.getTransaction().getCardFundingMethod())
//                        .cardBrand(transactionRequest.getTransaction().getCardBrand())
//
//                        .createdAt(LocalDateTime.now())
//                        .transUser(order.getOrderUser())
//                        .order(order)
//                        .build();
//
//                transactionRepository.save(transaction);
//
//                return true;
//            }
//
//            return false;
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
