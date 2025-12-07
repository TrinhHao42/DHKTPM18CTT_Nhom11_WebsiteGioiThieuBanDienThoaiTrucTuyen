package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.CancelRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CancelRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import iuh.fit.se.enternalrunebackend.repository.CancelRequestRepository;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.repository.NotificationRespository;
import iuh.fit.se.enternalrunebackend.service.CancelRequestService;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CancelRequestServiceImpl implements CancelRequestService {

    private final CancelRequestRepository cancelRequestRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationRespository notificationRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CancelRequestResponse createCancelRequest(CancelRequestRequest request, Long userId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if order belongs to user
        if (!order.getOrderUser().getUserId().equals(userId)) {
            throw new RuntimeException("Order does not belong to user");
        }
        
        // Check payment status
        PaymentStatus paymentStatus = order.getCurrentPaymentStatus();
        boolean isPaid = paymentStatus != null && 
                ("PAID".equalsIgnoreCase(paymentStatus.getStatusCode()) || 
                 "COMPLETED".equalsIgnoreCase(paymentStatus.getStatusCode()));
        
        if (!isPaid) {
            // If not paid, cancel order directly
            order.addShippingStatus(order.getCurrentShippingStatus(), "Đơn hàng đã bị hủy bởi khách hàng");
            order.addPaymentStatus(paymentStatus, "Đơn hàng đã bị hủy");
            orderRepository.save(order);
            
            // Create notification for admin
            Notification notification = new Notification();
            notification.setNotiUser(user);
            notification.setNotiUserName(user.getName());
            notification.setNotiType("ORDER_CANCELLED");
            notification.setNotiMessage("Khách hàng " + user.getName() + " đã hủy đơn hàng #" + order.getOrderId());
            notification.setNotiTime(LocalDateTime.now());
            notification.setTargetRole("ADMIN");
            notificationRepository.save(notification);
            
            // Send real-time notification
            OrderNotification orderNotification = OrderNotification.builder()
                    .type("ORDER_CANCELLED")
                    .userId(userId)
                    .userName(user.getName())
                    .message("đã hủy đơn hàng #" + order.getOrderId())
                    .timestamp(LocalDateTime.now())
                    .build();
            notificationService.sendOrderNotificationToAdmin(orderNotification);
            
            throw new RuntimeException("Đơn hàng chưa thanh toán đã được hủy trực tiếp");
        }
        
        // If paid, create cancel request
        CancelRequest cancelRequest = CancelRequest.builder()
                .order(order)
                .user(user)
                .reason(request.getReason())
                .status(RequestStatus.PENDING)
                .build();
        
        cancelRequest = cancelRequestRepository.save(cancelRequest);
        
        // Create notification for admin
        Notification notification = new Notification();
        notification.setNotiUser(user);
        notification.setNotiUserName(user.getName());
        notification.setNotiType("CANCEL_REQUEST");
        notification.setNotiMessage("Khách hàng " + user.getName() + " đã gửi yêu cầu hủy đơn hàng #" + order.getOrderId());
        notification.setNotiTime(LocalDateTime.now());
        notification.setTargetRole("ADMIN");
        notificationRepository.save(notification);
        
        // Send real-time notification to admin via WebSocket
        OrderNotification orderNotification = OrderNotification.builder()
                .type("CANCEL_REQUEST")
                .userId(userId)
                .userName(user.getName())
                .message("đã gửi yêu cầu hủy đơn hàng #" + order.getOrderId())
                .timestamp(LocalDateTime.now())
                .build();
        notificationService.sendOrderNotificationToAdmin(orderNotification);
        
        return mapToResponse(cancelRequest);
    }

    @Override
    public Page<CancelRequestResponse> getAllCancelRequests(Pageable pageable) {
        return cancelRequestRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<CancelRequestResponse> getCancelRequestsByStatus(RequestStatus status, Pageable pageable) {
        return cancelRequestRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CancelRequestResponse getCancelRequestById(Long id) {
        CancelRequest cancelRequest = cancelRequestRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Cancel request not found"));
        return mapToDetailResponse(cancelRequest);
    }

    @Override
    @Transactional
    public CancelRequestResponse processCancelRequest(Long id, ProcessRequestRequest request, Long adminId) {
        CancelRequest cancelRequest = cancelRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancel request not found"));
        
        if (cancelRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }
        
        RequestStatus newStatus = request.getAction().equalsIgnoreCase("APPROVE") 
                ? RequestStatus.APPROVED : RequestStatus.REJECTED;
        
        cancelRequest.setStatus(newStatus);
        cancelRequest.setAdminNote(request.getAdminNote());
        cancelRequest.setProcessedBy(adminId);
        cancelRequest.setUpdatedAt(LocalDateTime.now());
        
        cancelRequest = cancelRequestRepository.save(cancelRequest);
        
        // Create notification for customer
        Notification notification = new Notification();
        notification.setNotiUser(cancelRequest.getUser());
        notification.setNotiType("CANCEL_REQUEST");
        String message = newStatus == RequestStatus.APPROVED 
                ? "Yêu cầu hủy đơn hàng của bạn cho đơn #" + cancelRequest.getOrder().getOrderId() + " đã được chấp nhận"
                : "Yêu cầu hủy đơn hàng của bạn cho đơn #" + cancelRequest.getOrder().getOrderId() + " đã bị từ chối";
        notification.setNotiMessage(message);
        notification.setNotiTime(LocalDateTime.now());
        notification.setTargetRole("USER");
        notificationRepository.save(notification);
        
        // If approved, cancel the order
        if (newStatus == RequestStatus.APPROVED) {
            Order order = cancelRequest.getOrder();
            order.addShippingStatus(order.getCurrentShippingStatus(), "Đơn hàng đã bị hủy theo yêu cầu");
            order.addPaymentStatus(order.getCurrentPaymentStatus(), "Đơn hàng đã bị hủy - chờ hoàn tiền");
            orderRepository.save(order);
        }
        
        return mapToResponse(cancelRequest);
    }

    @Override
    public long countByStatus(RequestStatus status) {
        return cancelRequestRepository.countByStatus(status);
    }

    private CancelRequestResponse mapToResponse(CancelRequest cancelRequest) {
        return CancelRequestResponse.builder()
                .cancelRequestId(cancelRequest.getCancelRequestId())
                .orderId(cancelRequest.getOrder().getOrderId())
                .userId(cancelRequest.getUser().getUserId())
                .userName(cancelRequest.getUser().getName())
                .userEmail(cancelRequest.getUser().getEmail())
                .reason(cancelRequest.getReason())
                .status(cancelRequest.getStatus())
                .adminNote(cancelRequest.getAdminNote())
                .createdAt(cancelRequest.getCreatedAt())
                .updatedAt(cancelRequest.getUpdatedAt())
                .processedBy(cancelRequest.getProcessedBy())
                .build();
    }

    private CancelRequestResponse mapToDetailResponse(CancelRequest cancelRequest) {
        // Fetch order with all details
        Order order = orderRepository.findById(cancelRequest.getOrder().getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        List<CancelRequestResponse.OrderItemSummary> items = new ArrayList<>();
        if (order.getOrderDetails() != null) {
            items = order.getOrderDetails().stream()
                    .map(od -> {
                        String productName = "N/A";
                        String variantName = "N/A";
                        
                        if (od.getOdProductVariant() != null) {
                            variantName = od.getOdProductVariant().getProdvName();
                        }
                        
                        return CancelRequestResponse.OrderItemSummary.builder()
                                .variantName(variantName)
                                .quantity(od.getOdQuantity())
                                .price(od.getOdTotalPrice())
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        
        CancelRequestResponse.OrderSummary orderSummary = CancelRequestResponse.OrderSummary.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate().toString())
                .totalAmount(order.getOrderTotalAmount().doubleValue())
                .paymentStatus(order.getCurrentPaymentStatus() != null ? 
                        order.getCurrentPaymentStatus().getStatusName() : "N/A")
                .shippingStatus(order.getCurrentShippingStatus() != null ? 
                        order.getCurrentShippingStatus().getStatusName() : "N/A")
                .items(items)
                .build();
        
        return CancelRequestResponse.builder()
                .cancelRequestId(cancelRequest.getCancelRequestId())
                .orderId(order.getOrderId())
                .userId(cancelRequest.getUser().getUserId())
                .userName(cancelRequest.getUser().getName())
                .userEmail(cancelRequest.getUser().getEmail())
                .reason(cancelRequest.getReason())
                .status(cancelRequest.getStatus())
                .adminNote(cancelRequest.getAdminNote())
                .createdAt(cancelRequest.getCreatedAt())
                .updatedAt(cancelRequest.getUpdatedAt())
                .processedBy(cancelRequest.getProcessedBy())
                .orderSummary(orderSummary)
                .build();
    }
}
