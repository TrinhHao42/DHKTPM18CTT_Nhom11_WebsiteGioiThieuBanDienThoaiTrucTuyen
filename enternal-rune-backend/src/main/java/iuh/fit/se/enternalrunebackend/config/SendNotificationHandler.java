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
    private static final Set<WebSocketSession> addminSessions = new CopyOnWriteArraySet<>();
    private static final Set<WebSocketSession> userSessions = new CopyOnWriteArraySet<>();

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
            addminSessions.add(session);
        }
        else {
            userSessions.add(session);
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        addminSessions.remove(session);
        userSessions.remove(session);
    }

    @Override
    protected void handleTextMessage(@NotNull WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String role = getRole(session);
        if ("user".equals(role)){
            for (WebSocketSession admin : addminSessions){
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
