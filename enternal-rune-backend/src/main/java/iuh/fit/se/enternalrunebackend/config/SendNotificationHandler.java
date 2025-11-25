package iuh.fit.se.enternalrunebackend.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class SendNotificationHandler extends TextWebSocketHandler {
    private static final Set<WebSocketSession> adminSessions = new CopyOnWriteArraySet<>();
    private static final Set<WebSocketSession> userSessions = new CopyOnWriteArraySet<>();

    /**
     * Send notification to all connected admin sessions
     * @param message JSON string message to broadcast
     */
    public static void sendToAdmins(String message) {
        for (WebSocketSession admin : adminSessions) {
            if (admin.isOpen()) {
                try {
                    admin.sendMessage(new TextMessage(message));
                } catch (Exception e) {
                    System.err.println("Error sending message to admin: " + e.getMessage());
                }
            }
        }
    }

    private String getRole(WebSocketSession session) {
        System.out.println(session.getUri());
        if (session.getUri() == null) return "user";
        String query = session.getUri().getQuery();
        if (query != null && query.contains("admin")) return "admin";
        return "user";
    }


    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) throws Exception {
        String role = getRole(session);
        if ("admin".equals(role)){
            adminSessions.add(session);
            System.out.println("Admin connected. Total admins: " + adminSessions.size());
        }
        else {
            userSessions.add(session);
            System.out.println("User connected. Total users: " + userSessions.size());
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        adminSessions.remove(session);
        userSessions.remove(session);
        System.out.println("Session closed. Admins: " + adminSessions.size() + ", Users: " + userSessions.size());
    }

    @Override
    protected void handleTextMessage(@NotNull WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String role = getRole(session);
        if ("user".equals(role)){
            for (WebSocketSession admin : adminSessions){
                if (admin.isOpen()){
                    admin.sendMessage(new TextMessage(payload));
                }
            }
        } else if ("admin".equals(role)) {
            for(WebSocketSession user : userSessions){
                if (user.isOpen()){
                    user.sendMessage(new TextMessage(payload));
                }
            }
        }
    }
}
