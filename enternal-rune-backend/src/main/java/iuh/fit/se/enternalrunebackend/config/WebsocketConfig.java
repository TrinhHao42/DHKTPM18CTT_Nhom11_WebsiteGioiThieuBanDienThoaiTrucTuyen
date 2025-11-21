package iuh.fit.se.enternalrunebackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketConfigurer, WebSocketMessageBrokerConfigurer {
    @Value("${frontend.user}")
    private String userUrl;

    @Value("${frontend.admin}")
    private String adminUrl;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SendNotificationHandler(), "/notifications").setAllowedOriginPatterns(userUrl, adminUrl);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 1. SockJS endpoint cho frontend web (fallback support)
        registry.addEndpoint("/ws/sockjs")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setSuppressCors(true);
        
        // 2. Native WebSocket endpoint cho Postman, mobile, hoặc WS client thuần
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // prefix cho nơi client gửi message
        registry.setApplicationDestinationPrefixes("/assistance");

        // prefix cho nơi client subscribe (nhận broadcast)
        registry.enableSimpleBroker("/topic");
    }
}
