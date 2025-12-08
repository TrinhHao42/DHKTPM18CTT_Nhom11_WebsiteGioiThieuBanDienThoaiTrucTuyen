package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PurchaseCheckService {

    private final OrderRepository orderRepository;

    /**
     * Kiểm tra user đã mua sản phẩm cụ thể hay chưa
     * Use separate transaction to avoid affecting main transaction
     * 
     * @param userId    ID của user
     * @param productId ID của sản phẩm
     * @return true nếu đã mua, false nếu chưa mua
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW, readOnly = true)
    public boolean hasUserPurchasedProduct(Long userId, Integer productId) {
        if (userId == null || productId == null) {
            log.warn("Null userId ({}) or productId ({}) provided for purchase check", userId, productId);
            return false;
        }
        
        try {
            boolean result = orderRepository.hasUserPurchasedProduct(userId, productId);
            log.debug("Purchase check for user {} product {}: {}", userId, productId, result);
            return result;
        } catch (Exception e) {
            log.error("Error checking purchase status for user {} and product {}: {}", 
                     userId, productId, e.getMessage());
            return false; // Default to false on error to avoid breaking other operations
        }
    }

    /**
     * Lấy danh sách ID sản phẩm user đã mua
     * 
     * @param userId ID của user
     * @return List các product ID đã mua
     */
    public List<Integer> getPurchasedProductIds(Long userId) {
        try {
            // Sử dụng native query (recommended)
            return orderRepository.getPurchasedProductIdsByUser(userId);
        } catch (Exception e) {
            log.error("Error getting purchased products for user {}: {}", userId, e.getMessage());
            try {
                // Fallback to JPQL query (fixed version)
                return orderRepository.getPurchasedProductIdsByUserJPQLSimple(userId);
            } catch (Exception jpqlError) {
                log.error("JPQL fallback also failed for user {}: {}", userId, jpqlError.getMessage());
                // Final fallback: Use simple query and filter in Java
                return getPurchasedProductIdsWithJavaFilter(userId);
            }
        }
    }

    /**
     * Fallback method: Get products and filter with Java code
     */
    private List<Integer> getPurchasedProductIdsWithJavaFilter(Long userId) {
        try {
            return orderRepository.getPurchasedProductIdsByUserSimple(userId)
                .stream()
                .filter(productId -> {
                    // Additional filtering can be done here if needed
                    return true;
                })
                .toList();
        } catch (Exception e) {
            log.error("Final fallback failed for user {}: {}", userId, e.getMessage());
            try {
                return orderRepository.getPurchasedProductIdsByUserJPQL(userId);
            } catch (Exception e2) {
                log.error("Fallback query also failed for user {}: {}", userId, e2.getMessage());
                return List.of(); // Return empty list on error
            }
        }
    }

    /**
     * Kiểm tra user có mua ít nhất 1 sản phẩm nào không
     * 
     * @param userId ID của user
     * @return true nếu đã từng mua hàng
     */
    public boolean hasUserEverPurchased(Long userId) {
        List<Integer> purchasedProducts = getPurchasedProductIds(userId);
        return !purchasedProducts.isEmpty();
    }

    /**
     * Kiểm tra user đã mua nhiều sản phẩm trong danh sách
     * 
     * @param userId     ID của user
     * @param productIds Danh sách product IDs cần kiểm tra
     * @return Map<ProductId, Boolean> với trạng thái mua hàng của từng sản phẩm
     */
    public java.util.Map<Integer, Boolean> checkMultipleProducts(Long userId, List<Integer> productIds) {
        List<Integer> purchasedIds = getPurchasedProductIds(userId);
        
        return productIds.stream()
            .collect(java.util.stream.Collectors.toMap(
                productId -> productId,
                purchasedIds::contains
            ));
    }
}