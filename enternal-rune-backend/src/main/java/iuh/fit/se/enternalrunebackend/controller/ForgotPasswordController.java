package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.service.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgot-password/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> payload) {
        return forgotPasswordService.sendCode(payload.get("email"));
    }

    @PostMapping("/forgot-password/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload) {
        return forgotPasswordService.verifyCode(payload.get("email"), payload.get("code"));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        return forgotPasswordService.resetPassword(
                payload.get("email"),
                payload.get("code"),
                payload.get("newPassword")
        );
    }

            //Cách thực hiện
        //    B1:POST /api/auth/forgot-password/send-code
        //    {
        //        "email": "example@gmail.com"
        //    }
        //    B2:POST /api/auth/forgot-password/verify-code
        //    {
        //        "email": "example@gmail.com",
        //            "code": "123456"
        //    }
        //    B3:POST /api/auth/forgot-password/reset
        //    {
        //        "email": "example@gmail.com",
        //            "code": "123456",
        //            "newPassword": "new123456"
        //    }
}
