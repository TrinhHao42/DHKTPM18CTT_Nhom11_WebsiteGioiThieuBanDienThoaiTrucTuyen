package iuh.fit.se.enternalrunebackend.security;

public class Endpoints {
    public static final String FRONT_END_HOST = "http://localhost:3000";

    // GET không cần đăng nhập
    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/products/**",
            "/account/activate",
            "/account/me",
            "/brands/names",
            "/notifications",
            "/api/dashboard/**",
            "/orders/*/pending-requests",
            // ==== CHAT HISTORY (user xem lại) ====
            "/api/conversations/**",
            "/api/messages/**",
            "/api/chat-users/**",
            "/api/products/*/comments",
            "/api/products/*/comments/*/replies",
            "/api/products/*/rating-distribution",
            "/api/products/*/average-rating",
            "/api/chat/**",
            // ==== ADMIN COMMENTS (không cần auth) ====
            "/api/admin/comments/**"
    };

    // POST không cần đăng nhập
    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/account/login",
            "/account/register",
            "/api/auth/**",
            "/ai/generate",
            // ==== TẠO CONVERSATION CHAT, TEST WS ====
            "/api/messages/**",
            "/api/conversations/**",
            "/api/chat-users/**",
            "/api/products/*/comments",
            "/api/products/*/comments/text",
            "/api/products/*/comments/*/replies",
            "/api/chat/**",
            "/upload/**",
            // ==== ADMIN COMMENTS (không cần auth) ====
            "/api/admin/comments/**"
    };

    // PATCH không cần đăng nhập
    public static final String[] PUBLIC_PATCH_ENDPOINTS = {
            "/api/conversations/**"
    };

    // PUT không cần đăng nhập
    public static final String[] PUBLIC_PUT_ENDPOINTS = {
            "/orders/*/confirm-received",
            // ==== ADMIN COMMENTS (không cần auth) ====
            "/api/admin/comments/**"
    };

    // DELETE không cần đăng nhập
    public static final String[] PUBLIC_DELETE_ENDPOINTS = {
            "/cart/**",
            "/api/discounts/**",
            "/api/products/comments/images/**"  // Allow deleting comment images
    };

    // Admin GET
    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/addresses/**",
            "/api/dashboard-order/**",
            "/api/dashboard-user/**",
            "/products/dashboard/**",
            "/api/discounts/**",
            "/orders/admin/**",
            "/shipping-status",
            "/api/notifications/**",
            "/api/admin/payments/**"
    };
    
    public static final String[] ADMIN_POST_ENDPOINTS = {
            "/products/dashboard/**",
            "/api/discounts/**"
    };
    
    public static final String[] ADMIN_PUT_ENDPOINTS = {
            "/api/dashboard-order/**",
            "/products/dashboard/**",
            "/api/discounts/**",
            "/orders/admin/*/shipping-status",
            "/api/notifications/**"
    };
    
    public static final String[] ADMIN_DELETE_ENDPOINTS = {
            "/api/dashboard-order/**",
            "/api/dashboard-user/**",
            "/products/dashboard/**",
            "/api/discounts/**"
    };
}
