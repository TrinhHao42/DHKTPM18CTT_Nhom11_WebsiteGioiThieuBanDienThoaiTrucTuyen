package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.request.OrderStatusUpdateRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface OrderService {
    DashboardSummaryResponse getSummaryForMonth(int year, int month);
    Order createOrder(CreateOrderRequest request);
    Page<OrderResponse> getOrdersByUserIdPaginated(Long userId, int page, int size, String shippingStatus);
    OrderResponse getOrderById(int orderId);
    OrderStatisticsResponse getOrderStatistics();
    void deleteById(int id);
    OrderResponse getOrderDetail(int orderId);
    Order cancelOrder(int orderId, Long userId);
    Page<OrderListResponse> getOrderList(String keyword, String paymentStatusCode, String shippingStatusCode, Pageable pageable);
    void updateShippingStatus(int orderId, String statusCode);
    void confirmReceivedOrder(int orderId, Long userId);
    Map<String, Boolean> checkPendingRequests(int orderId);
}
