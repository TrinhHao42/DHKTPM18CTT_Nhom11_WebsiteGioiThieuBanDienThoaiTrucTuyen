package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.response.OrderResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Tạo order mới
     * POST /orders
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
     * GET /orders/user/{userId}?page=0&size=5
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrdersFullHistories(
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
     * GET /orders/{orderId}
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


    /**
     * Hủy đơn hàng
     * PUT /api/orders/{orderId}/cancel
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable int orderId, @RequestParam Long userId) {
        try {
            Order cancelledOrder = orderService.cancelOrder(orderId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Hủy đơn hàng thành công!");
            response.put("orderId", cancelledOrder.getOrderId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể hủy đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/status/{orderId}")
    public String getOrderStatusById(@PathVariable int orderId){
        return orderService.getOrderById(orderId).getCurrentPaymentStatus().getStatusCode();
    }

    /**
     * Lấy tất cả orders với phân trang (cho admin)
     * GET /orders/admin/all?page=0&size=10&keyword=&paymentStatus=&shippingStatus=
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String shippingStatus
    ) {
        try {
            org.springframework.data.domain.Pageable pageable = 
                org.springframework.data.domain.PageRequest.of(page, size);
            
            Page<?> ordersPage = orderService.getOrderList(
                keyword, 
                paymentStatus, 
                shippingStatus, 
                pageable
            );
            
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
     * Lấy chi tiết order (cho admin)
     * GET /orders/admin/{orderId}
     */
    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getOrderDetailForAdmin(@PathVariable int orderId) {
        try {
            OrderResponse order = orderService.getOrderDetail(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy thông tin đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

