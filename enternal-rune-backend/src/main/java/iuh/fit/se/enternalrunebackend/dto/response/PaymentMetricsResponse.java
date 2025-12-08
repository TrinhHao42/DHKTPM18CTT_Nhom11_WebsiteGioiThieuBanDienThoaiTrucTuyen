package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMetricsResponse {
    long totalTransactions;
    BigDecimal totalRevenue;
    long paidTransactions;
    long pendingTransactions;
    
    // Trend data for comparison
    double transactionsTrend;
    double revenueTrend;
    double paidTrend;
    double pendingTrend;
}