package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.OrderStatusUpdateRequest;
import iuh.fit.se.enternalrunebackend.dto.response.DashboardSummaryResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderDetailResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.OrderStatisticsResponse;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
<<<<<<< Updated upstream
@RequestMapping("/api/dashboard-order")
//@CrossOrigin(origins = "*")
=======
@RequestMapping("/api/dashboard")
>>>>>>> Stashed changes
public class OrderDashboardController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/list")
    public Page<OrderListResponse> getOrderList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) ShippingStatus shippingStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return orderService.getOrderList(keyword, paymentStatus, shippingStatus, pageable);
    }
    @GetMapping("/statistics")
    public ResponseEntity<OrderStatisticsResponse> getOrderStatistics() {
        return ResponseEntity.ok(orderService.getOrderStatistics());
    }
    @PutMapping("/{id}/status")
    public OrderListResponse updateOrderStatus(
            @PathVariable int id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        return orderService.updateOrderStatus(id, request);
    }
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable int id) {
        orderService.deleteById(id);
    }
    @GetMapping("/{id}")
    public OrderDetailResponse getOrderDetail(@PathVariable int id) {
        return orderService.getOrderDetail(id);
    }



}
