package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.DiscountRequest;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountResponse;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountStatisticResponse;
import iuh.fit.se.enternalrunebackend.entity.Discount;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.enums.ValueType;
import iuh.fit.se.enternalrunebackend.repository.DiscountRepository;
import iuh.fit.se.enternalrunebackend.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    @Override
    public DiscountResponse create(DiscountRequest req) {

        if (discountRepository.existsByDiscountCode(req.getDiscountCode())) {
            throw new RuntimeException("Code đã tồn tại");
        }

        Discount d = Discount.builder()
                .discountName(req.getDiscountName())
                .discountCode(req.getDiscountCode())
                .discountTargetType(req.getDiscountTargetType())
                .discountValueType(req.getDiscountValueType())
                .discountValue(req.getDiscountValue())
                .discountMaxAmount(req.getDiscountMaxAmount())
                .discountStartDate(req.getDiscountStartDate())
                .discountEndDate(req.getDiscountEndDate())
                .discountQuantityLimit(req.getDiscountQuantityLimit())
                .discountActive(req.isDiscountActive())
                .build();

        d.setDiscountQuantityLimit(req.getDiscountQuantityLimit());

        Discount saved = discountRepository.save(d);
        return mapToResponse(saved);
    }

    @Override
    public DiscountResponse update(int id, DiscountRequest req) {
        Discount d = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy discount"));
        d.setDiscountName(req.getDiscountName());
        d.setDiscountCode(req.getDiscountCode());
        d.setDiscountTargetType(req.getDiscountTargetType());
        d.setDiscountValueType(req.getDiscountValueType());
        d.setDiscountValue(req.getDiscountValue());
        d.setDiscountMaxAmount(req.getDiscountMaxAmount());
        d.setDiscountStartDate(req.getDiscountStartDate());
        d.setDiscountEndDate(req.getDiscountEndDate());
        d.setDiscountQuantityLimit(req.getDiscountQuantityLimit());
        d.setDiscountActive(req.isDiscountActive());

        return mapToResponse(discountRepository.save(d));
    }

    @Override
    public Page<DiscountResponse> getAll(String keyword, String status, int page, int size) {
        Page<Discount> p = discountRepository.findAll(PageRequest.of(page, size));

        return new PageImpl<>(
                p.getContent().stream()
                        .map(this::mapToResponse)
                        .filter(d -> filterByKeyword(d, keyword))
                        .filter(d -> filterByStatus(d, status))
                        .collect(Collectors.toList()),
                PageRequest.of(page, size),
                p.getTotalElements()
        );
    }

    private boolean filterByKeyword(DiscountResponse d, String keyword) {
        if (keyword == null || keyword.isEmpty()) return true;
        return d.getDiscountCode().toLowerCase().contains(keyword.toLowerCase()) ||
                d.getDiscountName().toLowerCase().contains(keyword.toLowerCase());
    }

    private boolean filterByStatus(DiscountResponse d, String status) {
        if (status == null || status.equals("all")) return true;

        LocalDate now = LocalDate.now();

        switch (status) {
            case "active" -> {
                return d.isDiscountActive() &&
                        now.isAfter(d.getDiscountStartDate()) &&
                        now.isBefore(d.getDiscountEndDate());
            }
            case "expired" -> {
                return now.isAfter(d.getDiscountEndDate());
            }
            case "scheduled" -> {
                return now.isBefore(d.getDiscountStartDate());
            }
            default -> {
                return true;
            }
        }
    }

    @Override
    public DiscountResponse getById(int id) {
        Discount d = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy discount"));
        return mapToResponse(d);
    }

    @Override
    public void delete(int id) {
        discountRepository.deleteById(id);
    }

    private DiscountResponse mapToResponse(Discount d) {
        long used = d.getOrders() == null ? 0 : d.getOrders().size();
        int percent = d.getDiscountQuantityLimit() == 0 ? 0 :
                (int) ((double) used / d.getDiscountQuantityLimit() * 100);

        return DiscountResponse.builder()
                .discountId(d.getDiscountId())
                .discountName(d.getDiscountName())
                .discountCode(d.getDiscountCode())
                .discountTargetType(d.getDiscountTargetType())
                .discountValueType(d.getDiscountValueType())
                .discountValue(d.getDiscountValue())
                .discountMaxAmount(d.getDiscountMaxAmount())
                .discountStartDate(d.getDiscountStartDate())
                .discountEndDate(d.getDiscountEndDate())
                .discountQuantityLimit(d.getDiscountQuantityLimit())
                .usedQuantity(used)
                .discountActive(d.isDiscountActive())
                .usedPercent(percent)
                .build();
    }

    private double calculateDiscountAmount(Order order) {
        if (order.getDiscount() == null) return 0;

        var d = order.getDiscount();
        double total = order.getOrderTotalAmount().doubleValue();
        double discountValue = d.getDiscountValue();
        double max = d.getDiscountMaxAmount();

        double amount = 0;

        if (d.getDiscountValueType().equals(ValueType.PERCENT)) {
            amount = total * (discountValue / 100.0);

            if (max > 0) amount = Math.min(amount, max);
        } else {
            amount = discountValue;
        }
        return amount;
    }
    @Override
    public DiscountStatisticResponse getStatistics() {

        List<Discount> discounts = discountRepository.findAll();

        long total = discounts.size();

        long active = discounts.stream()
                .filter(d ->
                        d.isDiscountActive() &&
                                !LocalDate.now().isBefore(d.getDiscountStartDate()) &&
                                !LocalDate.now().isAfter(d.getDiscountEndDate())
                )
                .count();

        long used = discounts.stream()
                .mapToLong(d -> d.getOrders().size())
                .sum();

        // Tính tổng tiền giảm
        double totalDiscountAmount = discounts.stream()
                .flatMap(d -> d.getOrders().stream())
                .mapToDouble(this::calculateDiscountAmount)
                .sum();
        return DiscountStatisticResponse.builder()
                .totalDiscounts(total)
                .activeDiscounts(active)
                .usedCount(used)
                .totalDiscountAmount(totalDiscountAmount)
                .build();
    }


}
