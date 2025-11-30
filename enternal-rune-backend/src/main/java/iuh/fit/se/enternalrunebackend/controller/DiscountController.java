package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.DiscountRequest;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountResponse;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountStatisticResponse;
import iuh.fit.se.enternalrunebackend.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    @PostMapping
    public DiscountResponse create(@RequestBody DiscountRequest req) {
        return discountService.create(req);
    }

    @PutMapping("/{id}")
    public DiscountResponse update(@PathVariable int id, @RequestBody DiscountRequest req) {
        return discountService.update(id, req);
    }

    @GetMapping
    public Page<DiscountResponse> getAll(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return discountService.getAll(keyword, status, page, size);
    }

    @GetMapping("/{id}")
    public DiscountResponse getById(@PathVariable int id) {
        return discountService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        discountService.delete(id);
    }

    @GetMapping("/statistics")
    public DiscountStatisticResponse getStatistics() {
        return discountService.getStatistics();
    }

}
