package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequest;
import iuh.fit.se.enternalrunebackend.dto.request.UpdateCartItemRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CartItemResponse;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Logic mới: Nhận Product ID + options (color, storage, version)
     * Tự động tìm hoặc tạo ProductVariant phù hợp
     */
    @Transactional
    @Override
    public Cart addToCart(Long userId, AddToCartRequest addToCartRequest) {
        // 1. Validate input
        if (addToCartRequest.getProductId() == null || addToCartRequest.getQuantity() == null || addToCartRequest.getQuantity() <= 0) {
            throw new RuntimeException("Product ID and valid quantity are required");
        }

        // 2. Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 3. Tìm Product
        Product product = productRepository.findById(Math.toIntExact(addToCartRequest.getProductId()))
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + addToCartRequest.getProductId()));

        // 4. Tìm hoặc tạo Cart cho User
        Cart cart = cartRepository.findByCartUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCartUser(user);
                    return cartRepository.save(newCart);
                });

        // 5. Tìm ProductVariant hoặc tạo ProductVariant dựa trên options
        ProductVariant productVariant = productVariantRepository.findByProductAndOptions(
                addToCartRequest.getColor(),
                addToCartRequest.getVersion(),
                addToCartRequest.getStorage()
        ).orElseGet(() -> {
            ProductVariant newProductVariant = new ProductVariant();
            newProductVariant.setProdvName(product.getProdName());
            newProductVariant.setProdvColor(addToCartRequest.getColor());
            newProductVariant.setProdvModel(addToCartRequest.getStorage());
            newProductVariant.setProdvVersion(addToCartRequest.getVersion());
            // IMPORTANT: Set the Product object to ensure product_id is correctly set in database
            newProductVariant.setPvProduct(product);
            System.out.println(addToCartRequest.getProductId());
            
            // Handle image - only set if valid imageId is provided and exists
            if (addToCartRequest.getImageId() > 0) {
                Image image = imageRepository.findImageByImageId(addToCartRequest.getImageId());
                newProductVariant.setProdvImg(image);
            }
            
            // Set price from product's first available price
            if (product.getProductPrices() != null && !product.getProductPrices().isEmpty()) {
                newProductVariant.setProdvPrice(product.getProductPrices().getFirst());
            }
            return productVariantRepository.save(newProductVariant);
        });

        // 6. Kiểm tra CartItem đã tồn tại chưa
        CartItem existingItem = cartItemRepository
                .findByCiCartAndCiProductVariant(cart, productVariant)
                .orElse(null);

        if (existingItem != null) {
            // Nếu đã có -> Cộng thêm quantity
            existingItem.setCiQuantity(existingItem.getCiQuantity() + addToCartRequest.getQuantity());
        } else {
            // Nếu chưa có -> Tạo mới CartItem
            CartItem newItem = new CartItem();
            newItem.setCiCart(cart);
            newItem.setCiProductVariant(productVariant);
            newItem.setCiQuantity(addToCartRequest.getQuantity());
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Lấy giỏ hàng của user
     */
    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByCartUser_UserId(userId).orElse(null);
    }

    /**
     * Cập nhật số lượng CartItem
     */
    @Transactional
    @Override
    public Cart updateCartItem(Long userId, UpdateCartItemRequest dto) {

        if (dto.getCartItemId() == null || dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new RuntimeException("Cart item ID and valid quantity are required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByCartUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(dto.getCartItemId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (cartItem.getCiCart().getCartId() != cart.getCartId()) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        cartItem.setCiQuantity(dto.getQuantity());
        cartItemRepository.save(cartItem);

        // Debug output removed
        return cartRepository.findById(cart.getCartId()).orElse(cart);
    }

    /**
     * Xóa CartItem khỏi giỏ hàng
     */
    @Transactional
    @Override
    public Cart removeCartItem(Long userId, int cartItemId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByCartUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (cartItem.getCiCart().getCartId() != cart.getCartId()) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        // Debug output removed
        return cartRepository.findById(cart.getCartId()).orElse(cart);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    @Transactional
    @Override
    public Cart clearCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByCartUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);

        // Debug output removed
        return cart;
    }

    /**
     * Public Helper: Convert Cart Entity → CartResponse DTO
     */
    @Override
    public iuh.fit.se.enternalrunebackend.dto.response.CartResponse toCartResponse(Cart cart) {
        if (cart == null || cart.getItems() == null) {
            iuh.fit.se.enternalrunebackend.dto.response.CartResponse response = new iuh.fit.se.enternalrunebackend.dto.response.CartResponse();
            response.setCartItems(new java.util.ArrayList<>());
            response.setTotalItems(0);
            response.setTotalPrice(0.0);
            return response;
        }

        List<CartItemResponse> cartItemResponses = cart.getItems().stream()
                .map(CartItemResponse::toCartItemResponse)
                .collect(java.util.stream.Collectors.toList());

        // Calculate totals
        int totalItems = cart.getItems().size();
        double totalPrice = cart.getItems().stream()
                .mapToDouble(item -> {
                    double price = item.getCiProductVariant().getProdvPrice() != null
                            ? item.getCiProductVariant().getProdvPrice().getPpPrice()
                            : 0.0;
                    return price * item.getCiQuantity();
                })
                .sum();

        iuh.fit.se.enternalrunebackend.dto.response.CartResponse response = new iuh.fit.se.enternalrunebackend.dto.response.CartResponse();
        response.setCartItems(cartItemResponses);
        response.setTotalItems(totalItems);
        response.setTotalPrice(totalPrice);

        return response;
    }
}
