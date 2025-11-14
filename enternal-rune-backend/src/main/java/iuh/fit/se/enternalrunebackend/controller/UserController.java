package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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
            User updatedUser = userService.addUserAddress(userId, addressRequest);
            
            // Convert to response DTO
            UserResponse response = new UserResponse(
                    updatedUser.getUserId(),
                    updatedUser.getName(),
                    updatedUser.getEmail(),
                    updatedUser.getUserAddress()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Không thể thêm địa chỉ: " + e.getMessage())
            );
        }
    }

    /**
     * Inner class for error response
     */
    private record ErrorResponse(String message) {}
}
