package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.StaffRequest;
import iuh.fit.se.enternalrunebackend.dto.response.AddressResponse;
import iuh.fit.se.enternalrunebackend.dto.response.StaffResponse;
import iuh.fit.se.enternalrunebackend.dto.response.StaffStatisticsResponse;
import iuh.fit.se.enternalrunebackend.entity.Address;
import iuh.fit.se.enternalrunebackend.entity.Role;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.AddressRepository;
import iuh.fit.se.enternalrunebackend.repository.RoleRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class StaffServiceImpl implements StaffService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- Helper Methods ---

    private Address createAddressFromDto(AddressResponse addressDto) {
        // ... (logic tạo Address từ DTO)
        Address address = new Address();
        address.setStreetName(addressDto.getStreetName());
        address.setWardName(addressDto.getWardName());
        address.setCityName(addressDto.getCityName());
        address.setCountryName(addressDto.getCountryName());
        return address;
    }

    private StaffResponse mapToStaffResponse(User staff) {
        Role singleRole = staff.getRoles() != null && !staff.getRoles().isEmpty()
                ? staff.getRoles().get(0)
                : null;

        AddressResponse addressResponse = staff.getAddresses() != null && !staff.getAddresses().isEmpty()
                ? AddressResponse.toAddressResponse(staff.getAddresses().get(0))
                : null;

        // SỬA LỖI CONSTRUCTOR: Truyền đủ 7 tham số
        return new StaffResponse(
                staff.getUserId(),
                staff.getName(),
                staff.getEmail(),
                singleRole,
                staff.isUserActive(),
                "********",
                addressResponse
        );
    }

    // --- CRUD Operations ---

    @Override
    @Transactional(readOnly = true)
    public Page<StaffResponse> getAllStaffsDashboard(String keyword, Boolean activated, Pageable pageable) {
        Page<User> staffPage = userRepository.searchStaff(keyword, activated, pageable);

        // SỬA LỖI CONSTRUCTOR: Sử dụng phương thức mapToStaffResponse đã sửa
        List<StaffResponse> dtoList = staffPage.stream().map(this::mapToStaffResponse).toList();

        return new PageImpl<>(dtoList, pageable, staffPage.getTotalElements());
    }

    // =======================================================
    // 1. CHỨC NĂNG THÊM NHÂN VIÊN
    // =======================================================
    @Override
    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        // 1. KIỂM TRA EMAIL ĐÃ TỒN TẠI
        User existingEmailUser = userRepository.findByEmail(request.getEmail());
        if (existingEmailUser != null) {
            throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
        }

        // 2. Xử lý Address
        Address newAddress = createAddressFromDto(request.getAddress());
        Address savedAddress = addressRepository.save(newAddress);

        // 3. XỬ LÝ ROLE (Kiểm tra null thủ công)
        Role staffRole = roleRepository.findByRoleName(request.getRole().getRoleName());
        if (staffRole == null) {
            throw new RuntimeException("Role không tồn tại: " + request.getRole().getRoleName());
        }

        // 4. Tạo User Entity
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setUserActive(request.isStatus());
        newUser.setAuthProvider(User.AuthProvider.LOCAL);
        newUser.setAddresses(Collections.singletonList(savedAddress));
        newUser.setRoles(Collections.singletonList(staffRole));

        User savedUser = userRepository.save(newUser);
        return mapToStaffResponse(savedUser);
    }
    // =======================================================
    // 2. CHỨC NĂNG CẬP NHẬT NHÂN VIÊN
    // =======================================================

    @Override
    @Transactional
    public StaffResponse updateStaff(Long id, StaffRequest request) {
        // 1. Tìm User
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff không tồn tại với ID: " + id));

        // 2. CẬP NHẬT THÔNG TIN CƠ BẢN (Name và Status)
        existingUser.setName(request.getName());
        existingUser.setUserActive(request.isStatus());

        // 3. CẬP NHẬT EMAIL
        // Cập nhật email nếu thay đổi (và email mới không trùng với người khác)
        if (!existingUser.getEmail().equals(request.getEmail())) {
            User userWithNewEmail = userRepository.findByEmail(request.getEmail());

            // Kiểm tra: Có tìm thấy user khác (không phải user đang update) không?
            if (userWithNewEmail != null && !userWithNewEmail.getUserId().equals(id)) {
                throw new RuntimeException("Email mới đã được sử dụng bởi người dùng khác.");
            }
            existingUser.setEmail(request.getEmail());
        }

        // 4. CẬP NHẬT MẬT KHẨU
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            // Mã hóa mật khẩu mới
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 5. CẬP NHẬT ROLE (Sửa lỗi UnsupportedOperationException)
        Role newRole = roleRepository.findByRoleName(request.getRole().getRoleName());
        if (newRole == null) {
            throw new RuntimeException("Role mới không tồn tại: " + request.getRole().getRoleName());
        }
        // SỬA LỖI: Gán một ArrayList mới chứa Role mới (mutable List)
        existingUser.setRoles(new ArrayList<>(List.of(newRole)));

        // 6. Cập nhật Address
        if (request.getAddress() != null) {
            Address currentAddress = existingUser.getAddresses().isEmpty() ? null : existingUser.getAddresses().get(0);

            if (currentAddress != null) {
                // Cập nhật thông tin địa chỉ hiện có
                currentAddress.setStreetName(request.getAddress().getStreetName());
                currentAddress.setWardName(request.getAddress().getWardName());
                currentAddress.setCityName(request.getAddress().getCityName());
                currentAddress.setCountryName(request.getAddress().getCountryName());
                addressRepository.save(currentAddress); // Lưu Address để chắc chắn thay đổi được áp dụng
            } else {
                // Nếu chưa có địa chỉ, tạo mới
                Address newAddress = createAddressFromDto(request.getAddress());
                Address savedAddress = addressRepository.save(newAddress);

                // SỬA LỖI: Gán một ArrayList mới chứa Address mới (mutable List)
                existingUser.setAddresses(new ArrayList<>(List.of(savedAddress)));
            }
        }

        // Lưu User đã cập nhật
        User updatedUser = userRepository.save(existingUser);
        return mapToStaffResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public StaffStatisticsResponse getStatistics() {
        int totalStaff = userRepository.countByRole("ROLE_STAFF");
        int totalActivated = userRepository.countActiveStaff(true);
        int totalNotActivated = totalStaff - totalActivated;
        double presenceRate = (totalStaff > 0) ? ((double) totalActivated / totalStaff) * 100 : 0.0;
        return new StaffStatisticsResponse(
                totalStaff,
                totalActivated,
                totalNotActivated,
                presenceRate
        );
    }

    @Override
    public StaffResponse getById(Long id) {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Staff"));
        // SỬA LỖI CONSTRUCTOR: Sử dụng phương thức mapToStaffResponse đã sửa
        return mapToStaffResponse(staff);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Staff không tồn tại với ID: " + userId));
        userRepository.delete(user);
    }
}