package iuh.fit.se.enternalrunebackend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ProductTool {

    @PersistenceContext
    private final EntityManager entityManager;

    @Tool(name = "getTotalProducts", description = "Lấy tổng số sản phẩm trong hệ thống")
    public String getTotalProducts() {
        try {
            String sql = "SELECT COUNT(DISTINCT prod_id) FROM products";
            
            Long count = ((Number) entityManager.createNativeQuery(sql)
                    .getSingleResult()).longValue();
            
            return "Tổng số sản phẩm trong hệ thống: " + count;
        } catch (Exception e) {
            return "Lỗi khi lấy tổng sản phẩm: " + e.getMessage();
        }
    }
}
