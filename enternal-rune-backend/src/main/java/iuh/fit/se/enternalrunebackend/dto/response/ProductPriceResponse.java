package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProductPriceResponse {
    private int ppId;
    private double ppPrice;
    private String ppPriceStatus;
    private LocalDate ppStartDate;
    private LocalDate ppEndDate;
    private Integer discountId;
    private String discountName;
}
