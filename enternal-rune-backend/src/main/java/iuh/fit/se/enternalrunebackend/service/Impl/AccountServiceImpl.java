package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.UserRequestDTO;
import iuh.fit.se.enternalrunebackend.entity.ErrorMessage;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.AddressRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.AccountService;
import iuh.fit.se.enternalrunebackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private EmailService emailService;



    @Override
    public ResponseEntity<?> userRegister(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Email đã tồn tại"));
        }

        // Mã hóa mật khẩu
        String encryptPassword = passwordEncoder.encode(userRequestDTO.getPassword());



        // Tạo user
        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(encryptPassword);
        user.setAuthProvider(User.AuthProvider.LOCAL);
        // Gán trạng thái active
        user.setUserActive(false);
        String activateId = UUID.randomUUID().toString();
        user.setActivateId(activateId);

        userRepository.save(user);
        sendEmailActivated(user.getEmail(), activateId);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công!"));
    }



    private void sendEmailActivated(String email, String activatedId){
        String subject = "Kích hoạt tài khoản tại Enternal Rune";

//        String url = "http://localhost:3000/AccountActiveScreen/" + email + "/" + activatedId;
        String url = "http://localhost:3000/ActivateAccountScreen?email=" + email + "&activateId=" + activatedId;
//        String url = "http://localhost:3000/activate-account?email=" + email + "&activateId=" + activatedId;

        String text = "<html><body>";
        text += "<p>Xin chào,</p>";
        text += "<p>Vui lòng sử dụng mã sau để kích hoạt tài khoản:</p>";
        text += "<h2>" + activatedId + "</h2>";
        text += "<p>Hoặc click vào đường link bên dưới để kích hoạt tài khoản:</p>";
        text += "<a href=\"" + url + "\">" + url + "</a>";
        text += "</body></html>";

        emailService.sendMessage("enternalrune@gmail.com", email, subject, text);
    }

    @Override
    public ResponseEntity<?> activateAccount(String email, String activateId) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Người dùng không tồn tại"));
        }
        if (user.isUserActive()) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Tài khoản đã được kích hoạt"));
        }
        if (activateId.equals(user.getActivateId())) {
            user.setUserActive(true);
            userRepository.save(user);
            return ResponseEntity.ok("Kích hoạt tài khoản thành công");
        } else {
            return ResponseEntity.badRequest().body(new ErrorMessage("Mã kích hoạt không hợp lệ"));
        }
    }
}
