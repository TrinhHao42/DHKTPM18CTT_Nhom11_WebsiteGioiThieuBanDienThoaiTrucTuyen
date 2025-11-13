package iuh.fit.se.enternalrunebackend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BrandResponse {
    private int brandId;
    private String brandName;
}
