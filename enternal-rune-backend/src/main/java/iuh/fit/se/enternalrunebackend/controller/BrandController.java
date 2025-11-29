package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.BrandRequest;
import iuh.fit.se.enternalrunebackend.dto.response.BrandDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandStatisticResponse;
import iuh.fit.se.enternalrunebackend.entity.Brand;
import iuh.fit.se.enternalrunebackend.entity.Message;
import iuh.fit.se.enternalrunebackend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép gọi từ frontend (React, v.v.)
public class BrandController {
    private final BrandService brandService;

    @GetMapping("/names")
    public List<BrandResponse> getDistinctBrandNames() {
        return brandService.getDistinctBrandNames();
    }
    @GetMapping("/dashboard")
    public Page<BrandDashboardListResponse> getBrandDashboard(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        return brandService.getBrands(keyword, PageRequest.of(page, size));
    }
    @PostMapping("/dashboard/add")
    public ResponseEntity<String> addBrand(@RequestBody BrandRequest brandRequest){
        try {
            brandService.addBrand(brandRequest);
            return ResponseEntity.ok("Thêm thương hiệu thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/dashboard/delete/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable Integer id) {
        try {
            brandService.deleteBrandById(id);
            return ResponseEntity.ok("Xóa thương hiệu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/dashboard/update/{id}")
    public ResponseEntity<String> updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandRequest brandRequest) {
        try {
            brandService.updateBrand(id, brandRequest);
            return ResponseEntity.ok("Cập nhật thương hiệu thành công");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    @GetMapping("/dashboard/statistics")
    public BrandStatisticResponse getStatistics() {
        return brandService.getBrandStatistics();
    }
    @GetMapping("/dashboard/{id}")
    public Brand getBrandById(@PathVariable Integer id) {
        return brandService.getBrandById(id);
    }
}
