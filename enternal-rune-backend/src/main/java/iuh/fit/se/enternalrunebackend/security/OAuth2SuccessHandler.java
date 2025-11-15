package iuh.fit.se.enternalrunebackend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.entity.Role;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.RoleRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(UserRepository userRepository, RoleRepository roleRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not found in Google account");
            return;
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAuthProvider(User.AuthProvider.GOOGLE);
            user.setPassword(UUID.randomUUID().toString());

            Role defaultRole = roleRepository.findByRoleName("USER");
            if (defaultRole == null) {
                defaultRole = new Role();
                defaultRole.setRoleName("USER");
                roleRepository.save(defaultRole);
            }

            user.setRoles(Collections.singletonList(defaultRole));
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail());

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> "ROLE_" + r.getRoleName().toUpperCase())
                .orElse("ROLE_USER");

        UserResponse loginUser = new UserResponse();
        loginUser.setUserId(user.getUserId());
        loginUser.setUserEmail(user.getEmail());
        loginUser.setUserName(user.getName());
        loginUser.setUserAddress(user.getUserAddress());

        ObjectMapper mapper = new ObjectMapper();
        String userJson = mapper.writeValueAsString(loginUser);

        String encodedUser = URLEncoder.encode(userJson, StandardCharsets.UTF_8);
        String encodedRole = URLEncoder.encode(role, StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);

        String redirectUrl = String.format(
                "http://localhost:3000/oauth-success?token=%s&user=%s&role=%s",
                encodedToken,
                encodedUser,
                encodedRole
        );

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
