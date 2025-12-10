package iuh.fit.se.enternalrunebackend.util;

import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Utility class để lấy thông tin user từ SecurityContext
 */
@Component
@RequiredArgsConstructor
public class AssistanceChatSecurityUtil {

    private final UserRepository userRepository;

    /**
     * Lấy userId của user hiện tại từ SecurityContext
     * @return Optional<Long> userId nếu user đã authenticated, empty nếu không
     */
    public Optional<Long> getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                // Lấy email từ UserDetails
                String email = ((UserDetails) principal).getUsername();
                // Tìm User entity từ email để lấy userId
                User user = userRepository.findByEmail(email);
                if (user != null && user.getUserId() != null) {
                    return Optional.of(user.getUserId());
                }
            }

            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Lấy email của user hiện tại từ SecurityContext
     * @return Optional<String> email nếu user đã authenticated, empty nếu không
     */
    public Optional<String> getCurrentUserEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                return Optional.of(email);
            }

            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}

