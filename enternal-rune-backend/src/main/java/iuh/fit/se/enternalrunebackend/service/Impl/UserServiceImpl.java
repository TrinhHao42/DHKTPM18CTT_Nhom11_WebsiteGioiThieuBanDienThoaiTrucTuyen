package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.AddressRequestDTO;
import iuh.fit.se.enternalrunebackend.dto.request.UserRequestDTO;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponseDTO;
import iuh.fit.se.enternalrunebackend.entity.Address;
import iuh.fit.se.enternalrunebackend.entity.Role;
import iuh.fit.se.enternalrunebackend.entity.User;
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
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
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
