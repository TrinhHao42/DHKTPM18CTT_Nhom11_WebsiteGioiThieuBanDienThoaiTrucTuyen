package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.EcommerceDashboardResponse;

public interface DashboardService {
    EcommerceDashboardResponse getEcommerceDashboard(int year);
}
