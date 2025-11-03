package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequestDTO;
import iuh.fit.se.enternalrunebackend.entity.Cart;
import iuh.fit.se.enternalrunebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequestDTO dto) {
        Cart updatedCart = cartService.addToCart(userId, dto);
        return ResponseEntity.ok(updatedCart);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart != null) {
            return ResponseEntity.ok(cart);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
