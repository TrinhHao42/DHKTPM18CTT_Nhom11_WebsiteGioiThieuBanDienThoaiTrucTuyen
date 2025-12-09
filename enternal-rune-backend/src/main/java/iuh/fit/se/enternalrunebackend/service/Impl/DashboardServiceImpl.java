package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.response.EcommerceDashboardResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.DashboardService;
import lombok.RequiredArgsConstructor;
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

    @Override
    public EcommerceDashboardResponse getEcommerceDashboard(int year) {
        return EcommerceDashboardResponse.builder()
                .metrics(getMetrics())
                .monthlySales(getMonthlySales(year))
                .monthlyTarget(getMonthlyTarget(year))
                .statistics(getStatistics(year))
                .demographics(getDemographics())
                .recentOrders(getRecentOrders())
                .build();
    }

    private EcommerceDashboardResponse.MetricsData getMetrics() {
        // Tổng số khách hàng hiện tại (chỉ tính ROLE_USER, không tính admin)
        long totalCustomers = userRepository.countByRole("ROLE_USER");
        
        // Tổng số đơn hàng
        long totalOrders = orderRepository.count();
        
        // Tính growth rate cho orders (so với tháng trước)
        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);
        
        long ordersThisMonth = orderRepository.countOrdersInMonth(
                now.getYear(), now.getMonthValue());
        long ordersLastMonth = orderRepository.countOrdersInMonth(
                lastMonth.getYear(), lastMonth.getMonthValue());
        
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

    private List<EcommerceDashboardResponse.MonthlySalesData> getMonthlySales(int year) {
        List<EcommerceDashboardResponse.MonthlySalesData> monthlySales = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            BigDecimal amount = orderRepository.getTotalRevenueInMonth(year, month);
            int orderCount = orderRepository.countOrdersInMonth(year, month);
            
            monthlySales.add(EcommerceDashboardResponse.MonthlySalesData.builder()
                    .month(Month.of(month).name().substring(0, 3))
                    .amount(amount != null ? amount : BigDecimal.ZERO)
                    .orderCount(orderCount)
                    .build());
        }
        
        return monthlySales;
    }

    private EcommerceDashboardResponse.MonthlyTargetData getMonthlyTarget(int year) {
        int currentMonth = LocalDate.now().getMonthValue();
        
        // Target: trung bình doanh thu 3 tháng gần nhất * 1.1
        BigDecimal avgRevenue = BigDecimal.ZERO;
        int monthsToCheck = Math.min(currentMonth, 3);
        
        if (monthsToCheck > 0) {
            for (int i = 0; i < monthsToCheck; i++) {
                int month = currentMonth - i;
                BigDecimal revenue = orderRepository.getTotalRevenueInMonth(year, month);
                avgRevenue = avgRevenue.add(revenue != null ? revenue : BigDecimal.ZERO);
            }
            avgRevenue = avgRevenue.divide(BigDecimal.valueOf(monthsToCheck), 2, RoundingMode.HALF_UP);
        }
        
        BigDecimal target = avgRevenue.multiply(BigDecimal.valueOf(1.1));
        BigDecimal achieved = orderRepository.getTotalRevenueInMonth(year, currentMonth);
        achieved = achieved != null ? achieved : BigDecimal.ZERO;
        
        double percentage = target.compareTo(BigDecimal.ZERO) > 0
                ? achieved.divide(target, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0.0;
        
        return EcommerceDashboardResponse.MonthlyTargetData.builder()
                .target(target)
                .achieved(achieved)
                .percentage(percentage)
                .build();
    }

    private List<EcommerceDashboardResponse.StatisticsData> getStatistics(int year) {
        List<EcommerceDashboardResponse.StatisticsData> statistics = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            BigDecimal revenue = orderRepository.getTotalRevenueInMonth(year, month);
            revenue = revenue != null ? revenue : BigDecimal.ZERO;
            
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

    private List<EcommerceDashboardResponse.DemographicData> getDemographics() {
        // Lấy danh sách user với địa chỉ (chỉ ROLE_USER, không tính admin)
        List<User> users = userRepository.findAll();
        
        // Đếm theo quốc gia (chỉ user có role ROLE_USER)
        Map<String, Long> countryCount = users.stream()
                .filter(user -> user.getRoles() != null && 
                        user.getRoles().stream().anyMatch(role -> "ROLE_USER".equals(role.getRoleName())))
                .filter(user -> user.getAddresses() != null && !user.getAddresses().isEmpty())
                .flatMap(user -> user.getAddresses().stream())
                .collect(Collectors.groupingBy(
                        address -> address.getCountryName() != null ? address.getCountryName() : "Unknown",
                        Collectors.counting()
                ));
        
        long totalCustomers = countryCount.values().stream().mapToLong(Long::longValue).sum();
        
        // Convert to response
        return countryCount.entrySet().stream()
                .map(entry -> {
                    double percentage = totalCustomers > 0
                            ? (entry.getValue() * 100.0) / totalCustomers
                            : 0.0;
                    
                    return EcommerceDashboardResponse.DemographicData.builder()
                            .country(entry.getKey())
                            .countryCode(getCountryCode(entry.getKey()))
                            .customerCount(entry.getValue())
                            .percentage(Math.round(percentage * 100.0) / 100.0)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getCustomerCount(), a.getCustomerCount()))
                .limit(5)
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
