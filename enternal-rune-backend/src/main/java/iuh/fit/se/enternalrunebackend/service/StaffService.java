package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.StaffRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StaffService {
    Page<StaffResponse> getAllStaffsDashboard(String keyword, Boolean activated, Pageable pageable);
    StaffStatisticsResponse getStatistics();
    StaffResponse getById(Long id);
    void deleteUser(Long userId);
    StaffResponse updateStaff(Long id, StaffRequest request);
    StaffResponse createStaff(StaffRequest request);
}
