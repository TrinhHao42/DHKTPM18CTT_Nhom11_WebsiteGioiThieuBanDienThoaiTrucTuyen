package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.response.OrderResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    /**
     * Tạo order mới
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrder(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo đơn hàng thành công!");
            response.put("orderId", order.getOrderId());
            response.put("orderDate", order.getOrderDate());
            response.put("totalAmount", order.getOrderTotalAmount());
            response.put("paymentStatus", order.getOrderPaymentStatus());
            response.put("shippingStatus", order.getOrderShippingStatus());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể tạo đơn hàng: " + e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Lấy danh sách orders của user với phân trang
     * GET /api/orders/user/{userId}?page=0&size=5
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        try {
            var ordersPage = orderService.getOrdersByUserIdPaginated(userId, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());
            response.put("pageSize", ordersPage.getSize());
            response.put("hasNext", ordersPage.hasNext());
            response.put("hasPrevious", ordersPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Lấy order theo ID
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable int orderId) {
        try {
            OrderResponse order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy thông tin đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getOrderPaymentStatus(@PathVariable int id){
        try {
            PaymentStatus status = orderService.getOrderPaymentStatus(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Không tìm thấy đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

