package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequestDTO;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart addToCart(Long userId, AddToCartRequestDTO dto) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm hoặc tạo Cart
        Cart cart = cartRepository.findByCartUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCartUser(user);
                    return cartRepository.save(newCart);
                });

        // Tìm product
        ProductVariant product = productVariantRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra CartItem có chưa
        CartItem existingItem = cartItemRepository.findByCiCartAndCiProductVariant(cart, product).orElse(null);

        if (existingItem != null) {
            existingItem.setCiQuantity(existingItem.getCiQuantity() + dto.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCiCart(cart);
            newItem.setCiProductVariant(product);
            newItem.setCiQuantity(dto.getQuantity());
            cart.addItem(newItem); // dùng method addItem()
        }

        return cartRepository.save(cart);
    }

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByCartUser_UserId(userId)
                .orElse(null);
    }

}
