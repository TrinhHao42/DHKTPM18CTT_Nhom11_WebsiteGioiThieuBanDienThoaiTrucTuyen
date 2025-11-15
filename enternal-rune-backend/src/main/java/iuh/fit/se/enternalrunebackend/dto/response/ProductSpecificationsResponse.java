package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSpecificationsResponse {
    private String screenSize;
    private String displayTech;
    private String rearCamera;
    private String frontCamera;
    private String chipset;
    private String nfcTech;
    private String ram;
    private String storage;
    private String battery;
    private String th_sim;
    private String os;
    private String resolution;
    private String displayFeatures;
    private String cpuType;
}
