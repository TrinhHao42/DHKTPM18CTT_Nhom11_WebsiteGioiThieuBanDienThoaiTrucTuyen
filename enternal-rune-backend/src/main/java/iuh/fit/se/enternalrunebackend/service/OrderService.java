package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.DashboardSummaryResponse;

public interface OrderService {
    public DashboardSummaryResponse getSummaryForMonth(int year, int month);
}
