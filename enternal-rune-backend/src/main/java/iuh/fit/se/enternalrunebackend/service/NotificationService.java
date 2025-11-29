package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;

public interface NotificationService {
    void sendOrderNotificationToAdmin(OrderNotification notification);
}
