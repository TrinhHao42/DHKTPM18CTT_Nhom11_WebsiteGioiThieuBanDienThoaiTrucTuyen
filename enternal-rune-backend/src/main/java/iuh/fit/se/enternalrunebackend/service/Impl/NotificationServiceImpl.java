package iuh.fit.se.enternalrunebackend.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.enternalrunebackend.config.SendNotificationHandler;
import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import iuh.fit.se.enternalrunebackend.entity.Notification;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.NotificationRespository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final ObjectMapper objectMapper;
    private final NotificationRespository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void sendOrderNotificationToAdmin(OrderNotification notification) {
        try {
            // Save to database first
            saveNotification(notification);
            
            // Then send via WebSocket
            String jsonMessage = objectMapper.writeValueAsString(notification);
            SendNotificationHandler.sendToAdmins(jsonMessage);
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public Notification saveNotification(OrderNotification orderNotification) {
        User user = null;
        if (orderNotification.getUserId() != null) {
            user = userRepository.findById(orderNotification.getUserId()).orElse(null);
        }
        
        Notification notification = Notification.builder()
                .notiUser(user)
                .notiType(orderNotification.getType())
                .notiUserName(orderNotification.getUserName())
                .notiMessage(orderNotification.getMessage())
                .notiTime(orderNotification.getTimestamp() != null ? 
                        orderNotification.getTimestamp() : LocalDateTime.now())
                .notiIsRead(false)
                .targetRole("ADMIN") // Default to ADMIN for order notifications
                .build();
        
        return notificationRepository.save(notification);
    }
    
    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByNotiTimeDesc();
    }
    
    @Override
    public List<Notification> getUnreadNotifications() {
        // Get unread notifications for ADMIN
        return notificationRepository.findByNotiIsReadFalseAndTargetRoleOrderByNotiTimeDesc("ADMIN");
    }
    
    @Override
    public Page<Notification> getNotificationsPaginated(int page, int size) {
        return notificationRepository.findAllByOrderByNotiTimeDesc(PageRequest.of(page, size));
    }
    
    @Override
    public long getUnreadCount() {
        return notificationRepository.countByNotiIsReadFalseAndTargetRole("ADMIN");
    }
    
    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
    }
    
    @Override
    @Transactional
    public void markAllAsRead() {
        notificationRepository.markAllAsReadByTargetRole("ADMIN");
    }
}
