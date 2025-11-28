package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.UserDashboardResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserDetailResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserStatisticsResponse;
import iuh.fit.se.enternalrunebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard-user")
public class UserDashboardController {
    @Autowired
    private UserService userService;
    @GetMapping("/list")
    public Page<UserDashboardResponse> getDashboardList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean activated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable  pageable =PageRequest.of(page, size);
        return userService.getAllUsersDashboard(keyword, activated, pageable);
    }

    @GetMapping("/statistics")
    public ResponseEntity<UserStatisticsResponse> getStatistics(){
        return ResponseEntity.ok(userService.getStatistics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDetailResponse> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserDetail(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
