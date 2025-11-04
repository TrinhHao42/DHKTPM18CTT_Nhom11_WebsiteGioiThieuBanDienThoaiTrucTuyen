package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.Brand;
import iuh.fit.se.enternalrunebackend.service.ProductService;
import iuh.fit.se.enternalrunebackend.dto.response.ProductResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ImageResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductPriceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép gọi từ frontend (React, v.v.)
public class ProductController {

    private final ProductService productService;

    //Lấy danh sách sản phẩm nổi bật sắp xếp theo rateing top của từng thương hiệu
    @GetMapping("/top-brand")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit) {
        List<Product> products = productService.getFeaturedProducts(limit);
        List<ProductResponse> dto = products.stream().map(this::toDto).toList();
        return ResponseEntity.ok(dto);
    }

    // Lấy danh sách sản phẩm với giá ACTIVE
    @GetMapping("/active-price")
    public List<ProductResponse> getProductsWithActivePrice() {
        List<Product> products = productService.getAllProductsWithActivePrice();
        return products.stream().map(this::toDto).toList();
    }

    // (Tuỳ chọn) Lấy sản phẩm theo ID — chỉ lấy giá ACTIVE
    @GetMapping("/{id}/active-price")
    public ProductResponse getProductWithActivePrice(@PathVariable int id) {
        List<Product> products = productService.getAllProductsWithActivePrice();
        return products.stream()
                .filter(p -> p.getProdId() == id)
                .findFirst()
                .map(this::toDto)
                .orElse(null);
    }

    @GetMapping("/latest")
    public List<ProductResponse> getLatestProductsByBrand(
            @RequestParam(defaultValue = "iPhone") String brand,
            @RequestParam(defaultValue = "4") int limit) {
        List<Product> products = productService.getProductsByBrand(brand, limit);
        return products.stream().map(this::toDto).toList();
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<ProductResponse>> filterProducts(
            @RequestParam(required = false) List<Integer> brands,
            @RequestParam(required = false) List<String> priceRange,
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> memory,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Product> products = productService.filterProducts(brands, priceRange, colors, memory, page, size);
        List<ProductResponse> dtoList = products.getContent().stream().map(this::toDto).toList();
        org.springframework.data.domain.Page<ProductResponse> dtoPage = new org.springframework.data.domain.PageImpl<>(
                dtoList, products.getPageable(), products.getTotalElements()
        );
        return ResponseEntity.ok(dtoPage);
    }

    // --- Mapping helper ---
    private ProductResponse toDto(Product p) {
        BrandResponse brandDto = null;
        Brand b = p.getProdBrand();
        if (b != null) {
            brandDto = new BrandResponse(b.getBrandId(), b.getBrandName());
        }

    List<ImageResponse> images = p.getImages() == null ? java.util.Collections.emptyList() : p.getImages().stream()
        .map(img -> new ImageResponse(img.getImageId(), img.getImageName(), img.getImageData()))
        .toList();

    List<ProductPriceResponse> productPrices = p.getProductPrices() == null ? java.util.Collections.emptyList() : p.getProductPrices().stream()
        .map(pp -> new ProductPriceResponse(
            pp.getPpId(),
            pp.getPpPrice(),
            pp.getPpPriceStatus() == null ? null : pp.getPpPriceStatus().name(),
            pp.getPpStartDate(),
            pp.getPpEndDate(),
            pp.getDiscount() == null ? null : pp.getDiscount().getDiscountId(),
            pp.getDiscount() == null ? null : pp.getDiscount().getDiscountName()
        ))
        .toList();

    return new ProductResponse(
        p.getProdId(),
        p.getProdName(),
        p.getProdModel(),
        p.getProductStatus() == null ? null : p.getProductStatus().name(),
        p.getProdVersion(),
        p.getProdColor(),
        p.getProdDescription(),
        p.getProdRating(),
        brandDto,
        images,
        productPrices
    );
    }

}
