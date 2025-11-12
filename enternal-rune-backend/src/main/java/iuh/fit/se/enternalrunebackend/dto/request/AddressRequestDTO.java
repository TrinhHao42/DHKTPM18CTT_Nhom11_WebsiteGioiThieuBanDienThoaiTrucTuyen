package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddressRequestDTO {
    private String street;
    private String ward;
    private String city;
    private String country;
}
