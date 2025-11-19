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

            // ==== CHAT HISTORY (user xem lại) ====
            "/api/conversations/**",
            "/api/messages/**",


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
            "/api/conversations/**"
    };

    // Admin GET
    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/addresses/**",
    };

    public static final String[] ADMIN_POST_ENDPOINTS = {
    };
}
