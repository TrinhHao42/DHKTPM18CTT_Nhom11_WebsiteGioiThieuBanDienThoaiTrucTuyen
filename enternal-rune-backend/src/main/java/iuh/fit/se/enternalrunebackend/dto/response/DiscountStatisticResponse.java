package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DiscountStatisticResponse {

    private long totalDiscounts;
    private long activeDiscounts;
    private long usedCount;
    private double totalDiscountAmount;
}
