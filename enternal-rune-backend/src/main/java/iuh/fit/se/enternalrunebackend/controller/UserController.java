package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.dto.response.AddressResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    /**
     * Thêm địa chỉ mới cho người dùng
     * POST /api/users/{userId}/address
     */
    @PostMapping("/{userId}/address")
    public ResponseEntity<?> addUserAddress(
            @PathVariable Long userId,
            @RequestBody AddressRequest addressRequest) {
        try {
            AddressResponse addressAdded =  userService.addUserAddress(userId, addressRequest);

            
            return ResponseEntity.ok(addressAdded);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Không thể thêm địa chỉ: " + e.getMessage())
            );
        }
    }

    /**
     * Lấy thông tin user kèm danh sách địa chỉ
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserWithAddresses(@PathVariable Long userId) {
        try {
            UserResponse response = userService.getUserWithAddresses(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Không thể lấy thông tin user: " + e.getMessage())
            );
        }
    }

    /**
     * Inner class for error response
     */
    private record ErrorResponse(String message) {}
}
