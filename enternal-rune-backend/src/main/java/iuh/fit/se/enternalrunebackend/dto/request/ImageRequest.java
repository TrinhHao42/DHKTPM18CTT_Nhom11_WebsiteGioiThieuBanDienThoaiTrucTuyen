package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {
    private String imageName;
    private String imageData;
}
