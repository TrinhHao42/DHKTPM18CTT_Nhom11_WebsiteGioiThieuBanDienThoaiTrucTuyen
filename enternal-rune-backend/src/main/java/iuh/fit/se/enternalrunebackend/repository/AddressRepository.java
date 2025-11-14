package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "addresses")
public interface AddressRepository extends JpaRepository<Address,Integer> {
    
    /**
     * Tìm address đã tồn tại với thông tin giống hệt
     */
    @Query("SELECT a FROM Address a WHERE " +
           "a.streetName = :streetName AND " +
           "a.wardName = :wardName AND " +
           "a.cityName = :cityName AND " +
           "a.countryName = :countryName")
    Optional<Address> findByExactMatch(
            @Param("streetName") String streetName,
            @Param("wardName") String wardName,
            @Param("cityName") String cityName,
            @Param("countryName") String countryName
    );
}
