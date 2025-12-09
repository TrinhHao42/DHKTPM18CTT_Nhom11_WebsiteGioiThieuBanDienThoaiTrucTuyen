package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.ImageRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProductPriceRequest;
import iuh.fit.se.enternalrunebackend.dto.request.ProductRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
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

import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

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
    @Autowired
    private CommentRepository commentRepository;
    private final ImageService imageService;
    @Override
    public List<Product> getAllProductsWithActivePrice() {
        // Step 1: Get product IDs with active price
        List<Integer> productIds = productRepository.findProductIdsWithActivePrice();
        
        if (productIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        
        // Step 2: Fetch products with main relations (brand, images, specs) - 1 query
        List<Product> products = productRepository.findProductsByIdsWithRelations(productIds);
        
        // Step 3: Fetch product prices - 1 query
        productRepository.findProductsByIdsWithPrices(productIds);
        
        // Step 4: Trigger ElementCollection loading (will still be N queries but at least batched)
        products.forEach(p -> {
            if (p.getProdVersion() != null) p.getProdVersion().size();
            if (p.getProdColor() != null) p.getProdColor().size();
        });
        
        return products;
    }
    
    @Override
    public List<ProductResponse> getProductSummaryWithActivePrice() {
        // Step 1: Query only basic product info + brand (1 query)
        List<Object[]> productData = productRepository.findProductSummaryWithActivePrice();
        
        if (productData.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        
        // Extract product IDs
        List<Integer> productIds = productData.stream()
            .map(row -> (Integer) row[0])
            .distinct()
            .toList();
        
        // Step 2: Get images (1 query) - native query returns raw types
        List<Object[]> imagesData = productRepository.findImagesByProductIds(productIds);
        Map<Integer, List<ImageResponse>> imagesMap = new HashMap<>();
        for (Object[] row : imagesData) {
            Integer prodId = ((Number) row[0]).intValue();
            Integer imageId = ((Number) row[1]).intValue();
            String imageName = (String) row[2];
            String imageData = (String) row[3];
            ImageResponse img = new ImageResponse(imageId, imageName, imageData);
            imagesMap.computeIfAbsent(prodId, k -> new ArrayList<>()).add(img);
        }
        
        // Step 3: Get active prices (1 query) - native query
        List<Object[]> pricesData = productRepository.findActivePricesByProductIds(productIds);
        Map<Integer, List<ProductPriceResponse>> pricesMap = new HashMap<>();
        for (Object[] row : pricesData) {
            Integer prodId = ((Number) row[0]).intValue();
            Integer ppId = ((Number) row[1]).intValue();
            Integer ppPrice = ((Number) row[2]).intValue();
            String ppPriceStatus = row[3] != null ? row[3].toString() : null;
            LocalDate ppStartDate = row[4] != null ? ((java.sql.Date) row[4]).toLocalDate() : null;
            LocalDate ppEndDate = row[5] != null ? ((java.sql.Date) row[5]).toLocalDate() : null;
            Integer discountId = row[6] != null ? ((Number) row[6]).intValue() : null;
            String discountName = (String) row[7];
            
            ProductPriceResponse price = new ProductPriceResponse(
                ppId, ppPrice, ppPriceStatus, ppStartDate, ppEndDate, discountId, discountName
            );
            pricesMap.computeIfAbsent(prodId, k -> new ArrayList<>()).add(price);
        }
        
        // Step 4: Get versions and colors (1 query) - JPQL with ElementCollection
        List<Object[]> versionColorData = productRepository.findVersionsAndColorsByProductIds(productIds);
        Map<Integer, List<String>> versionsMap = new HashMap<>();
        Map<Integer, List<String>> colorsMap = new HashMap<>();
        for (Object[] row : versionColorData) {
            Integer prodId = (Integer) row[0];
            versionsMap.put(prodId, (List<String>) row[1]);
            colorsMap.put(prodId, (List<String>) row[2]);
        }
        
        // Step 5: Build ProductResponse objects
        List<ProductResponse> responses = new ArrayList<>();
        for (Object[] row : productData) {
            Integer prodId = (Integer) row[0];
            
            ProductResponse response = new ProductResponse();
            response.setProdId(prodId);
            response.setProdName((String) row[1]);
            response.setProdModel((String) row[2]);
            response.setProductStatus(row[3] != null ? row[3].toString() : null);
            response.setProdDescription((String) row[4]);
            response.setProdRating(row[5] != null ? (Double) row[5] : 0.0);
            
            // Brand
            response.setProdBrand(new BrandResponse((Integer) row[6], (String) row[7]));
            
            // Images
            response.setImages(imagesMap.getOrDefault(prodId, java.util.Collections.emptyList()));
            
            // Prices
            response.setProductPrices(pricesMap.getOrDefault(prodId, java.util.Collections.emptyList()));
            
            // Versions and Colors
            response.setProdVersion(versionsMap.getOrDefault(prodId, java.util.Collections.emptyList()));
            response.setProdColor(colorsMap.getOrDefault(prodId, java.util.Collections.emptyList()));
            
            // No specs, no rating stats for list view
            response.setProdSpecs(null);
            response.setTotalComments(null);
            response.setAverageRating(null);
            response.setRatingDistribution(null);
            
            responses.add(response);
        }
        
        return responses;
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

    @Override
    public Double getAverageRating(Integer productId) {
        return commentRepository.getAverageRating(productId);
    }

    @Override
    public Integer getTotalComments(Integer productId) {
        Long count = commentRepository.countByProductId(productId);
        return count != null ? count.intValue() : 0;
    }

    @Override
    public Map<String, Integer> getRatingDistribution(Integer productId) {
        List<Object[]> results = commentRepository.getRatingDistributionList(productId);
        Map<String, Integer> distribution = new HashMap<>();
        
        // Initialize all ratings to 0
        for (int i = 1; i <= 5; i++) {
            distribution.put(String.valueOf(i), 0);
        }
        
        // Fill in actual counts
        for (Object[] result : results) {
            Integer rating = (Integer) result[0];
            Long count = (Long) result[1];
            if (rating != null && count != null) {
                distribution.put(String.valueOf(rating), count.intValue());
            }
        }
        
        return distribution;
    }
    
    @Override
    public Map<Integer, Double> getAverageRatingsForProducts(List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return new HashMap<>();
        }
        Map<Integer, Double> result = new HashMap<>();
        for (Integer productId : productIds) {
            result.put(productId, commentRepository.getAverageRating(productId));
        }
        return result;
    }
    
    @Override
    public Map<Integer, Integer> getTotalCommentsForProducts(List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return new HashMap<>();
        }
        Map<Integer, Integer> result = new HashMap<>();
        for (Integer productId : productIds) {
            Long count = commentRepository.countByProductId(productId);
            result.put(productId, count != null ? count.intValue() : 0);
        }
        return result;
    }
    
    // ===== OPTIMIZED IMPLEMENTATIONS =====
    
    @Override
    public List<ProductListResponse> getProductListOptimized() {
        List<Object[]> results = productRepository.findProductListOptimized();
        return results.stream().map(row -> new ProductListResponse(
            (Integer) row[0],  // prodId
            (String) row[1],   // prodName
            (String) row[2],   // prodModel
            (String) row[3],   // prodDescription  
            (String) row[4],   // productStatus
            row[5] != null ? ((Number) row[5]).doubleValue() : 0.0, // prodRating
            (Integer) row[6],  // brandId
            (String) row[7],   // brandName
            row[8] != null ? ((Number) row[8]).intValue() : 0, // activePrice
            (String) row[9],   // discountName
            (String) row[10],  // primaryImageUrl
            row[11] != null ? ((Number) row[11]).intValue() : 0, // totalComments
            row[12] != null ? ((Number) row[12]).doubleValue() : 0.0, // averageRating
            (String) row[13]   // availableColors
        )).toList();
    }
    
    @Override
    public List<ProductCardResponse> getFeaturedProductCards(int limit) {
        List<Object[]> results = productRepository.findFeaturedProductsOptimized(limit);
        return results.stream().map(row -> new ProductCardResponse(
            (Integer) row[0],  // prodId
            (String) row[1],   // prodName  
            (String) row[2],   // prodModel
            (String) row[3],   // prodDescription
            row[4] != null ? ((Number) row[4]).doubleValue() : 0.0, // prodRating
            (String) row[5],   // brandName
            row[6] != null ? ((Number) row[6]).intValue() : 0, // currentPrice
            row[7] != null ? ((Number) row[7]).intValue() : 0, // originalPrice
            (String) row[8],   // discountLabel
            (String) row[9],   // imageUrl
            row[10] != null ? ((Number) row[10]).intValue() : 0, // totalComments
            row[11] != null ? ((Number) row[11]).doubleValue() : 0.0, // averageRating
            (String) row[12]   // availableColors
        )).toList();
    }
    
    @Override
    public List<ProductCardResponse> getProductCardsByBrand(String brandName, int limit) {
        List<Object[]> results = productRepository.findProductsByBrandOptimized(brandName, limit);
        return results.stream().map(row -> new ProductCardResponse(
            (Integer) row[0],  // prodId
            (String) row[1],   // prodName  
            (String) row[2],   // prodModel
            (String) row[3],   // prodDescription
            row[4] != null ? ((Number) row[4]).doubleValue() : 0.0, // prodRating
            (String) row[5],   // brandName
            row[6] != null ? ((Number) row[6]).intValue() : 0, // currentPrice
            row[7] != null ? ((Number) row[7]).intValue() : 0, // originalPrice
            (String) row[8],   // discountLabel
            (String) row[9],   // imageUrl
            row[10] != null ? ((Number) row[10]).intValue() : 0, // totalComments
            row[11] != null ? ((Number) row[11]).doubleValue() : 0.0, // averageRating
            (String) row[12]   // availableColors
        )).toList();
    }
    
    @Override
    public Page<ProductListResponse> filterProductsOptimized(
            List<Integer> brands,
            List<String> priceRanges,
            List<String> colors,
            List<String> memory,
            String search,
            int page,
            int size) {
        
        // Convert parameters for native query - use empty arrays instead of null
        Integer[] brandIds = brands != null && !brands.isEmpty() ? 
            brands.toArray(new Integer[0]) : new Integer[0];
        
        String[] colorArray = colors != null && !colors.isEmpty() ? 
            colors.toArray(new String[0]) : new String[0];
        
        // Parse price range
        Integer minPrice = null;
        Integer maxPrice = null;
        if (priceRanges != null && !priceRanges.isEmpty()) {
            String priceRange = priceRanges.get(0); // Take first range
            if (priceRange.contains("-")) {
                String[] parts = priceRange.split("-");
                try {
                    minPrice = Integer.parseInt(parts[0].trim());
                    if (parts.length > 1 && !parts[1].trim().equals("*")) {
                        maxPrice = Integer.parseInt(parts[1].trim());
                    }
                } catch (NumberFormatException e) {
                    // Ignore invalid price range
                }
            }
        }
        
        int offset = page * size;
        
        // Handle empty search string
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        
        // Get filtered results
        List<Object[]> results = productRepository.findProductsFilteredOptimized(
            brandIds, minPrice, maxPrice, colorArray, searchParam, size, offset
        );
        
        // Get total count
        Long totalCount = productRepository.countProductsFilteredOptimized(
            brandIds, minPrice, maxPrice, colorArray, searchParam
        );
        
        // Convert to ProductListResponse
        List<ProductListResponse> content = results.stream().map(row -> new ProductListResponse(
            (Integer) row[0],  // prodId
            (String) row[1],   // prodName
            (String) row[2],   // prodModel
            (String) row[3],   // prodDescription
            (String) row[4],   // productStatus
            row[5] != null ? ((Number) row[5]).doubleValue() : 0.0, // prodRating
            (Integer) row[6],  // brandId
            (String) row[7],   // brandName
            row[8] != null ? ((Number) row[8]).intValue() : 0, // activePrice
            (String) row[9],   // discountName
            (String) row[10],  // primaryImageUrl
            row[11] != null ? ((Number) row[11]).intValue() : 0, // totalComments
            row[12] != null ? ((Number) row[12]).doubleValue() : 0.0, // averageRating
            (String) row[13]   // availableColors
        )).toList();
        
        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(content, pageable, totalCount != null ? totalCount : 0);
    }
}
