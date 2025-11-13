package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponse {
    private int imageId;
    private String imageName;
    private String imageData;
}
