package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import iuh.fit.se.enternalrunebackend.entity.Notification;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NotificationService {
    void sendOrderNotificationToAdmin(OrderNotification notification);
    
    // Save notification to database
    Notification saveNotification(OrderNotification notification);
    
    // Get all notifications
    List<Notification> getAllNotifications();
    
    // Get unread notifications only
    List<Notification> getUnreadNotifications();
    
    // Get notifications with pagination
    Page<Notification> getNotificationsPaginated(int page, int size);
    
    // Get unread count
    long getUnreadCount();
    
    // Mark notification as read
    void markAsRead(Long notificationId);
    
    // Mark all as read
    void markAllAsRead();
}
