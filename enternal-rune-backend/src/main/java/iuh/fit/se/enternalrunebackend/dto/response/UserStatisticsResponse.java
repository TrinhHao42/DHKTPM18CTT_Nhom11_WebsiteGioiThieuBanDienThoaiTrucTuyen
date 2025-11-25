package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsResponse {
    private Integer totalUser;
    private Integer totalUserActivated;
    private Integer totalUserNotActivated;
    private ProviderStatistics providerStatistics;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProviderStatistics {
        private Integer local;
        private Integer google;
    }
}
