package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EcommerceDashboardResponse {
    private MetricsData metrics;
    private List<MonthlySalesData> monthlySales;
    private MonthlyTargetData monthlyTarget;
    private List<StatisticsData> statistics;
    private List<DemographicData> demographics;
    private List<RecentOrderData> recentOrders;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MetricsData {
        private long totalCustomers;
        private double customerGrowthRate;
        private long totalOrders;
        private double orderGrowthRate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlySalesData {
        private String month;
        private BigDecimal amount;
        private int orderCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTargetData {
        private BigDecimal target;
        private BigDecimal achieved;
        private double percentage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatisticsData {
        private String month;
        private BigDecimal revenue;
        private BigDecimal profit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DemographicData {
        private String country;
        private String countryCode;
        private long customerCount;
        private double percentage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentOrderData {
        private int orderId;
        private String productName;
        private String productImage;
        private String category;
        private BigDecimal price;
        private String status;
        private String customerName;
        private String orderDate;
    }
}
