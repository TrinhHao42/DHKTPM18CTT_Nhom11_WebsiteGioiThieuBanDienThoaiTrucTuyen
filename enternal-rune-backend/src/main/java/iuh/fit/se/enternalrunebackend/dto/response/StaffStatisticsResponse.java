package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffStatisticsResponse {
    private Integer totalStaff;
    private Integer totalStaffActivated;
    private Integer totalStaffNotActivated;
    private Double   presenceRate;
}
