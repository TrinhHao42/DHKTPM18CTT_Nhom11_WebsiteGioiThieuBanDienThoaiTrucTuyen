package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.DashboardSummaryResponse;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class OrderDashboardController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary() {
        LocalDate now = LocalDate.now();
        return orderService.getSummaryForMonth(now.getYear(), now.getMonthValue());
    }
}
