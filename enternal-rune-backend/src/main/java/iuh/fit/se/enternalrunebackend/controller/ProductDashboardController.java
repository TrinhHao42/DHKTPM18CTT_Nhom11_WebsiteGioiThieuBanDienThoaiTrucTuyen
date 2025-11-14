package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;

import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import iuh.fit.se.enternalrunebackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ProductDashboardController {
    private final ProductService productService;
    @GetMapping("/products")
    public ProductDashboardResponse getDashboard() {
        return productService.getProductDashboard();
    }
    @GetMapping("/list")
// http://localhost:8080/api/dashboard/list?page=0&size=8&keyword=iphone&brand=Apple&status=ACTIVE
    public Page<ProductDashboardListResponse> getProductDashboardList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) ProductStatus status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductDashboardList(keyword, brand, status, pageable);
    }



}
