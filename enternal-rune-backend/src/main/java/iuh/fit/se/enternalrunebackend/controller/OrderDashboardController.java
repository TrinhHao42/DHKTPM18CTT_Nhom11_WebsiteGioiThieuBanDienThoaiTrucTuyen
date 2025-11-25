package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.OrderStatusUpdateRequest;
import iuh.fit.se.enternalrunebackend.dto.response.OrderDetailResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderStatisticsResponse;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard-order")
public class OrderDashboardController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/list")
    public Page<OrderListResponse> getOrderList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String paymentStatusCode,
            @RequestParam(required = false) String shippingStatusCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return orderService.getOrderList(keyword, paymentStatusCode, shippingStatusCode, pageable);
    }
    @GetMapping("/statistics")
    public ResponseEntity<OrderStatisticsResponse> getOrderStatistics() {
        return ResponseEntity.ok(orderService.getOrderStatistics());
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable int id) {
        orderService.deleteById(id);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderDetail(@PathVariable int id) {
        return orderService.getOrderDetail(id);
    }
}
