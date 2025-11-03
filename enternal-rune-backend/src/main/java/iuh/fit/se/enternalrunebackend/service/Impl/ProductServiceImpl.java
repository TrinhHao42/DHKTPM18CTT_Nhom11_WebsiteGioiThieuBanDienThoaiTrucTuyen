//package iuh.fit.se.enternalrunebackend.service.Impl;
//
//import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;
//import iuh.fit.se.enternalrunebackend.repository.BrandRepository;
//import iuh.fit.se.enternalrunebackend.repository.ProductRepository;
//import iuh.fit.se.enternalrunebackend.service.ProductService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import iuh.fit.se.enternalrunebackend.entity.Product;
//import iuh.fit.se.enternalrunebackend.entity.ProductPrice;
//import jakarta.persistence.criteria.Join;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class ProductServiceImpl implements ProductService {
//
//
//    @Override
//    public List<Product> getAllProductsWithActivePrice() {
//        return productRepository.findAllWithActivePrice();
//    }
//
//    @Override
//    public List<Product> getFeaturedProducts(int limit) {
//        Pageable pageable = PageRequest.of(0, limit);
//        return productRepository.findFeaturedProducts(pageable);
//    }
//
//    @Override
//    public List<Product> getProductsByBrand(String brandName, int limit) {
//        return productRepository.findProductsByBrand(brandName, limit);
//    }
//
//    @Override
//    public Page<Product> filterProducts(
//            List<Integer> brands,
//            List<String> priceRanges,
//            List<String> colors,
//            List<String> memory,
//            int page,
//            int size
//    ) {
//        Specification<Product> spec = Specification.allOf();
//
//        // 🔹 Filter theo brand ID (ManyToOne)
//        if (brands != null && !brands.isEmpty()) {
//            spec = spec.and((root, query, cb) ->
//                    root.get("prodBrand").get("brandId").in(brands)
//            );
//        }
//
//        // 🔹 Filter theo màu sắc (ElementCollection)
//        if (colors != null && !colors.isEmpty()) {
//            spec = spec.and((root, query, cb) -> {
//                Join<Object, Object> colorJoin = root.join("prodColor");
//                return colorJoin.in(colors);
//            });
//        }
//
//        // 🔹 Filter theo bộ nhớ (ElementCollection - prodVersion)
//        if (memory != null && !memory.isEmpty()) {
//            spec = spec.and((root, query, cb) -> {
//                Join<Object, Object> versionJoin = root.join("prodVersion");
//                return versionJoin.in(memory);
//            });
//        }
//
//        // 🔹 Filter theo khoảng giá (OneToMany - productPrices)
//        if (priceRanges != null && !priceRanges.isEmpty()) {
//            spec = spec.and((root, query, cb) -> {
//                Join<Product, ProductPrice> priceJoin = root.join("productPrices");
//                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
//
//                for (String range : priceRanges) {
//                    switch (range) {
//                        case "under-5m" -> predicates.add(cb.lessThan(priceJoin.get("ppPrice"), 5_000_000));
//                        case "5m-10m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 5_000_000, 10_000_000));
//                        case "10m-15m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 10_000_000, 15_000_000));
//                        case "15m-20m" -> predicates.add(cb.between(priceJoin.get("ppPrice"), 15_000_000, 20_000_000));
//                        case "over-20m" -> predicates.add(cb.greaterThan(priceJoin.get("ppPrice"), 20_000_000));
//                    }
//                }
//
//                return cb.or(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
//            });
//        }
//
//
//        // 🔹 Loại bỏ trùng sản phẩm nếu có join
//        Specification<Product> finalSpec = spec;
//        Specification<Product> distinctSpec = (root, query, cb) -> {
//            query.distinct(true);
//            return finalSpec.toPredicate(root, query, cb);
//        };
//
//        Pageable pageable = PageRequest.of(page, size);
//        return productRepository.findAll(distinctSpec, pageable);
//    }
//    @Autowired
//    private ProductRepository productRepository;
//    @Autowired
//    private BrandRepository brandRepository;
//    @Override
//    public ProductDashboardResponse getProductDashboard() {
//        LocalDate now = LocalDate.now();
//        int year = now.getYear();
//        int month = now.getMonthValue();
//
//        // Tháng trước
//        int prevMonth = (month == 1) ? 12 : month - 1;
//        int prevYear = (month == 1) ? year - 1 : year;
//
//        //Tổng sản phẩm
//        long totalProducts = productRepository.countTotalProducts();
//        long totalThisMonth = productRepository.countProductsByMonth(year, month);
//        long totalPrevMonth = productRepository.countProductsByMonth(prevYear, prevMonth);
//        double totalChange = calcChangePercent(totalThisMonth, totalPrevMonth);
//
//        // Tổng danh mục
////        long totalBrand = brandRepository.countTotalBrands();
////        long catThisMonth = brandRepository.countBrandsByMonth(year, month);
////        long catPrevMonth = brandRepository.countBrandsByMonth(prevYear, prevMonth);
////        double catChange = calcChangePercent(catThisMonth, catPrevMonth);
//
//        //Còn hàng
//        long available = productRepository.countAvailableProducts();
//        double availableChange = calcChangePercent(available, available * 0.92);
//
//        //Hết hàng
//        long outOfStock = productRepository.countOutOfStockProducts();
//        double outOfStockChange = calcChangePercent(outOfStock, outOfStock * 1.023);
//        return new ProductDashboardResponse(
//                totalProducts, totalChange,
//                totalProducts, catChange,
//                available, availableChange,
//                outOfStock, outOfStockChange
//        );
//    }
//    private double calcChangePercent(Number current, Number previous) {
//        if (previous == null || previous.doubleValue() == 0)
//            return current.doubleValue() > 0 ? 100.0 : 0.0;
//        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100.0;
//    }
//
//}
