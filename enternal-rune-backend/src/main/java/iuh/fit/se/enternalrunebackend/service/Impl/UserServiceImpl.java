package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.dto.response.AddressResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserDashboardResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserStatisticsResponse;
import iuh.fit.se.enternalrunebackend.entity.Address;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.Role;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.AddressRepository;
import iuh.fit.se.enternalrunebackend.repository.OrderRepository;
import iuh.fit.se.enternalrunebackend.repository.RoleRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private AddressRepository addressRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public AddressResponse addUserAddress(Long userId, AddressRequest addressRequest) {

        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + userId));

        // Kiểm tra nếu address đã tồn tại
        Optional<Address> existingAddress = addressRepository.findByExactMatch(
                addressRequest.getStreetName(),
                addressRequest.getWardName(),
                addressRequest.getCityName(),
                addressRequest.getCountryName()
        );

        Address address;

        if (existingAddress.isPresent()) {
            // Address đã tồn tại
            address = existingAddress.get();
        } else {
            // Tạo mới address
            Address newAddress = new Address();
            newAddress.setStreetName(addressRequest.getStreetName());
            newAddress.setWardName(addressRequest.getWardName());
            newAddress.setCityName(addressRequest.getCityName());
            newAddress.setCountryName(addressRequest.getCountryName());
            address = addressRepository.save(newAddress);
        }

        // Gán vào user nếu chưa tồn tại
        if (user.getAddresses() == null) {
            user.setAddresses(new ArrayList<>());
        }

        boolean alreadyHasAddress = user.getAddresses().stream()
                .anyMatch(a -> a.getAddressId() == address.getAddressId());

        if (!alreadyHasAddress) {
            user.getAddresses().add(address);
            userRepository.save(user);
        }

        // 🔥 Trả về AddressResponse đúng format
        AddressResponse response = new AddressResponse();
        response.setAddressId(address.getAddressId());
        response.setStreetName(address.getStreetName());
        response.setWardName(address.getWardName());
        response.setCityName(address.getCityName());
        response.setCountryName(address.getCountryName());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserWithAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + userId));

        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUserName(user.getName());
        response.setUserEmail(user.getEmail());
        response.setUserAddress(user.getAddresses());

        return response;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userE = userRepository.findByEmail(username);
        if(userE== null){
            throw new UsernameNotFoundException("Tài khoản không tồn tại!");
        }
        org.springframework.security.core.userdetails.User user = new org.springframework.security.core.userdetails.User(userE.getEmail(),userE.getPassword(),roleToAuthorities(userE.getRoles()));
        return user;
    }

    private Collection<? extends GrantedAuthority> roleToAuthorities(Collection<Role> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public Page<UserDashboardResponse> getAllUsersDashboard(String keyword, Boolean activated, Pageable pageable){
        Page<User> userPage = userRepository.searchUser(keyword, activated, pageable);

       List<UserDashboardResponse> dtoList = userPage.getContent().stream().map(user -> {

           // Lấy danh sách order của user
           List<Order> orders =
                   orderRepository.findByOrderUser_UserId(user.getUserId());
           // Tính tổng số order
           int totalOrder = orders.size();
           // Tính tổng tiền order
           BigDecimal totalPrice = orders.stream()
                   .map(Order::getOrderTotalAmount)
                   .reduce(BigDecimal.ZERO, BigDecimal::add);

           return new UserDashboardResponse(
                   user.getName(),
                   user.getEmail(),
                   user.getAuthProvider(),
                   user.isUserActive(),
                   totalOrder,
                   totalPrice
           );

       }).toList();

        return new PageImpl<>(dtoList,pageable,userPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsResponse getStatistics() {

        // Tổng khách hàng (Role = ROLE_USER)
        int totalUser = userRepository.countByRole("ROLE_USER");
        // Khách hàng active
        int totalActivated = userRepository.countActiveCustomer(true);
        // Khách hàng inactive
        int totalNotActivated = totalUser - totalActivated;

        // Provider statistics (chỉ tính khách hàng)
        int local = userRepository.countCustomerByProvider(User.AuthProvider.LOCAL);
        int google = userRepository.countCustomerByProvider(User.AuthProvider.GOOGLE);
        UserStatisticsResponse.ProviderStatistics providerStats =
                new UserStatisticsResponse.ProviderStatistics(local, google);

        return new UserStatisticsResponse(
                totalUser,
                totalActivated,
                totalNotActivated,
                providerStats
        );
    }

}
