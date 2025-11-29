package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDashboardListResponse {
    private int productId;
    private String imageUrl;
    private String productName;
    private String model;
    private String category;
    private double price;
    private String status;
}
