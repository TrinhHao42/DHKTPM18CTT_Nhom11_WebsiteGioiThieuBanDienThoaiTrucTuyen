package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatisticsResponse {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long completedOrders;
    private long processingOrders;
}
