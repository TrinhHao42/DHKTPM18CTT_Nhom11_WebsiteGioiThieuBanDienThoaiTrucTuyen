package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DashboardSummaryResponse {
    private long totalOrders;
    private Double totalRevenue;
    private long completedOrders;
    private long processingOrders;
    private double refundRateChange;     // phần trăm thay đổi số đơn hoàn tiền
    private double revenueChange;        // phần trăm thay đổi doanh thu
}
