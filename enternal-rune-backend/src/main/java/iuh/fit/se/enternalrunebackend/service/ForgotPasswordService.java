package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final VerificationCodeService verificationCodeService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> sendCode(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không tồn tại"));
        }

        String code = verificationCodeService.generateCode(email);
        emailService.sendVerificationCode(email, code);

        return ResponseEntity.ok(Map.of("message", "✅ Mã xác minh đã được gửi đến email của bạn"));
    }

    public ResponseEntity<?> verifyCode(String email, String code) {
        boolean valid = verificationCodeService.verifyCode(email, code);
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã xác minh không hợp lệ hoặc đã hết hạn"));
        }

        return ResponseEntity.ok(Map.of("message", "Xác minh thành công"));
    }

    public ResponseEntity<?> resetPassword(String email, String code, String newPassword) {
        if (!verificationCodeService.verifyCode(email, code)) {
            return ResponseEntity.badRequest().body(Map.of("message", " Mã xác minh không hợp lệ hoặc đã hết hạn"));
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không tồn tại"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        verificationCodeService.removeCode(email);

        return ResponseEntity.ok(Map.of("message", "Mật khẩu đã được đổi thành công"));
    }
}

