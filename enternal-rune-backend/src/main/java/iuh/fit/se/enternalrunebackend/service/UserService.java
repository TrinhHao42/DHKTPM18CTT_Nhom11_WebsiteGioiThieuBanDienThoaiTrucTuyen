package iuh.fit.se.enternalrunebackend.service;



import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;


public interface UserService extends UserDetailsService {
    User findByEmail(String email);
    AddressResponse addUserAddress(Long userId, AddressRequest addressRequest);
    UserResponse getUserWithAddresses(Long userId);
//    List<UserDashboardResponse> getAllUsersDashboard();
    Page<UserDashboardResponse> getAllUsersDashboard(String keyword,Boolean activated,Pageable pageable);
    UserStatisticsResponse getStatistics();
    UserDetailResponse getUserDetail(Long userId);
    void deleteUser(Long userId);
}
