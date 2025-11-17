package iuh.fit.se.enternalrunebackend.security;

public class Endpoints {
    public static final String front_end_host = "http://localhost:3000";
    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/products/**",
            "/account/activate",
            "/account/me",
            "/brands/names"
    };
    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/account/login",
            "/account/register",
            "/api/auth/**",
            "/api/users/*/address",
            "/addresses/**",
            "/payment/**",
            "/ai/generate"
    };
    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/addresses/**",
    };
    public static final String[] ADMIN_POST_ENDPOINTS = {
    };
}
