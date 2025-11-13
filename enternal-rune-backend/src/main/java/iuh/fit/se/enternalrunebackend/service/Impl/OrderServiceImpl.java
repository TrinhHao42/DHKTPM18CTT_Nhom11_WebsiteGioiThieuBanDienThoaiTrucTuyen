package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.response.DashboardSummaryResponse;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public DashboardSummaryResponse getSummaryForMonth(int year, int month) {
        // Tổng số đơn hàng, đơn hoàn thành, đơn đang xử lý
        long totalOrders = orderRepository.countTotalOrders();
        long completedOrders = orderRepository.countCompletedOrders();
        long processingOrders = orderRepository.countProcessingOrders();

        // Dữ liệu tháng hiện tại
        Double revenueThisMonth = orderRepository.sumRevenueByMonth(year, month);
        Integer refundsThisMonth = orderRepository.countRefundsByMonth(year, month);

        // Dữ liệu tháng trước để so sánh
        int prevMonth = (month == 1) ? 12 : month - 1;
        int prevYear = (month == 1) ? year - 1 : year;

        Double revenuePrevMonth = orderRepository.sumRevenueByMonth(prevYear, prevMonth);
        Integer refundsPrevMonth = orderRepository.countRefundsByMonth(prevYear, prevMonth);

        // Tính % thay đổi
        double revenueChange = calcChangePercent(revenueThisMonth, revenuePrevMonth);
        double refundChange = calcChangePercent(refundsThisMonth, refundsPrevMonth);

        return new DashboardSummaryResponse(
                totalOrders,
                revenueThisMonth,
                completedOrders,
                processingOrders,
                refundChange,
                revenueChange
        );
    }

    /**
     * Tính % thay đổi giữa 2 tháng.
     * Nếu tháng trước = 0 thì:
     * - nếu tháng này > 0 → 100%
     * - nếu tháng này = 0 → 0%
     */
    private double calcChangePercent(Number current, Number previous) {
        if (current == null) current = 0;
        if (previous == null || previous.doubleValue() == 0)
            return current.doubleValue() > 0 ? 100.0 : 0.0;

        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100.0;
    }
}
