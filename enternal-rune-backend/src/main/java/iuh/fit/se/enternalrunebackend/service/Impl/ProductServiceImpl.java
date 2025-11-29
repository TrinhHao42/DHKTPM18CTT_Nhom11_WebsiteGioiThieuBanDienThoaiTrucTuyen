package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.ImageRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProductPriceRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProductRequest;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.PriceStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ProductStatus;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.ImageService;
import iuh.fit.se.enternalrunebackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;

import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private ProductPriceRepository productPriceRepository;
    @Autowired
    private DiscountRepository discountRepository;
    private final ImageService imageService;
    @Override
    public List<Product> getAllProductsWithActivePrice() {
        return productRepository.findAllWithActivePrice();
    }

    @Override
    public List<Product> getFeaturedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findFeaturedProducts(pageable);
    }

    @Override
    public List<Product> getProductsByBrand(String brandName, int limit) {
        return productRepository.findProductsByBrand(brandName, limit);
    }

    @Override
    public Page<Product> filterProducts(
            List<Integer> brands,
            List<String> priceRanges,
            List<String> colors,
            List<String> memory,
            String search,
            int page,
            int size) {
        Specification<Product> spec = Specification.allOf();

        // 🔹 Filter theo search keyword (product name, model, brand name)
        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                String searchPattern = "%" + search.toLowerCase() + "%";
                List<jakarta.persistence.criteria.Predicate> searchPredicates = new ArrayList<>();

                // Always search in product name, model, description
                searchPredicates.add(cb.like(cb.lower(root.get("prodName")), searchPattern));
                searchPredicates.add(cb.like(cb.lower(root.get("prodModel")), searchPattern));
                searchPredicates.add(cb.like(cb.lower(root.get("prodDescription")), searchPattern));

                // Only search in brand name if no brand filter is applied
                if (brands == null || brands.isEmpty()) {
                    searchPredicates.add(cb.like(cb.lower(root.get("prodBrand").get("brandName")), searchPattern));
                }

                return cb.or(searchPredicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            });
        }

        // 🔹 Filter theo brand ID (ManyToOne)
        if (brands != null && !brands.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("prodBrand").get("brandId").in(brands));
        }

        // 🔹 Filter theo màu sắc (ElementCollection)
        if (colors != null && !colors.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Object, Object> colorJoin = root.join("prodColor");
                return colorJoin.in(colors);
            });
        }

        // 🔹 Filter theo bộ nhớ (ElementCollection - prodVersion)
        if (memory != null && !memory.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Object, Object> versionJoin = root.join("prodVersion");
                return versionJoin.in(memory);
            });
        }

        // 🔹 Filter theo khoảng giá (OneToMany - productPrices)
        if (priceRanges != null && !priceRanges.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Product, ProductPrice> priceJoin = root.join("productPrices");
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

                for (String range : priceRanges) {
                    switch (range) {
                        case "under-5m" -> predicates.add(cb.lessThan(priceJoin.get("ppPrice"), 5_000_000));
                        case "5m-10m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 5_000_000, 10_000_000));
                        case "10m-15m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 10_000_000, 15_000_000));
                        case "15m-20m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 15_000_000, 20_000_000));
                        case "over-20m" -> predicates.add(cb.greaterThan(priceJoin.get("ppPrice"), 20_000_000));
                    }
                }

                return cb.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            });
        }

        // 🔹 Loại bỏ trùng sản phẩm nếu có join
        Specification<Product> finalSpec = spec;
        Specification<Product> distinctSpec = (root, query, cb) -> {
            query.distinct(true);
            return finalSpec.toPredicate(root, query, cb);
        };

        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(distinctSpec, pageable);
    }

    @Override
    public ProductDashboardResponse getProductDashboard() {
        // Tổng sản phẩm
        long totalProducts = productRepository.countTotalProducts();
        // Tổng danh mục
        long totalBrand = brandRepository.countTotalBrands();

        // Còn hàng
        long available = productRepository.countAvailableProducts();
        // Hết hàng
        long outOfStock = productRepository.countOutOfStockProducts();
        return new ProductDashboardResponse(
                totalProducts,
                totalBrand,
                available,
                outOfStock);

    }

    // @Override
    // public Page<ProductDashboardListResponse> getProductDashboardList(Pageable
    // pageable) {
    // // Lấy sản phẩm phân trang
    // Page<Product> products = productRepository.findAll(pageable);
    //
    // // Map từng Product sang DTO
    // return products.map(product -> {
    // ProductDashboardListResponse dto = new ProductDashboardListResponse();
    //
    // // Xử lý images an toàn
    // List<Image> images = product.getImages();
    // if (!images.isEmpty()) {
    // dto.setImageUrl(images.get(0).getImageData());
    // } else {
    // dto.setImageUrl(null); // hoặc ảnh mặc định
    // }
    //
    // dto.setProductName(product.getProdName());
    // dto.setModel(product.getProdModel());
    // dto.setCategory(product.getProdBrand() != null ?
    // product.getProdBrand().getBrandName() : "Unknown");
    //
    // // Xử lý productPrices an toàn
    // List<ProductPrice> prices = product.getProductPrices();
    // if (!prices.isEmpty()) {
    // dto.setPrice(prices.get(0).getPpPrice());
    // } else {
    // dto.setPrice(0.0); // hoặc giá mặc định
    // }
    //
    // dto.setStatus(product.getProductStatus() != null ?
    // product.getProductStatus().name() : "UNKNOWN");
    //
    // return dto;
    // });
    // }
    @Override
    public Page<ProductDashboardListResponse> getProductDashboardList(
            String keyword, String brand, ProductStatus status, Pageable pageable) {
        Page<Product> productsPage = productRepository.searchProducts(keyword, brand, status, pageable);

        List<ProductDashboardListResponse> dtoList = productsPage.getContent().stream().map(product -> {
            ProductDashboardListResponse dto = new ProductDashboardListResponse();

            List<Image> images = product.getImages();
            dto.setProductId(product.getProdId());
            dto.setImageUrl(!images.isEmpty() ? images.get(0).getImageData() : null);
            dto.setProductName(product.getProdName());
            dto.setModel(product.getProdModel());
            dto.setCategory(product.getProdBrand() != null ? product.getProdBrand().getBrandName() : "Unknown");

            List<ProductPrice> prices = product.getProductPrices();
            dto.setPrice(!prices.isEmpty() ? prices.get(0).getPpPrice() : 0.0);

            dto.setStatus(product.getProductStatus() != null ? product.getProductStatus().name() : "UNKNOWN");

            return dto;
        }).toList();

        return new PageImpl<>(dtoList, pageable, productsPage.getTotalElements());
    }

    @Override
    public void addProduct(ProductRequest productRequest,List<MultipartFile> files) throws IOException{
        Product product = new Product();
        product.setProdName(productRequest.getProductName());
        product.setProdModel(productRequest.getProductModel());
        product.setProductStatus(ProductStatus.valueOf(productRequest.getProductStatus()));
        product.setProdDescription(productRequest.getProductDescription());
        product.setProdVersion(productRequest.getProductVersion());
        product.setProdColor(productRequest.getProductColor());
        Brand brand = brandRepository.findById(productRequest.getBrandId())
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại"));
        product.setProdBrand(brand);

        // Upload ảnh lên Cloudinary và lưu URL
        List<Image> imageEntities = new ArrayList<>();
        for (MultipartFile file : files) {
            String imageUrl = imageService.upload(file.getBytes(), file.getOriginalFilename());
            Image img = new Image();
            img.setImageName(file.getOriginalFilename());
            img.setImageData(imageUrl);
            imageEntities.add(img);
        }
        product.setImages(imageEntities);
        List<ProductPrice> prices = productRequest.getProductPrices().stream().map(pr -> {
            ProductPrice pp = new ProductPrice();
            pp.setPpPrice(pr.getPpPrice());
            return pp;
        }).toList();
        product.setProductPrices(prices);
        productRepository.save(product);
    }

    @Override
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
        productRepository.delete(product);
    }

    @Override
    public Product updateProduct(Integer productId, ProductRequest request,List<MultipartFile> newFiles) throws IOException {
        /*Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));*/
        Product product = getProductById(productId);
        // Cập nhật những field cần thiết
        if (request.getProductName() != null)
            product.setProdName(request.getProductName());
        if (request.getProductModel() != null)
            product.setProdModel(request.getProductModel());
        if (request.getProductStatus() != null)
            product.setProductStatus(ProductStatus.valueOf(request.getProductStatus()));
        if (request.getProductDescription() != null)
            product.setProdDescription(request.getProductDescription());
        if (request.getProductVersion() != null)
            product.setProdVersion(request.getProductVersion());
        if (request.getProductColor() != null)
            product.setProdColor(request.getProductColor());

        // Cập nhật Brand nếu có
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
            product.setProdBrand(brand);
        }
        // Images: xóa cũ + thêm mới nếu có
        if (request.getImages() != null) {
            imageRepository.deleteAll(product.getImages());
            List<Image> images = new ArrayList<>();
            for (ImageRequest ir : request.getImages()) {
                Image img = new Image();
                img.setImageName(ir.getImageName());
                img.setImageData(ir.getImageData());
                // img.setProduct(product);
                images.add(imageRepository.save(img));
            }
            product.setImages(images);
        }
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                String url = imageService.upload(file.getBytes(), file.getOriginalFilename());

                Image img = new Image();
                img.setImageName(file.getOriginalFilename());
                img.setImageData(url);

                imageRepository.save(img);
                product.getImages().add(img);
            }
        }
        // ProductPrice: xóa cũ + thêm mới nếu có
        if (request.getProductPrices() != null) {
            productPriceRepository.deleteAll(product.getProductPrices());
            List<ProductPrice> prices = new ArrayList<>();
            for (ProductPriceRequest pr : request.getProductPrices()) {
                ProductPrice price = new ProductPrice();
                price.setPpPrice(pr.getPpPrice());
                // price.setPpPriceStatus(pr.getPpPriceStatus());
                // price.setPpStartDate(pr.getPpStartDate());
                // price.setPpEndDate(pr.getPpEndDate());
                // price.setProduct(product);
                prices.add(productPriceRepository.save(price));
            }
            product.setProductPrices(prices);
        }
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }
}
