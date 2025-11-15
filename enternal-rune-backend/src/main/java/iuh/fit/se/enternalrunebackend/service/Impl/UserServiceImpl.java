package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.entity.Address;
import iuh.fit.se.enternalrunebackend.entity.Role;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.repository.AddressRepository;
import iuh.fit.se.enternalrunebackend.repository.RoleRepository;
import iuh.fit.se.enternalrunebackend.repository.UserRepository;
import iuh.fit.se.enternalrunebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private AddressRepository addressRepository;
    
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
    public User addUserAddress(Long userId, AddressRequest addressRequest) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + userId));
        
        // Tìm xem address này đã tồn tại trong DB chưa
        Optional<Address> existingAddress = addressRepository.findByExactMatch(
                addressRequest.getStreetName(),
                addressRequest.getWardName(),
                addressRequest.getCityName(),
                addressRequest.getCountryName()
        );
        
        Address address;
        if (existingAddress.isPresent()) {
            // Dùng address đã có
            address = existingAddress.get();
            System.out.println("Sử dụng address có sẵn: " + address.getAddressId());
        } else {
            // Tạo mới với retry logic để handle duplicate
            address = createAddressWithRetry(addressRequest, 3);
            System.out.println("Đã tạo address mới: " + address.getAddressId());
        }
        
        // Cập nhật user address
        user.setUserAddress(address);
        
        // Lưu user
        return userRepository.save(user);
    }
    
    /**
     * Tạo address mới với retry logic
     * Nếu bị duplicate thì tìm lại address đã tồn tại
     */
    private Address createAddressWithRetry(AddressRequest request, int maxRetries) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                Address address = new Address();
                address.setStreetName(request.getStreetName());
                address.setWardName(request.getWardName());
                address.setCityName(request.getCityName());
                address.setCountryName(request.getCountryName());
                
                return addressRepository.save(address);
            } catch (Exception e) {
                // Nếu bị duplicate key, tìm lại address
                if (e.getMessage().contains("duplicate key") || 
                    e.getMessage().contains("unique constraint")) {
                    
                    System.out.println("Retry #" + attempt + ": Phát hiện duplicate, tìm address có sẵn...");
                    
                    // Tìm lại address vừa bị duplicate
                    Optional<Address> existing = addressRepository.findByExactMatch(
                        request.getStreetName(),
                        request.getWardName(),
                        request.getCityName(),
                        request.getCountryName()
                    );
                    
                    if (existing.isPresent()) {
                        return existing.get();
                    }
                    
                    // Nếu vẫn không tìm thấy và còn retry, thử lại
                    if (attempt < maxRetries) {
                        try {
                            Thread.sleep(100); // Đợi 100ms trước khi retry
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                        continue;
                    }
                }
                
                // Nếu không phải duplicate error hoặc hết retry
                throw new RuntimeException("Không thể tạo address sau " + attempt + " lần thử: " + e.getMessage(), e);
            }
        }
        
        throw new RuntimeException("Không thể tạo address sau " + maxRetries + " lần thử");
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
}
