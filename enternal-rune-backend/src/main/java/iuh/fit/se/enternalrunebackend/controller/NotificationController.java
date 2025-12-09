package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.Notification;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications (for admin)
     * GET /notifications
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> getAllNotifications() {
        try {
            // Chỉ lấy notifications chưa đọc
            List<Notification> notifications = notificationService.getUnreadNotifications();
            List<Map<String, Object>> response = notifications.stream()
                    .map(this::mapNotificationToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách thông báo: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get notifications with pagination
     * GET /notifications/paginated?page=0&size=10
     */
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> getNotificationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Page<Notification> notificationsPage = notificationService.getNotificationsPaginated(page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", notificationsPage.getContent().stream()
                    .map(this::mapNotificationToResponse)
                    .collect(Collectors.toList()));
            response.put("currentPage", notificationsPage.getNumber());
            response.put("totalItems", notificationsPage.getTotalElements());
            response.put("totalPages", notificationsPage.getTotalPages());
            response.put("pageSize", notificationsPage.getSize());
            response.put("hasNext", notificationsPage.hasNext());
            response.put("hasPrevious", notificationsPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy danh sách thông báo: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get unread notification count
     * GET /notifications/unread-count
     */
    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> getUnreadCount() {
        try {
            long count = notificationService.getUnreadCount();
            Map<String, Object> response = new HashMap<>();
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể lấy số thông báo chưa đọc: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Mark a notification as read
     * PUT /notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã đánh dấu đã đọc");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể đánh dấu đã đọc: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Mark all notifications as read
     * PUT /notifications/read-all
     */
    @PutMapping("/read-all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> markAllAsRead() {
        try {
            notificationService.markAllAsRead();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã đánh dấu tất cả đã đọc");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Không thể đánh dấu tất cả đã đọc: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Helper method to map Notification entity to response format
     */
    private Map<String, Object> mapNotificationToResponse(Notification notification) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", notification.getNotiId());
        map.put("type", notification.getNotiType());
        map.put("userId", notification.getNotiUser() != null ? notification.getNotiUser().getUserId() : null);
        map.put("userName", notification.getNotiUserName());
        map.put("message", notification.getNotiMessage());
        map.put("timestamp", notification.getNotiTime() != null ? notification.getNotiTime().toString() : null);
        map.put("isRead", notification.getNotiIsRead());
        return map;
    }
}
