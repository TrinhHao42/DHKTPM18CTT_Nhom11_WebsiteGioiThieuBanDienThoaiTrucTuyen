package iuh.fit.se.enternalrunebackend.dto.request;

import iuh.fit.se.enternalrunebackend.entity.enums.TargetType;
import iuh.fit.se.enternalrunebackend.entity.enums.ValueType;
import lombok.*;
import jakarta.validation.constraints.*; // Import các annotation validation

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DiscountRequest {

    // 1. Mã và Tên (Required, Kích thước)
    @NotBlank(message = "Tên mã giảm giá không được để trống.")
    @Size(max = 100, message = "Tên mã giảm giá không được vượt quá 100 ký tự.")
    private String discountName;

    @NotBlank(message = "Mã giảm giá (Code) không được để trống.")
    @Size(min = 4, max = 20, message = "Mã giảm giá phải có từ 4 đến 20 ký tự.")
    // Thường cần regex để đảm bảo chỉ chứa chữ hoa, số, gạch ngang/dưới.
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "Mã giảm giá chỉ chấp nhận chữ hoa, số và ký tự '-' '_'")
    private String discountCode;

    // 2. Enum Types (Không cần @NotNull nếu TargetType/ValueType luôn có giá trị mặc định,
    // nhưng nên dùng để bắt lỗi nếu client không gửi)
    @NotNull(message = "Loại mục tiêu giảm giá không được để trống.")
    private TargetType discountTargetType;
    @NotNull(message = "Loại giá trị giảm giá không được để trống.")
    private ValueType discountValueType;
    // 3. Giá trị giảm giá
    @Min(value = 1, message = "Giá trị giảm giá phải lớn hơn 0.")
    private double discountValue;

    // Giảm tối đa (Chỉ áp dụng cho PERCENT, nhưng vẫn cần validate không âm)
    @Min(value = 0, message = "Giá trị giảm tối đa không được âm.")
    private double discountMaxAmount;
    // 4. Ngày tháng
    @NotNull(message = "Ngày bắt đầu không được để trống.")
    private LocalDate discountStartDate;

    @NotNull(message = "Ngày kết thúc không được để trống.")
    // Note: Validation về logic (startDate <= endDate) phải được xử lý bằng custom annotation hoặc trong service.
    private LocalDate discountEndDate;

    // 5. Giới hạn số lượng
    @Min(value = 1, message = "Số lượng sử dụng tối đa phải lớn hơn hoặc bằng 1.")
    private long discountQuantityLimit;

    // 6. Trạng thái
    @NotNull(message = "Trạng thái kích hoạt không được để trống.")
    private boolean discountActive;
}