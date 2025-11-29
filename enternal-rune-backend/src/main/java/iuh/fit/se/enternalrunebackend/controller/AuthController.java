package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.dto.request.UserRequest;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.service.AccountService;
import iuh.fit.se.enternalrunebackend.service.UserService;
import iuh.fit.se.enternalrunebackend.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@RestController
@RequestMapping("account")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private AccountService accountService;

    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest userRequest) {
        return accountService.userRegister(userRequest);
    }

    @GetMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestParam String email, @RequestParam String activateId) {
        ResponseEntity<?> result = accountService.activateAccount(email, activateId);

        if (result.getStatusCode().is2xxSuccessful()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Kích hoạt tài khoản thành công");
            return ResponseEntity.ok(response);
        } else {
            return result;
        }
    }


    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Tạo token
        String token = jwtUtil.generateToken(userDetails.getUsername());

        // Lấy roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());


        var user = userService.findByEmail(userDetails.getUsername());

//        String fullAddress = null;
//        if (user.getUserAddress() != null) {
//            var addr = user.getUserAddress();
//            fullAddress = String.join(", ",
//                    addr.getStreetName(),
//                    addr.getWardName(),
//                    addr.getCityName(),
//                    addr.getCountryName()
//            );
//        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
//        response.put("username", userDetails.getUsername());
        response.put("roles", roles);

        UserResponse loginUser = UserResponse.toUserResponse(user);

        response.put("user", loginUser);
        return response;
    }


    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

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
