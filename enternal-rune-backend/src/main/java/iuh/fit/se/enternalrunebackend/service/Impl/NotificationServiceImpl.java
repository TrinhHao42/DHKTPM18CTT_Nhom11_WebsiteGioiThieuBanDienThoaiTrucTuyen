package iuh.fit.se.enternalrunebackend.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.enternalrunebackend.config.SendNotificationHandler;
import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final ObjectMapper objectMapper;

    @Override
    public void sendOrderNotificationToAdmin(OrderNotification notification) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(notification);
            SendNotificationHandler.sendToAdmins(jsonMessage);
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }
}
