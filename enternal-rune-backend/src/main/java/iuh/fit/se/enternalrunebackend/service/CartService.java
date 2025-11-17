package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.AddToCartRequest;
import iuh.fit.se.enternalrunebackend.dto.request.UpdateCartItemRequest;
import iuh.fit.se.enternalrunebackend.dto.response.CartItemResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductVariantResponse;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductPriceRepository productPriceRepository;

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Logic mới: Nhận Product ID + options (color, storage, version)
     * Tự động tìm hoặc tạo ProductVariant phù hợp
     */
    @Transactional
    public Cart addToCart(Long userId, AddToCartRequest dto) {
        System.out.println("🛒 [NEW] CartService.addToCart - userId: " + userId + 
                           ", productId: " + dto.getProductId() + 
                           ", quantity: " + dto.getQuantity() +
                           ", color: " + dto.getColor() + 
                           ", storage: " + dto.getStorage() +
                           ", version: " + dto.getVersion());

        // 1. Validate input
        if (dto.getProductId() == null || dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new RuntimeException("Product ID and valid quantity are required");
        }

        // 2. Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        System.out.println("✅ User found: " + user.getName());

        // 3. Tìm Product
        Product product = productRepository.findById(Math.toIntExact(dto.getProductId()))
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + dto.getProductId()));
        System.out.println("📦 Product found: " + product.getProdName());

        // 4. Tìm hoặc tạo Cart cho User
        Cart cart = cartRepository.findByCartUser(user)
                .orElseGet(() -> {
                    System.out.println("🆕 Creating new cart for user: " + userId);
                    Cart newCart = new Cart();
                    newCart.setCartUser(user);
                    return cartRepository.save(newCart);
                });

        // 5. Tìm hoặc tạo ProductVariant dựa trên options
        ProductVariant productVariant = findOrCreateProductVariant(product, dto);
        System.out.println("� ProductVariant: " + productVariant.getProdvId() + " - " + productVariant.getProdvName());

        // 6. Kiểm tra CartItem đã tồn tại chưa
        CartItem existingItem = cartItemRepository
                .findByCiCartAndCiProductVariant(cart, productVariant)
                .orElse(null);

        if (existingItem != null) {
            // Nếu đã có -> Cộng thêm quantity
            System.out.println("� Updating existing cart item quantity: " + existingItem.getCiQuantity() + " + " + dto.getQuantity());
            existingItem.setCiQuantity(existingItem.getCiQuantity() + dto.getQuantity());
        } else {
            // Nếu chưa có -> Tạo mới CartItem
            System.out.println("🆕 Creating new cart item");
            CartItem newItem = new CartItem();
            newItem.setCiCart(cart);
            newItem.setCiProductVariant(productVariant);
            newItem.setCiQuantity(dto.getQuantity());
            cart.addItem(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        System.out.println("✅ Cart saved successfully with " + savedCart.getItems().size() + " items");
        return savedCart;
    }

    /**
     * Tìm hoặc tạo ProductVariant dựa trên Product + options
     */
    private ProductVariant findOrCreateProductVariant(Product product, AddToCartRequest dto) {
        String color = dto.getColor();
        String storage = dto.getStorage();
        String version = dto.getVersion();

        System.out.println("🔎 Searching for ProductVariant with color: " + color + ", storage: " + storage + ", version: " + version);

        // Tìm tất cả variants của product này
        List<ProductVariant> variants = productVariantRepository.findAll().stream()
                .filter(v -> v.getProdvProduct() != null && 
                             v.getProdvProduct().getProdId() == product.getProdId())
                .toList();

        // Tìm variant khớp với options
        ProductVariant matchedVariant = variants.stream()
                .filter(v -> matchesOptions(v, color, storage, version))
                .findFirst()
                .orElse(null);

        if (matchedVariant != null) {
            System.out.println("✅ Found existing ProductVariant: " + matchedVariant.getProdvId());
            return matchedVariant;
        }

        // Nếu không tìm thấy -> Tạo mới
        System.out.println("🆕 Creating new ProductVariant");
        return createNewProductVariant(product, dto);
    }

    /**
     * Kiểm tra variant có khớp với options không
     */
    private boolean matchesOptions(ProductVariant variant, String color, String storage, String version) {
        boolean colorMatch = (color == null) || color.equalsIgnoreCase(variant.getProdvColor());
        boolean storageMatch = (storage == null) || storage.equalsIgnoreCase(variant.getProdvModel());
        boolean versionMatch = (version == null) || version.equalsIgnoreCase(variant.getProdvVersion());
        return colorMatch && storageMatch && versionMatch;
    }

    /**
     * Tạo ProductVariant mới
     */
    private ProductVariant createNewProductVariant(Product product, AddToCartRequest dto) {
        ProductVariant newVariant = new ProductVariant();
        newVariant.setProdvProduct(product);
        newVariant.setProdvColor(dto.getColor());
        newVariant.setProdvModel(dto.getStorage()); // storage lưu trong model field
        newVariant.setProdvVersion(dto.getVersion());
        
        // Tạo tên variant
        String variantName = product.getProdName();
        if (dto.getStorage() != null) variantName += " " + dto.getStorage();
        if (dto.getColor() != null) variantName += " " + dto.getColor();
        if (dto.getVersion() != null) variantName += " " + dto.getVersion();
        newVariant.setProdvName(variantName);

        // Lấy giá từ ProductPrice đầu tiên của product (có thể customize sau)
        if (!product.getProductPrices().isEmpty()) {
            newVariant.setProdvPrice(product.getProductPrices().get(0));
        }

        // Lấy image đầu tiên của product
        if (!product.getImages().isEmpty()) {
            newVariant.setProdvImg(product.getImages().get(0));
        }

        ProductVariant saved = productVariantRepository.save(newVariant);
        System.out.println("✅ Created new ProductVariant: " + saved.getProdvId() + " - " + saved.getProdvName());
        return saved;
    }

    /**
     * Lấy giỏ hàng của user
     */
    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByCartUser_UserId(userId).orElse(null);
        if (cart != null) {
            System.out.println("🛒 Cart found for user " + userId + " with " + cart.getItems().size() + " items");
        } else {
            System.out.println("⚠️ No cart found for user " + userId);
        }
        return cart;
    }

    /**
     * Cập nhật số lượng CartItem
     */
    @Transactional
    public Cart updateCartItem(Long userId, UpdateCartItemRequest dto) {
        System.out.println("📝 Updating cart item " + dto.getCartItemId() + " quantity to " + dto.getQuantity());

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

        System.out.println("✅ Cart item updated successfully");
        return cartRepository.findById(cart.getCartId()).orElse(cart);
    }

    /**
     * Xóa CartItem khỏi giỏ hàng
     */
    @Transactional
    public Cart removeCartItem(Long userId, int cartItemId) {
        System.out.println("🗑️ Removing cart item " + cartItemId + " from user " + userId);

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

        System.out.println("✅ Cart item removed successfully");
        return cartRepository.findById(cart.getCartId()).orElse(cart);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    @Transactional
    public Cart clearCart(Long userId) {
        System.out.println("🗑️ Clearing entire cart for user " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByCartUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);

        System.out.println("✅ Cart cleared successfully");
        return cart;
    }

    /**
     * Helper: Convert CartItem Entity → CartItemDTO
     */
    private CartItemResponse toCartItemDTO(CartItem item) {
        ProductVariant variant = item.getCiProductVariant();
        Product product = variant.getProdvProduct();
        
        // Build ProductVariantDTO
        ProductVariantResponse variantDTO =
            ProductVariantResponse.builder()
                .variantId(variant.getProdvId())
                .variantName(variant.getProdvName())
                .color(variant.getProdvColor())
                .storage(variant.getProdvModel())
                .version(variant.getProdvVersion())
                .price(variant.getProdvPrice() != null ? variant.getProdvPrice().getPpPrice() : 0.0)
                .imageUrl(variant.getProdvImg() != null ? variant.getProdvImg().getImageData() : null)
                .productId(product != null ? product.getProdId() : null)
                .productName(product != null ? product.getProdName() : null)
                .brandName(product != null && product.getProdBrand() != null ? product.getProdBrand().getBrandName() : null)
                .build();
        
        // Build CartItemDTO
        return CartItemResponse.builder()
                .cartItemId(item.getCiId())
                .quantity(item.getCiQuantity())
                .productVariant(variantDTO)
                .build();
    }

    /**
     * Public Helper: Convert Cart Entity → CartResponse DTO
     */
    public iuh.fit.se.enternalrunebackend.dto.response.CartResponse toCartResponse(Cart cart) {
        if (cart == null || cart.getItems() == null) {
            iuh.fit.se.enternalrunebackend.dto.response.CartResponse response = 
                new iuh.fit.se.enternalrunebackend.dto.response.CartResponse();
            response.setCartItems(new java.util.ArrayList<>());
            response.setTotalItems(0);
            response.setTotalPrice(0.0);
            return response;
        }

        List<CartItemResponse> cartItemResponses =
            cart.getItems().stream()
                .map(this::toCartItemDTO)
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

        iuh.fit.se.enternalrunebackend.dto.response.CartResponse response = 
            new iuh.fit.se.enternalrunebackend.dto.response.CartResponse();
        response.setCartItems(cartItemResponses);
        response.setTotalItems(totalItems);
        response.setTotalPrice(totalPrice);

        return response;
    }
}

