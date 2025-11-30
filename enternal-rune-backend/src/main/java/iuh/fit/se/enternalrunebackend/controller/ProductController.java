package iuh.fit.se.enternalrunebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.enternalrunebackend.dto.request.ProductRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.Brand;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import iuh.fit.se.enternalrunebackend.service.ProductService;
import iuh.fit.se.enternalrunebackend.entity.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Product> products = productService.filterProducts(brands, priceRange, colors, memory, search, page, size);
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

    ProductSpecificationsResponse specsDto = null;
    if (p.getProductSpecifications() != null) {
        ProductSpecifications ps = p.getProductSpecifications();
        specsDto = new ProductSpecificationsResponse(
            ps.getScreenSize(),
            ps.getDisplayTech(),
            ps.getRearCamera(),
            ps.getFrontCamera(),
            ps.getChipset(),
            ps.getNfcTech(),
            ps.getRam(),
            ps.getStorage(),
            ps.getBattery(),
            ps.getTh_sim(),
            ps.getOs(),
            ps.getResolution(),
            ps.getDisplayFeatures(),
            ps.getCpuType()
        );
    }

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
    productPrices,
    specsDto
    );
    }
    @PostMapping(value = "/dashboard/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("images") List<MultipartFile> images
    ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ProductRequest productRequest = mapper.readValue(productJson, ProductRequest.class);

        productService.addProduct(productRequest, images);
        return ResponseEntity.ok("Product created successfully");
    }
    @DeleteMapping("/dashboard/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Xóa sản phẩm thành công");
    }
//    @PutMapping("/dashboard/update/{id}")
//    public Product updateProduct(@PathVariable Integer id, @RequestBody ProductRequest request){
//        return productService.updateProduct(id, request);
//    }
    @PutMapping(value = "/dashboard/update/{id}", consumes = {"multipart/form-data"})
    public Product updateProduct(
            @PathVariable Integer id,
            @RequestPart("data") ProductRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> newFiles) throws IOException {
        return productService.updateProduct(id, request, newFiles);
    }

    @GetMapping("/dashboard/statistics")
    public ProductDashboardResponse getDashboard() {
        return productService.getProductDashboard();
    }
    @GetMapping("/dashboard/list")
// http://localhost:8080/products/dashboard/list?page=0&size=8&keyword=Realme
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
    @GetMapping("/dashboard/{id}")
    public ProductResponse getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return toDto(product);
    }
}
