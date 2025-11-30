package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.Address;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AddressResponse {
    int addressId;
    String streetName;
    String wardName;
    String cityName;
    String countryName;

    public static AddressResponse toAddressResponse(Address address) {
        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .streetName(address.getStreetName())
                .wardName(address.getWardName())
                .cityName(address.getCityName())
                .countryName(address.getCountryName())
                .build();
    }
}
