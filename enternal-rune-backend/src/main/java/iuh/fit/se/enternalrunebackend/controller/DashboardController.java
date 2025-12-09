package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.EcommerceDashboardResponse;
import iuh.fit.se.enternalrunebackend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<EcommerceDashboardResponse> getEcommerceDashboard(
            @RequestParam(defaultValue = "0") int year
    ) {
        if (year == 0) {
            year = LocalDate.now().getYear();
        }
        return ResponseEntity.ok(dashboardService.getEcommerceDashboard(year));
    }
}
