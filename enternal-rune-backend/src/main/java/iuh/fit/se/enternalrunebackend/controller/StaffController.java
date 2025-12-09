package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.StaffRequest;
import iuh.fit.se.enternalrunebackend.dto.response.StaffResponse;
import iuh.fit.se.enternalrunebackend.dto.response.StaffStatisticsResponse;
import iuh.fit.se.enternalrunebackend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    // Inject StaffService
    private final StaffService staffService;

    // -----------------------------------------------------------------
    // 1. READ (GET) OPERATIONS
    // -----------------------------------------------------------------

    /**
     * Lấy danh sách nhân viên có phân trang, tìm kiếm và lọc theo trạng thái.
     * Endpoint: GET /api/staff/list
     */
    @GetMapping("/list")
    public ResponseEntity<Page<StaffResponse>> getDashboardList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean activated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<StaffResponse> staffPage = staffService.getAllStaffsDashboard(keyword, activated, pageable);
        return ResponseEntity.ok(staffPage);
    }

    /**
     * Lấy dữ liệu thống kê tổng quan (Tổng số NV, Đang hoạt động, Tỷ lệ hiện diện).
     * Endpoint: GET /api/staff/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<StaffStatisticsResponse> getStatistics(){
        return ResponseEntity.ok(staffService.getStatistics());
    }
    /**
     * Lấy chi tiết thông tin nhân viên theo ID.
     * Endpoint: GET /api/staff/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getById(id));
    }

    // -----------------------------------------------------------------
    // 2. CREATE (POST) OPERATION
    // -----------------------------------------------------------------

    /**
     * Thêm nhân viên mới.
     * Endpoint: POST /api/staff
     */
    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(@RequestBody StaffRequest request) {
        // Dùng HttpStatus.CREATED (201) cho thao tác tạo thành công
        StaffResponse newStaff = staffService.createStaff(request);
        return new ResponseEntity<>(newStaff, HttpStatus.CREATED);
    }

    // -----------------------------------------------------------------
    // 3. UPDATE (PUT) OPERATION
    // -----------------------------------------------------------------

    /**
     * Cập nhật thông tin nhân viên theo ID.
     * Endpoint: PUT /api/staff/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(@PathVariable Long id, @RequestBody StaffRequest request) {
        // Dùng HttpStatus.OK (200) cho thao tác cập nhật thành công
        StaffResponse updatedStaff = staffService.updateStaff(id, request);
        return ResponseEntity.ok(updatedStaff);
    }
    // -----------------------------------------------------------------
    // 4. DELETE (DELETE) OPERATION
    // -----------------------------------------------------------------
    /**
     * Xóa nhân viên theo ID.
     * Endpoint: DELETE /api/staff/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        staffService.deleteUser(id);
        // Dùng HttpStatus.NO_CONTENT (204) cho thao tác xóa thành công không trả về nội dung
        return ResponseEntity.noContent().build();
    }
}