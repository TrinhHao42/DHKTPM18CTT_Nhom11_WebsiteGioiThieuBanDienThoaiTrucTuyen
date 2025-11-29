package iuh.fit.se.enternalrunebackend.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class SendNotificationHandler extends TextWebSocketHandler {
    private static final Set<WebSocketSession> adminSessions = new CopyOnWriteArraySet<>();
    private static final Set<WebSocketSession> userSessions = new CopyOnWriteArraySet<>();

    /**
     * Send notification to all connected admin sessions
     *
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
        if (session.getUri() == null) return "user";

        String query = session.getUri().getQuery();

        if (query != null && query.contains("admin")) return "admin";

        return "user";
    }


    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) throws Exception {
        String role = getRole(session);
        System.out.println("🔗 New WebSocket connection from: " + session.getRemoteAddress());
        System.out.println("📋 Query string: " + (session.getUri() != null ? session.getUri().getQuery() : "null"));
        System.out.println("👤 Detected role: " + role);
        
        if ("admin".equals(role)) {
            adminSessions.add(session);
            System.out.println("✅ Admin connected. Total admins: " + adminSessions.size() + "; Total users: " + userSessions.size());
        } else {
            userSessions.add(session);
            System.out.println("✅ User connected. Total admins: " + adminSessions.size() + "; Total users: " + userSessions.size());
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        adminSessions.remove(session);
        userSessions.remove(session);
        System.out.println("Has disconnected. Admins: " + adminSessions.size() + ", Users: " + userSessions.size());
    }
}
