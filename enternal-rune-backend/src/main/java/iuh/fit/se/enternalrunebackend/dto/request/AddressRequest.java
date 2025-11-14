package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddressRequest {
    private String streetName;
    private String wardName;
    private String cityName;
    private String countryName;
}
