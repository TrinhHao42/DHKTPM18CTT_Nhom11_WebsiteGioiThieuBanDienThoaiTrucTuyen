package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.response.DashboardSummaryResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    DashboardSummaryResponse getSummaryForMonth(int year, int month);
    Order createOrder(CreateOrderRequest request);
    PaymentStatus getOrderPaymentStatus(int orderId);
    List<Order> getOrdersByUserId(Long userId);
    Page<OrderResponse> getOrdersByUserIdPaginated(Long userId, int page, int size);
    OrderResponse getOrderById(int orderId);
}
