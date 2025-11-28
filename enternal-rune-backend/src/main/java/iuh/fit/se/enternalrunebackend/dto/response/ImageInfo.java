package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO cho thông tin ảnh trong comment response
 * Bao gồm tất cả thông tin cần thiết để hiển thị ảnh
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageInfo {
    
    private Integer id;
    private String fileName;
    private String url;
    private Long size;
    private Integer displayOrder;
}