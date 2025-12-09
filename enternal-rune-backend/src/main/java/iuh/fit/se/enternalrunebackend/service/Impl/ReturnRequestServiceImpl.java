package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.ReturnRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProcessRequestRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ReturnRequestResponse;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.RequestStatus;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.ReturnRequestRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.repository.NotificationRespository;
import iuh.fit.se.enternalrunebackend.repository.ShippingStatusRepository;
import iuh.fit.se.enternalrunebackend.service.ReturnRequestService;
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
public class ReturnRequestServiceImpl implements ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationRespository notificationRepository;
    private final NotificationService notificationService;
    private final ShippingStatusRepository shippingStatusRepository;

    @Override
    @Transactional
    public ReturnRequestResponse createReturnRequest(ReturnRequestRequest request, Long userId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if order belongs to user
        if (!order.getOrderUser().getUserId().equals(userId)) {
            throw new RuntimeException("Order does not belong to user");
        }
        
        // Create return request
        ReturnRequest returnRequest = ReturnRequest.builder()
                .order(order)
                .user(user)
                .reason(request.getReason())
                .imageUrl(request.getImageUrl())
                .status(RequestStatus.PENDING)
                .build();
        
        returnRequest = returnRequestRepository.save(returnRequest);
        
        // Create notification for admin
        Notification notification = new Notification();
        notification.setNotiUser(user);
        notification.setNotiUserName(user.getName());
        notification.setNotiType("RETURN_REQUEST");
        notification.setNotiMessage("Khách hàng " + user.getName() + " đã gửi yêu cầu trả hàng cho đơn hàng #" + order.getOrderId());
        notification.setNotiTime(LocalDateTime.now());
        notification.setTargetRole("ADMIN"); // This notification is for admin
        notificationRepository.save(notification);
        
        // Send real-time notification to admin via WebSocket
        OrderNotification orderNotification = OrderNotification.builder()
                .type("RETURN_REQUEST")
                .userId(userId)
                .userName(user.getName())
                .message("đã gửi yêu cầu trả hàng cho đơn hàng #" + order.getOrderId())
                .timestamp(LocalDateTime.now())
                .build();
        notificationService.sendOrderNotificationToAdmin(orderNotification);
        
        return mapToResponse(returnRequest);
    }

    @Override
    public Page<ReturnRequestResponse> getAllReturnRequests(Pageable pageable) {
        // OPTIMIZED: Use DTO projection instead of loading full entities
        return returnRequestRepository.findAllWithDTO(pageable);
    }

    @Override
    public Page<ReturnRequestResponse> getReturnRequestsByStatus(RequestStatus status, Pageable pageable) {
        // OPTIMIZED: Use DTO projection instead of loading full entities
        return returnRequestRepository.findByStatusWithDTO(status, pageable);
    }

    @Override
    public ReturnRequestResponse getReturnRequestById(Long id) {
        ReturnRequest returnRequest = returnRequestRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Return request not found"));
        return mapToDetailResponse(returnRequest);
    }

    @Override
    @Transactional
    public ReturnRequestResponse processReturnRequest(Long id, ProcessRequestRequest request, Long adminId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return request not found"));
        
        if (returnRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }
        
        RequestStatus newStatus = request.getAction().equalsIgnoreCase("APPROVE") 
                ? RequestStatus.APPROVED : RequestStatus.REJECTED;
        
        returnRequest.setStatus(newStatus);
        returnRequest.setAdminNote(request.getAdminNote());
        returnRequest.setProcessedBy(adminId);
        returnRequest.setUpdatedAt(LocalDateTime.now());
        
        returnRequest = returnRequestRepository.save(returnRequest);
        
        // Create notification for customer
        Notification notification = new Notification();
        notification.setNotiUser(returnRequest.getUser());
        notification.setNotiType("RETURN_REQUEST");
        String message = newStatus == RequestStatus.APPROVED 
                ? "Yêu cầu trả hàng của bạn cho đơn hàng #" + returnRequest.getOrder().getOrderId() + " đã được chấp nhận"
                : "Yêu cầu trả hàng của bạn cho đơn hàng #" + returnRequest.getOrder().getOrderId() + " đã bị từ chối";
        notification.setNotiMessage(message);
        notification.setNotiTime(LocalDateTime.now());
        notification.setTargetRole("USER"); // This notification is for customer
        notificationRepository.save(notification);
        
        // If approved, update order status
        if (newStatus == RequestStatus.APPROVED) {
            // Get RETURNED shipping status
            ShippingStatus returnedStatus = shippingStatusRepository.findByStatusCode("RETURNED")
                    .orElseThrow(() -> new RuntimeException("Shipping status RETURNED not found"));
            
            // Update order shipping status to RETURNED
            returnRequest.getOrder().addShippingStatus(returnedStatus, "Đơn hàng đã được trả lại");
            orderRepository.save(returnRequest.getOrder());
        }
        
        return mapToResponse(returnRequest);
    }

    @Override
    public long countByStatus(RequestStatus status) {
        return returnRequestRepository.countByStatus(status);
    }

    private ReturnRequestResponse mapToResponse(ReturnRequest returnRequest) {
        return ReturnRequestResponse.builder()
                .returnRequestId(returnRequest.getReturnRequestId())
                .orderId(returnRequest.getOrder().getOrderId())
                .userId(returnRequest.getUser().getUserId())
                .userName(returnRequest.getUser().getName())
                .userEmail(returnRequest.getUser().getEmail())
                .reason(returnRequest.getReason())
                .imageUrl(returnRequest.getImageUrl())
                .status(returnRequest.getStatus())
                .adminNote(returnRequest.getAdminNote())
                .createdAt(returnRequest.getCreatedAt())
                .updatedAt(returnRequest.getUpdatedAt())
                .processedBy(returnRequest.getProcessedBy())
                .build();
    }

    private ReturnRequestResponse mapToDetailResponse(ReturnRequest returnRequest) {
        // Fetch order with all details
        Order order = orderRepository.findById(returnRequest.getOrder().getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        List<ReturnRequestResponse.OrderItemSummary> items = new ArrayList<>();
        if (order.getOrderDetails() != null) {
            items = order.getOrderDetails().stream()
                    .map(od -> {
                        String productName = "N/A";
                        String variantName = "N/A";
                        
                        if (od.getOdProductVariant() != null) {
                            variantName = od.getOdProductVariant().getProdvName();
                        }
                        
                        return ReturnRequestResponse.OrderItemSummary.builder()
                                .productName(productName)
                                .variantName(variantName)
                                .quantity(od.getOdQuantity())
                                .price(od.getOdTotalPrice())
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        
        ReturnRequestResponse.OrderSummary orderSummary = ReturnRequestResponse.OrderSummary.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate().toString())
                .totalAmount(order.getOrderTotalAmount().doubleValue())
                .paymentStatus(order.getCurrentPaymentStatus() != null ? 
                        order.getCurrentPaymentStatus().getStatusName() : "N/A")
                .shippingStatus(order.getCurrentShippingStatus() != null ? 
                        order.getCurrentShippingStatus().getStatusName() : "N/A")
                .items(items)
                .build();
        
        return ReturnRequestResponse.builder()
                .returnRequestId(returnRequest.getReturnRequestId())
                .orderId(order.getOrderId())
                .userId(returnRequest.getUser().getUserId())
                .userName(returnRequest.getUser().getName())
                .userEmail(returnRequest.getUser().getEmail())
                .reason(returnRequest.getReason())
                .imageUrl(returnRequest.getImageUrl())
                .status(returnRequest.getStatus())
                .adminNote(returnRequest.getAdminNote())
                .createdAt(returnRequest.getCreatedAt())
                .updatedAt(returnRequest.getUpdatedAt())
                .processedBy(returnRequest.getProcessedBy())
                .orderSummary(orderSummary)
                .build();
    }
}
