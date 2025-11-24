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
                        // ==== CHAT HISTORY (user xem lại) ====
                        "/api/conversations/**",
                        "/api/messages/**",
                        "/api/products/*/comments",
                        "/api/products/*/comments/*/replies",
                        "/api/products/*/rating-distribution",
                        "/api/products/*/average-rating",
                        "/api/dashboard-order/**"

        };
    public static final String[] PUBLIC_PUT_ENDPOINTS = {
            "/api/dashboard-order/**"
    };
    public static final String[] PUBLIC_DELETE_ENDPOINTS = {
            "/api/dashboard-order/**"
    };
        // POST không cần đăng nhập
    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/account/login",
            "/account/register",
            "/api/auth/**",
            "/api/users/*/address",
            "/addresses/**",
            "/payment/**",
            "/ai/generate",
            "/notifications",

            // ==== TẠO CONVERSATION CHAT, TEST WS ====
            "/api/messages/**",
            "/api/conversations/**",
            "/api/products/*/comments",
            "/api/products/*/comments/text",
            "/api/products/*/comments/*/replies"
    };

    // Admin GET
        public static final String[] ADMIN_GET_ENDPOINTS = {
                        "/addresses/**",
        };

        public static final String[] ADMIN_POST_ENDPOINTS = {
        };
}
