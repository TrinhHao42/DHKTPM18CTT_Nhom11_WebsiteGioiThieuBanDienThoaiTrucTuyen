package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrandRequest {
    private String brandName;
    private String brandLogoUrl;
    private String brandDescription;
    private String brandStatus;
}
