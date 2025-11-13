package iuh.fit.se.enternalrunebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    Long userId;
    @Column(nullable = false)
    String name;
    @Column(nullable = false, unique = true)
    String email;
    @Column(nullable = false)
    String password;
    @Column(name = "user_active")
    boolean userActive;
    @Column(name = "activate_id")
    private String activateId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AuthProvider authProvider;
    public enum AuthProvider {
        LOCAL, GOOGLE,FACEBOOK
    }
    @ManyToMany(fetch = FetchType.EAGER,cascade = {
            CascadeType.DETACH, CascadeType.MERGE,CascadeType.REFRESH
    })
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id")
    )
    @JsonIgnore
    List<Role> roles;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id")
    Address userAddress;
    @OneToMany(mappedBy = "orHandleBy", cascade = CascadeType.ALL)
    List<OrderRefundRequest> orderRefundRequests;

    @OneToMany(mappedBy = "orderUser", cascade = CascadeType.ALL)
    List<Order> orders;

    @OneToMany(mappedBy = "cmUser", cascade = CascadeType.ALL)
    List<Comment> comments;
    public User(String name, String email, String password, Address userAddress) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.userAddress = userAddress;
    }
}
