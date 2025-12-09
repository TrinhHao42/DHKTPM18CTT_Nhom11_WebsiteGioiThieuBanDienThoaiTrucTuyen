package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequest;
import iuh.fit.se.enternalrunebackend.dto.request.UpdateCartItemRequest;
import iuh.fit.se.enternalrunebackend.entity.Cart;
import org.springframework.transaction.annotation.Transactional;

public interface CartService {
    @Transactional
    Cart addToCart(Long userId, AddToCartRequest addToCartRequest);

    Cart getCartByUserId(Long userId);

    @Transactional
    Cart updateCartItem(Long userId, UpdateCartItemRequest dto);

    @Transactional
    Cart removeCartItem(Long userId, int cartItemId);

    @Transactional
    Cart clearCart(Long userId);

    iuh.fit.se.enternalrunebackend.dto.response.CartResponse toCartResponse(Cart cart);
}
