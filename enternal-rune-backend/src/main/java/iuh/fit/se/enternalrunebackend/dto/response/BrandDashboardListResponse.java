package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BrandDashboardListResponse {
    private int brandId;
    private String brandLogoUrl;
    private String brandName;
    private Long productCount;
    private String brandStatus;
}
