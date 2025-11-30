package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.ShippingStatus;
import iuh.fit.se.enternalrunebackend.repository.ShippingStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shipping-status")
@RequiredArgsConstructor
public class ShippingStatusController {

    private final ShippingStatusRepository shippingStatusRepository;

    /**
     * Lấy danh sách tất cả shipping statuses
     * GET /shipping-status
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getAllShippingStatuses() {
        try {
            List<ShippingStatus> statuses = shippingStatusRepository.findAll();
            
            // Map to simple DTO
            List<Map<String, String>> response = statuses.stream()
                .map(status -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("code", status.getStatusCode());
                    map.put("name", status.getStatusName());
                    return map;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách trạng thái: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
