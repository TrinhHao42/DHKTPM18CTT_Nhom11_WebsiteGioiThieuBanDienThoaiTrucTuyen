package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequest;
import iuh.fit.se.enternalrunebackend.dto.request.UpdateCartItemRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CartItemDTO;
import iuh.fit.se.enternalrunebackend.dto.response.CartResponse;
import iuh.fit.se.enternalrunebackend.entity.Cart;
import iuh.fit.se.enternalrunebackend.entity.CartItem;
import iuh.fit.se.enternalrunebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    /**
     * Thêm sản phẩm vào giỏ hàng
     * POST /cart/add/{userId}
     * Body: { "productId": 1, "quantity": 2, "color": "Black", "storage": "128GB", "version": "Pro" }
     */
    @PostMapping("/add/{userId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {
        
        try {
            Cart updatedCart = cartService.addToCart(userId, request);
            CartResponse response = cartService.toCartResponse(updatedCart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error adding to cart: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy giỏ hàng của user
     * GET /cart/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            
            CartResponse response = new CartResponse();
            if (cart != null) {
                response = cartService.toCartResponse(cart);
            } else {
                response.setCartItems(new ArrayList<>());
                response.setTotalItems(0);
                response.setTotalPrice(0.0);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting cart: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật số lượng CartItem
     * PUT /cart/update/{userId}
     * Body: { "cartItemId": 1, "quantity": 3 }
     */
    @PutMapping("/update/{userId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long userId,
            @RequestBody UpdateCartItemRequest request) {
        
        try {
            Cart updatedCart = cartService.updateCartItem(userId, request);
            CartResponse response = cartService.toCartResponse(updatedCart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error updating cart item: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa CartItem khỏi giỏ hàng
     * DELETE /cart/remove/{userId}/{cartItemId}
     */
    @DeleteMapping("/remove/{userId}/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long userId,
            @PathVariable int cartItemId) {
        
        try {
            Cart updatedCart = cartService.removeCartItem(userId, cartItemId);
            CartResponse response = cartService.toCartResponse(updatedCart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error removing cart item: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa toàn bộ giỏ hàng
     * DELETE /cart/clear/{userId}
     */
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<CartResponse> clearCart(@PathVariable Long userId) {
        try {
            Cart clearedCart = cartService.clearCart(userId);
            CartResponse response = cartService.toCartResponse(clearedCart);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error clearing cart: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
