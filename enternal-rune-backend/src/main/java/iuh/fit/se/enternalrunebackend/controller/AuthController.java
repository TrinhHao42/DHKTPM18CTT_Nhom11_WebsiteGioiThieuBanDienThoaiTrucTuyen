package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.dto.request.UserRequestDTO;
import iuh.fit.se.enternalrunebackend.entity.ErrorMessage;
import iuh.fit.se.enternalrunebackend.service.AccountService;
import iuh.fit.se.enternalrunebackend.service.UserService;
import iuh.fit.se.enternalrunebackend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("account")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;

    // DTO login request
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDTO userRequestDTO) {
        return accountService.userRegister(userRequestDTO);
    }
    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String email, @RequestParam String activateId) {
        ResponseEntity<?> result = accountService.activateAccount(email, activateId);

        if (result.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok(
                    "<html><body><h2 style='color:green;'>Kích hoạt tài khoản thành công!</h2></body></html>"
            );
        } else {
            // Lấy message lỗi từ ResponseEntity body
            Object body = result.getBody();
            String message = "Kích hoạt không thành công";

            if (body instanceof ErrorMessage) {
                message = ((ErrorMessage) body).getMessage();
            }

            return ResponseEntity
                    .badRequest()
                    .body("<html><body><h2 style='color:red;'>" + message + "</h2></body></html>");
        }
    }


    // TRONG AuthController.java

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
        // ... (Xác thực và tạo token giữ nguyên)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Tạo token
        String token = jwtUtil.generateToken(userDetails.getUsername());


        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // Lấy chuỗi tên vai trò (e.g., "ROLE_ADMIN")
                .collect(Collectors.toList());


        // Trả về response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", userDetails.getUsername());
        response.put("roles", roles); // Sử dụng List<String> đã chuyển đổi
        return response;
    }
    // TRONG AuthController.java

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // 🔥 SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY: Chuyển đổi GrantedAuthority sang List<String>
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority) // Lấy chuỗi tên vai trò
                    .collect(Collectors.toList());

            response.put("username", userDetails.getUsername());
            response.put("roles", roles); // Sử dụng List<String> đã chuyển đổi
        } else {
            response.put("error", "User not authenticated");
        }
        return response;
    }
}
