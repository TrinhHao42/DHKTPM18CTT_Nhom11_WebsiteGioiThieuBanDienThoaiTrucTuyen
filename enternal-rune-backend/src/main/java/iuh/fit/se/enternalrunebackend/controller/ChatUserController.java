package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Role;
import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.User;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ChatUserMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat-users")
public class ChatUserController {

    private final ChatUserMongoRepository chatUserMongoRepository;

    @PostMapping("/register-or-update")
    public User registerOrUpdateUser(@RequestBody Map<String, String> userInfo) {
        String userId = userInfo.get("userId");
        String displayName = userInfo.get("displayName");
        String email = userInfo.get("email");
        
        // Tìm user đã tồn tại
        return chatUserMongoRepository.findById(userId)
                .map(existingUser -> {
                    // Cập nhật thông tin nếu có thay đổi
                    boolean updated = false;
                    if (displayName != null && !displayName.equals(existingUser.getDisplayName())) {
                        existingUser.setDisplayName(displayName);
                        updated = true;
                    }
                    if (email != null && !email.equals(existingUser.getEmail())) {
                        existingUser.setEmail(email);
                        updated = true;
                    }
                    if (updated) {
                        return chatUserMongoRepository.save(existingUser);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    // Tạo user mới
                    User newUser = new User();
                    newUser.setId(userId);
                    newUser.setDisplayName(displayName);
                    newUser.setEmail(email);
                    newUser.setRole(Role.CUSTOMER);
                    return chatUserMongoRepository.save(newUser);
                });
    }

    @GetMapping("/{userId}")
    public User getUser(@PathVariable String userId) {
        return chatUserMongoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
