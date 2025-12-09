package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.response.EcommerceDashboardResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    /**
     * OPTIMIZED: Batch load monthly data to reduce DB queries from 37+ to ~6
     * Added caching with 5-minute TTL
     */
    @Override
    @Cacheable(value = "dashboardCache", key = "#year", unless = "#result == null")
    public EcommerceDashboardResponse getEcommerceDashboard(int year) {
        // Batch load all monthly data in ONE query instead of 24+ queries
        Map<Integer, MonthlySummary> monthlySummaries = getMonthlySummariesBatch(year);
        
        return EcommerceDashboardResponse.builder()
                .metrics(getMetrics(monthlySummaries))
                .monthlySales(getMonthlySales(monthlySummaries))
                .monthlyTarget(getMonthlyTarget(monthlySummaries))
                .statistics(getStatistics(monthlySummaries))
                .demographics(getDemographicsOptimized())
                .recentOrders(getRecentOrders())
                .build();
    }
    
    // Inner class to hold monthly data
    private static class MonthlySummary {
        BigDecimal revenue;
        int orderCount;
        
        MonthlySummary(BigDecimal revenue, int orderCount) {
            this.revenue = revenue != null ? revenue : BigDecimal.ZERO;
            this.orderCount = orderCount;
        }
    }
    
    /**
     * Batch load all monthly data for the year in ONE query instead of 24+ queries
     * This reduces database calls from O(n) to O(1)
     */
    private Map<Integer, MonthlySummary> getMonthlySummariesBatch(int year) {
        List<Object[]> results = orderRepository.getMonthlySummariesForYear(year);
        
        Map<Integer, MonthlySummary> summaries = new HashMap<>();
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            Long orderCount = (Long) row[2];
            
            summaries.put(month, new MonthlySummary(revenue, orderCount.intValue()));
        }
        
        // Fill missing months with zero data
        for (int month = 1; month <= 12; month++) {
            summaries.putIfAbsent(month, new MonthlySummary(BigDecimal.ZERO, 0));
        }
        
        return summaries;
    }

    private EcommerceDashboardResponse.MetricsData getMetrics(Map<Integer, MonthlySummary> monthlySummaries) {
        // Tổng số khách hàng hiện tại (chỉ tính ROLE_USER, không tính admin)
        long totalCustomers = userRepository.countByRole("ROLE_USER");
        
        // Tổng số đơn hàng
        long totalOrders = orderRepository.count();
        
        // Tính growth rate cho orders (so với tháng trước) - use cached monthly data
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int lastMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        
        long ordersThisMonth = monthlySummaries.getOrDefault(currentMonth, new MonthlySummary(BigDecimal.ZERO, 0)).orderCount;
        long ordersLastMonth = monthlySummaries.getOrDefault(lastMonth, new MonthlySummary(BigDecimal.ZERO, 0)).orderCount;
        
        double orderGrowthRate = calculateGrowthRate(ordersLastMonth, ordersThisMonth);
        
        // Customer growth rate = 0.0 (User entity không có createdAt field)
        double customerGrowthRate = 0.0;
        
        return EcommerceDashboardResponse.MetricsData.builder()
                .totalCustomers(totalCustomers)
                .customerGrowthRate(customerGrowthRate)
                .totalOrders(totalOrders)
                .orderGrowthRate(orderGrowthRate)
                .build();
    }

    private List<EcommerceDashboardResponse.MonthlySalesData> getMonthlySales(Map<Integer, MonthlySummary> monthlySummaries) {
        List<EcommerceDashboardResponse.MonthlySalesData> monthlySales = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            MonthlySummary summary = monthlySummaries.get(month);
            
            monthlySales.add(EcommerceDashboardResponse.MonthlySalesData.builder()
                    .month(Month.of(month).name().substring(0, 3))
                    .amount(summary.revenue)
                    .orderCount(summary.orderCount)
                    .build());
        }
        
        return monthlySales;
    }

    private EcommerceDashboardResponse.MonthlyTargetData getMonthlyTarget(Map<Integer, MonthlySummary> monthlySummaries) {
        int currentMonth = LocalDate.now().getMonthValue();
        
        // Target: trung bình doanh thu 3 tháng gần nhất * 1.1
        BigDecimal avgRevenue = BigDecimal.ZERO;
        int monthsToCheck = Math.min(currentMonth, 3);
        
        if (monthsToCheck > 0) {
            for (int i = 0; i < monthsToCheck; i++) {
                int month = currentMonth - i;
                if (month > 0) {
                    BigDecimal revenue = monthlySummaries.get(month).revenue;
                    avgRevenue = avgRevenue.add(revenue);
                }
            }
            avgRevenue = avgRevenue.divide(BigDecimal.valueOf(monthsToCheck), 2, RoundingMode.HALF_UP);
        }
        
        BigDecimal target = avgRevenue.multiply(BigDecimal.valueOf(1.1));
        BigDecimal achieved = monthlySummaries.get(currentMonth).revenue;
        
        double percentage = target.compareTo(BigDecimal.ZERO) > 0
                ? achieved.divide(target, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0.0;
        
        return EcommerceDashboardResponse.MonthlyTargetData.builder()
                .target(target)
                .achieved(achieved)
                .percentage(percentage)
                .build();
    }

    private List<EcommerceDashboardResponse.StatisticsData> getStatistics(Map<Integer, MonthlySummary> monthlySummaries) {
        List<EcommerceDashboardResponse.StatisticsData> statistics = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            BigDecimal revenue = monthlySummaries.get(month).revenue;
            
            // Giả sử profit = 20% của revenue (có thể tính toán phức tạp hơn)
            BigDecimal profit = revenue.multiply(BigDecimal.valueOf(0.20));
            
            statistics.add(EcommerceDashboardResponse.StatisticsData.builder()
                    .month(Month.of(month).name().substring(0, 3))
                    .revenue(revenue)
                    .profit(profit)
                    .build());
        }
        
        return statistics;
    }

    /**
     * OPTIMIZED: Use native query to get country distribution without loading all users
     * Old method loaded ALL users into memory - very inefficient!
     */
    private List<EcommerceDashboardResponse.DemographicData> getDemographicsOptimized() {
        // Use native query to get country distribution directly from database
        List<Object[]> countryData = userRepository.getCustomerCountryDistribution();
        
        long totalCustomers = countryData.stream()
                .mapToLong(row -> ((Number) row[1]).longValue())
                .sum();
        
        // Convert to response
        return countryData.stream()
                .map(row -> {
                    String countryName = (String) row[0];
                    long count = ((Number) row[1]).longValue();
                    
                    double percentage = totalCustomers > 0
                            ? (count * 100.0) / totalCustomers
                            : 0.0;
                    
                    return EcommerceDashboardResponse.DemographicData.builder()
                            .country(countryName != null ? countryName : "Unknown")
                            .countryCode(getCountryCode(countryName))
                            .customerCount(count)
                            .percentage(Math.round(percentage * 100.0) / 100.0)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<EcommerceDashboardResponse.RecentOrderData> getRecentOrders() {
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 5, org.springframework.data.domain.Sort.by("orderDate").descending())
        ).getContent();
        
        return recentOrders.stream()
                .map(order -> {
                    // Lấy sản phẩm đầu tiên trong đơn hàng
                    var firstDetail = order.getOrderDetails().isEmpty()
                            ? null
                            : order.getOrderDetails().get(0);
                    
                    String productName = firstDetail != null && firstDetail.getOdProductVariant() != null
                            ? firstDetail.getOdProductVariant().getProdvName()
                            : "N/A";
                    
                    String productImage = firstDetail != null && firstDetail.getOdProductVariant() != null
                            && firstDetail.getOdProductVariant().getProdvImg() != null
                            ? firstDetail.getOdProductVariant().getProdvImg().getImageData()
                            : "";
                    
                    String category = "Electronics";
                    
                    // Lấy trạng thái giao hàng hiện tại
                    String status = order.getShippingStatusHistories().isEmpty()
                            ? "Pending"
                            : order.getShippingStatusHistories().stream()
                                    .max(Comparator.comparing(ssh -> ssh.getCreatedAt()))
                                    .map(ssh -> ssh.getShippingStatus().getStatusName())
                                    .orElse("Pending");
                    
                    return EcommerceDashboardResponse.RecentOrderData.builder()
                            .orderId(order.getOrderId())
                            .productName(productName)
                            .productImage(productImage)
                            .category(category)
                            .price(order.getOrderTotalAmount())
                            .status(status)
                            .customerName(order.getOrderUser().getName())
                            .orderDate(order.getOrderDate().toString())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private double calculateGrowthRate(long previousValue, long currentValue) {
        if (previousValue == 0) {
            return currentValue > 0 ? 100.0 : 0.0;
        }
        return ((currentValue - previousValue) * 100.0) / previousValue;
    }

    private String getCountryCode(String countryName) {
        // Mapping country name to code
        Map<String, String> countryCodeMap = Map.of(
                "Vietnam", "VN",
                "USA", "US",
                "United States", "US",
                "UK", "GB",
                "United Kingdom", "GB",
                "Canada", "CA",
                "Australia", "AU"
        );
        return countryCodeMap.getOrDefault(countryName, "XX");
    }
}
