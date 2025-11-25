package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.request.OrderStatusUpdateRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefundRequest;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    DashboardSummaryResponse getSummaryForMonth(int year, int month);
    Order createOrder(CreateOrderRequest request);
    Page<OrderResponse> getOrdersByUserIdPaginated(Long userId, int page, int size);
    OrderResponse getOrderById(int orderId);
<<<<<<< Updated upstream
//    List<OrderListResponse> getOrderList();
    OrderStatisticsResponse getOrderStatistics();
    Page<OrderListResponse> getOrderList(String keyword, PaymentStatus paymentStatus, ShippingStatus shippingStatus, Pageable pageable);
    OrderListResponse updateOrderStatus(int orderId, OrderStatusUpdateRequest request);
    void deleteById(int id);
    OrderDetailResponse getOrderDetail(int orderId);
=======
    Order cancelOrder(int orderId, Long userId);
    OrderRefundRequest createRefundRequest(int orderId, Long userId, String reason, String refundType);
>>>>>>> Stashed changes
}
