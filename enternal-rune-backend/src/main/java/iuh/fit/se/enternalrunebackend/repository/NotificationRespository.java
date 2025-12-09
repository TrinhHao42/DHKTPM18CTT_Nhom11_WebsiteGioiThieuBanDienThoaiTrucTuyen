package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRespository extends JpaRepository<Notification, Long> {
    
    // Get all notifications ordered by time (newest first)
    List<Notification> findAllByOrderByNotiTimeDesc();
    
    // Get notifications with pagination
    Page<Notification> findAllByOrderByNotiTimeDesc(Pageable pageable);
    
    // Get unread notifications count
    long countByNotiIsReadFalse();
    
    // Get unread notifications for admin
    List<Notification> findByNotiIsReadFalseAndTargetRoleOrderByNotiTimeDesc(String targetRole);
    
    // Get unread notifications count for admin
    long countByNotiIsReadFalseAndTargetRole(String targetRole);
    
    // Get unread notifications for specific user
    List<Notification> findByNotiIsReadFalseAndNotiUser_UserIdOrderByNotiTimeDesc(Long userId);
    
    // Mark all as read
    @Modifying
    @Query("UPDATE Notification n SET n.notiIsRead = true WHERE n.notiIsRead = false AND n.targetRole = :targetRole")
    int markAllAsReadByTargetRole(@Param("targetRole") String targetRole);
    
    // Mark single notification as read
    @Modifying
    @Query("UPDATE Notification n SET n.notiIsRead = true WHERE n.notiId = :id")
    int markAsRead(@Param("id") Long id);
}
