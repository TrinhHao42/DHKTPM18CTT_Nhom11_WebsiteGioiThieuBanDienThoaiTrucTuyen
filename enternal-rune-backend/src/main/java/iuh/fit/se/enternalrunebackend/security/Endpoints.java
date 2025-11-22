package iuh.fit.se.enternalrunebackend.security;

public class Endpoints {
    public static final String front_end_host = "http://localhost:3000";
    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/products/**",
            "/account/activate",
            "/account/me",
            "/brands/names",
            "/notifications",
            "/api/products/*/comments",
            "/api/products/*/comments/*/replies",
            "/api/products/*/rating-distribution",
            "/api/products/*/average-rating"
    };
    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/account/login",
            "/account/register",
            "/api/auth/**",
            "/api/users/*/address",
            "/addresses/**",
            "/payment/**",
            "/ai/generate",
            "/notifications",
            "/api/products/*/comments",
            "/api/products/*/comments/text",
            "/api/products/*/comments/*/replies"
    };
    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/addresses/**",
    };
    public static final String[] ADMIN_POST_ENDPOINTS = {
    };
}
