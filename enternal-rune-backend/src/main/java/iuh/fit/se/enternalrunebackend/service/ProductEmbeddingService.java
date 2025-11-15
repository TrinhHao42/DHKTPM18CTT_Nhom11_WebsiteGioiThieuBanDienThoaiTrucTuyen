package iuh.fit.se.enternalrunebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pgvector.PGvector;
import iuh.fit.se.enternalrunebackend.dto.ai.SupportProductInfo;
import iuh.fit.se.enternalrunebackend.entity.Product;
import iuh.fit.se.enternalrunebackend.entity.ProductPrice;
import iuh.fit.se.enternalrunebackend.entity.ProductSpecifications;
import iuh.fit.se.enternalrunebackend.entity.enums.PriceStatus;
import iuh.fit.se.enternalrunebackend.repository.BrandRepository;
import iuh.fit.se.enternalrunebackend.repository.ProductRepository;
import iuh.fit.se.enternalrunebackend.repository.ProductSpecificationsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.sql.PreparedStatement;
import java.text.NumberFormat;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductEmbeddingService {

    private static final String INSERT_SQL = """
            INSERT INTO product_embeddings (prod_id, source_text, embedding, updated_at)
            VALUES (?, ?, ?::vector, CURRENT_TIMESTAMP)
            ON CONFLICT (prod_id) DO UPDATE
                SET source_text = EXCLUDED.source_text,
                    embedding = EXCLUDED.embedding,
                    updated_at = CURRENT_TIMESTAMP
            """;

    private static final String SEARCH_SQL = """
            SELECT p.prod_id,
                   p.product_name,
                   COALESCE(b.brand_name, 'Chưa rõ thương hiệu') AS brand_name,
                   price.pp_price,
                   COALESCE(p.product_description, '') AS product_description,
                   COALESCE(ps.battery, '') AS battery_info
            FROM product_embeddings pe
                     JOIN products p ON p.prod_id = pe.prod_id
                     LEFT JOIN brands b ON b.brand_id = p.brand_id
                     LEFT JOIN product_specifications ps ON ps.prod_id = p.prod_id
                     LEFT JOIN LATERAL (
                SELECT pp.pp_price
                FROM product_price pp
                WHERE pp.product_id = p.prod_id
                  AND pp.pp_price_status = 'ACTIVE'
                ORDER BY COALESCE(pp.pp_start_date, DATE '1970-01-01') DESC
                LIMIT 1
            ) price ON TRUE
            ORDER BY pe.embedding <=> ?::vector
            LIMIT ?
            """;

    private final ProductRepository productRepository;
    private final ProductSpecificationsRepository productSpecificationsRepository;
    private final BrandRepository brandRepository;
    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.vertex.ai.gemini.api-key:${spring.ai.google.gemini.api-key:}}")
    private String geminiApiKey;

    @Value("${app.ai.embedding.model:text-embedding-004}")
    private String embeddingModel;

    @Value("${app.ai.embedding.dimension:1536}")
    private int embeddingDimension;

    private static final Pattern BATTERY_PATTERN = Pattern.compile("(\\d{4,5})\\s?mAh", Pattern.CASE_INSENSITIVE);
    private static final Pattern CAMERA_SAU_PATTERN = Pattern.compile("camera\\s*(?:sau|chính|rear)[^0-9]{0,30}(\\d{2,3})\\s?MP", Pattern.CASE_INSENSITIVE);
    private static final Pattern CAMERA_TRUOC_PATTERN = Pattern.compile("camera\\s*(?:trước|selfie|front)[^0-9]{0,30}(\\d{2,3})\\s?MP", Pattern.CASE_INSENSITIVE);
    private static final Pattern CAMERA_GENERIC_PATTERN = Pattern.compile("camera[^0-9]{0,30}(\\d{2,3})\\s?MP", Pattern.CASE_INSENSITIVE);
    private static final Pattern RAM_PATTERN = Pattern.compile("(\\d{1,2})\\s?GB\\s?RAM", Pattern.CASE_INSENSITIVE);
    private static final Pattern STORAGE_PATTERN = Pattern.compile("(\\d{2,3})\\s?GB\\s?(?:ROM|bộ nhớ|storage)", Pattern.CASE_INSENSITIVE);
    private static final Pattern SNAPDRAGON_PATTERN = Pattern.compile("(snapdragon\\s?\\d+(?:\\s?gen\\s?\\d+)?)", Pattern.CASE_INSENSITIVE);

    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.of("vi", "VN"));
    private volatile Map<String, String> normalizedBrandLookup = new HashMap<>();

    public ProductEmbeddingService(ProductRepository productRepository,
                                   ProductSpecificationsRepository productSpecificationsRepository,
                                   BrandRepository brandRepository,
                                   JdbcTemplate jdbcTemplate,
                                   RestTemplateBuilder restTemplateBuilder,
                                   ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.productSpecificationsRepository = productSpecificationsRepository;
        this.brandRepository = brandRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    private void initBrandLookup() {
        refreshBrandLookup();
    }

    @Transactional
    public void rebuildProductEmbeddingsIfEmpty() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM product_embeddings", Integer.class);
        if (count == null || count == 0) {
            rebuildProductEmbeddings();
        } else {
            log.info("Product embeddings đã tồn tại ({} bản ghi), bỏ qua bước rebuild.", count);
        }
    }

    @Transactional
    public void rebuildProductEmbeddings() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.warn("Không thể rebuild embeddings vì chưa cấu hình SPRING_AI_GEMINI_API_KEY.");
            return;
        }

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            log.warn("Không có sản phẩm để tạo embeddings.");
            return;
        }

        Map<Integer, ProductSpecifications> specMap = loadSpecifications(products);
        int success = 0;
        int failed = 0;

        for (Product product : products) {
            try {
                String sourceText = buildSourceText(product, specMap.get(product.getProdId()));
                double[] embedding = fetchEmbeddingVector(sourceText);
                if (embedding == null) {
                    failed++;
                    continue;
                }
                upsertEmbedding(product.getProdId(), sourceText, embedding);
                success++;
            } catch (Exception ex) {
                failed++;
                log.error("Không thể tạo embedding cho sản phẩm {} - {}", product.getProdId(), product.getProdName(), ex);
            }
        }

        log.info("Đã tạo embeddings cho {} sản phẩm, thất bại {}", success, failed);
    }

    @Transactional(readOnly = true)
    public List<SupportProductInfo> searchRelevantProducts(String question, int limit) {
        if (question == null || question.isBlank()) {
            return List.of();
        }
        System.out.println("[EmbeddingSearch] Nhận câu hỏi: " + question);
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.warn("Gemini API key chưa cấu hình nên không thể tìm kiếm theo vector.");
            return List.of();
        }
        SearchIntent intent = detectSearchIntent(question);
        System.out.println("[EmbeddingSearch] Ý định truy vấn: " + intent);
        double[] questionVector = fetchEmbeddingVector(question);
        if (questionVector == null) {
            System.out.println("[EmbeddingSearch] Không tạo được vector cho câu hỏi, trả về rỗng.");
            return List.of();
        }

        try {
            List<SupportProductInfo> rawResults = jdbcTemplate.query(connection -> {
                PreparedStatement ps = connection.prepareStatement(SEARCH_SQL);
                ps.setObject(1, new PGvector(toFloatVector(adjustVector(questionVector))));
                ps.setInt(2, limit);
                return ps;
            }, (rs, rowNum) -> {
                Double price = rs.getObject("pp_price") == null ? null : rs.getDouble("pp_price");
                String battery = rs.getString("battery_info");
                String description = rs.getString("product_description");
                String finalDescription = mergeDescription(description, battery);
                return new SupportProductInfo(
                        rs.getInt("prod_id"),
                        rs.getString("product_name"),
                        rs.getString("brand_name"),
                        price,
                        finalDescription
                );
            });
            System.out.println("[EmbeddingSearch] Số sản phẩm từ vector search: " + rawResults.size());
            List<SupportProductInfo> ranked = applyIntentRanking(rawResults, intent, limit);
            if (!ranked.isEmpty()) {
                System.out.println("[EmbeddingSearch] Sau khi ưu tiên theo intent còn: " + ranked.size());
                return ranked;
            }
            if (intent.hasAnyFilter()) {
                System.out.println("[EmbeddingSearch] Vector search chưa thoả nhu cầu, chuyển sang fallback.");
                return fallbackByIntent(intent, limit);
            }
            return rawResults;
        } catch (Exception ex) {
            log.error("Không thể truy vấn vector search", ex);
            System.out.println("[EmbeddingSearch] Lỗi khi truy vấn vector search: " + ex.getMessage());
            return List.of();
        }
    }

    private Map<Integer, ProductSpecifications> loadSpecifications(List<Product> products) {
        List<Integer> ids = products.stream().map(Product::getProdId).toList();
        List<ProductSpecifications> specs = productSpecificationsRepository.findByProductIds(ids);
        return specs.stream().collect(Collectors.toMap(ps -> ps.getProduct().getProdId(), ps -> ps));
    }

    private String buildSourceText(Product product, ProductSpecifications spec) {
        StringBuilder builder = new StringBuilder();
        builder.append("Tên: ").append(product.getProdName()).append('\n');
        if (product.getProdBrand() != null) {
            builder.append("Thương hiệu: ").append(product.getProdBrand().getBrandName()).append('\n');
        }
        builder.append("Trạng thái: ").append(product.getProductStatus()).append('\n');
        builder.append("Đánh giá: ").append(product.getProdRating()).append('\n');
        Double activePrice = getActivePrice(product);
        builder.append("Giá bán hiện tại: ").append(formatPrice(activePrice)).append('\n');
        appendSegmentTags(builder, activePrice);
        boolean hasSpec = spec != null;
        if (hasSpec) {
            appendIfNotBlank(builder, "Màn hình", spec.getScreenSize(), spec.getDisplayTech(), spec.getDisplayFeatures());
            appendIfNotBlank(builder, "Camera sau", spec.getRearCamera());
            appendIfNotBlank(builder, "Camera trước", spec.getFrontCamera());
            appendIfNotBlank(builder, "Chipset", spec.getChipset());
            if (isHighPerformanceDevice(spec.getChipset())) {
                builder.append("Định vị cấu hình: Cấu hình cao - Snapdragon 8 series hoặc tương đương.\n");
            }
            appendIfNotBlank(builder, "RAM", spec.getRam());
            appendIfNotBlank(builder, "Bộ nhớ", spec.getStorage());
            appendIfNotBlank(builder, "Pin", spec.getBattery());
            appendIfNotBlank(builder, "Hệ điều hành", spec.getOs());
        }
        DescriptionAttributes descriptionAttributes = extractAttributesFromDescription(product.getProdDescription());
        if (!hasSpec || (spec != null && (spec.getRearCamera() == null || spec.getRearCamera().isBlank()))) {
            appendIfNotBlank(builder, "Camera sau (mô tả)", descriptionAttributes.rearCamera());
        }
        if (!hasSpec || (spec != null && (spec.getFrontCamera() == null || spec.getFrontCamera().isBlank()))) {
            appendIfNotBlank(builder, "Camera trước (mô tả)", descriptionAttributes.frontCamera());
        }
        if (!hasSpec || (spec != null && (spec.getBattery() == null || spec.getBattery().isBlank()))) {
            appendIfNotBlank(builder, "Pin (mô tả)", descriptionAttributes.battery());
        }
        if (!hasSpec || (spec != null && (spec.getRam() == null || spec.getRam().isBlank()))) {
            appendIfNotBlank(builder, "RAM (mô tả)", descriptionAttributes.ram());
        }
        if (!hasSpec || (spec != null && (spec.getStorage() == null || spec.getStorage().isBlank()))) {
            appendIfNotBlank(builder, "Bộ nhớ (mô tả)", descriptionAttributes.storage());
        }
        if (!hasSpec || (spec != null && (spec.getChipset() == null || spec.getChipset().isBlank()))) {
            appendIfNotBlank(builder, "Chipset (mô tả)", descriptionAttributes.chipset());
        }
        if (isHighPerformanceDevice(descriptionAttributes.chipset())) {
            builder.append("Định vị cấu hình: Cấu hình cao - Snapdragon 8 series hoặc tương đương.\n");
        }
        descriptionAttributes.highlights().forEach(tag -> builder.append("Thế mạnh: ").append(tag).append('\n'));
        if (product.getProdDescription() != null && !product.getProdDescription().isBlank()) {
            builder.append("Mô tả: ").append(product.getProdDescription());
        }
        return builder.toString();
    }

    private void appendIfNotBlank(StringBuilder builder, String label, String... values) {
        if (values == null) {
            return;
        }
        String joined = Arrays.stream(values)
                .filter(Objects::nonNull)
                .filter(text -> !text.isBlank())
                .collect(Collectors.joining(" - "));
        if (!joined.isBlank()) {
            builder.append(label).append(": ").append(joined).append('\n');
        }
    }

    private String formatPrice(Double price) {
        if (price == null) {
            return "Đang cập nhật";
        }
        return currencyFormat.format(price);
    }

    private Double getActivePrice(Product product) {
        return product.getProductPrices()
                .stream()
                .filter(price -> price.getPpPriceStatus() == PriceStatus.ACTIVE)
                .max(Comparator.comparing(ProductPrice::getPpStartDate, Comparator.nullsLast(LocalDate::compareTo)))
                .map(ProductPrice::getPpPrice)
                .orElse(null);
    }

    private void upsertEmbedding(int productId, String sourceText, double[] vector) {
        jdbcTemplate.update((PreparedStatementCreator) connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL);
            ps.setInt(1, productId);
            ps.setString(2, sourceText);
            ps.setObject(3, new PGvector(toFloatVector(adjustVector(vector))));
            return ps;
        });
    }

    private double[] fetchEmbeddingVector(String text) {
        try {
            String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/%s:embedContent?key=%s"
                    .formatted(embeddingModel, geminiApiKey);

            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("model", "models/" + embeddingModel);
            ObjectNode content = payload.putObject("content");
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text", truncate(text, 6000));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(endpoint, request, JsonNode.class);

            JsonNode values = response.getBody() != null
                    ? response.getBody().path("embedding").path("values")
                    : null;

            if (values == null || !values.isArray() || values.isEmpty()) {
                log.warn("Gemini không trả về embedding hợp lệ.");
                return null;
            }

            double[] vector = new double[values.size()];
            for (int i = 0; i < values.size(); i++) {
                vector[i] = values.get(i).asDouble();
            }
            return vector;
        } catch (Exception ex) {
            log.error("Lỗi gọi Gemini Embedding API", ex);
            return null;
        }
    }

    private String truncate(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        return text.length() <= maxLength ? text : text.substring(0, maxLength);
    }

    private double[] adjustVector(double[] raw) {
        if (raw.length == embeddingDimension) {
            return raw;
        }
        double[] adjusted = new double[embeddingDimension];
        int copyLength = Math.min(raw.length, embeddingDimension);
        System.arraycopy(raw, 0, adjusted, 0, copyLength);
        // phần dư mặc định 0
        return adjusted;
    }

    private String mergeDescription(String description, String battery) {
        StringBuilder builder = new StringBuilder();
        if (description != null && !description.isBlank()) {
            builder.append(description.trim());
        }
        if (battery != null && !battery.isBlank()) {
            if (builder.length() > 0) {
                builder.append("\n");
            }
            builder.append("Pin: ").append(battery);
        }
        return builder.toString();
    }

    private float[] toFloatVector(double[] source) {
        float[] target = new float[embeddingDimension];
        int copyLength = Math.min(source.length, embeddingDimension);
        for (int i = 0; i < copyLength; i++) {
            target[i] = (float) source[i];
        }
        return target;
    }

    private void appendSegmentTags(StringBuilder builder, Double price) {
        if (price == null) {
            return;
        }
        double million = price / 1_000_000d;
        if (million >= 20) {
            builder.append("Phân khúc: flagship\n");
            builder.append("Điểm mạnh flagship: màn hình đẹp, chụp ảnh đẹp, thiết kế cao cấp\n");
        } else if (million >= 14) {
            builder.append("Phân khúc: cận cao cấp\n");
        } else if (million >= 7) {
            builder.append("Phân khúc: tầm trung\n");
        } else {
            builder.append("Phân khúc: giá rẻ\n");
        }
    }

    private boolean isHighPerformanceDevice(String chipset) {
        if (chipset == null || chipset.isBlank()) {
            return false;
        }
        String normalized = chipset.toLowerCase(Locale.ROOT);
        return normalized.contains("snapdragon 8");
    }

    private List<SupportProductInfo> applyIntentRanking(List<SupportProductInfo> results, SearchIntent intent, int limit) {
        if (results.isEmpty() || intent.isEmpty()) {
            return results;
        }
        System.out.println("[EmbeddingSearch] Áp dụng ưu tiên brand/giá cho " + results.size() + " sản phẩm.");
        List<SupportProductInfo> remaining = new ArrayList<>(results);
        List<SupportProductInfo> prioritized = new ArrayList<>();

        if (!intent.brandNames().isEmpty()) {
            List<SupportProductInfo> brandMatches = remaining.stream()
                    .filter(info -> matchesBrand(intent, info.brand()))
                    .collect(Collectors.toList());
            prioritized.addAll(brandMatches);
            remaining.removeAll(brandMatches);
        }

        if (intent.hasPriceRange()) {
            List<SupportProductInfo> priceMatches = remaining.stream()
                    .filter(info -> matchesPrice(intent, info.price()))
                    .collect(Collectors.toList());
            prioritized.addAll(priceMatches);
            remaining.removeAll(priceMatches);
        }

        prioritized.addAll(remaining);
        return prioritized.stream().limit(limit).collect(Collectors.toList());
    }

    private boolean matchesBrand(SearchIntent intent, String brand) {
        if (brand == null || brand.isBlank()) {
            return false;
       
        }
        String normalizedBrand = normalizeText(brand);
        return intent.normalizedBrandNames().contains(normalizedBrand);
    }

    private boolean matchesPrice(SearchIntent intent, Double price) {
        if (price == null) {
            return false;
        }
        double priceInMillions = price / 1_000_000d;
        if (intent.minPriceMillions() != null && priceInMillions < intent.minPriceMillions()) {
            return false;
        }
        if (intent.maxPriceMillions() != null && priceInMillions > intent.maxPriceMillions()) {
            return false;
        }
        return true;
    }

    private List<SupportProductInfo> fallbackByIntent(SearchIntent intent, int limit) {
        if (intent.brandNames().isEmpty()) {
            return List.of();
        }
        System.out.println("[EmbeddingSearch] Fallback theo brand: " + intent.brandNames());
        List<SupportProductInfo> collected = new ArrayList<>();
        for (String brand : intent.brandNames()) {
            List<Product> products = productRepository.findProductsByBrand("%" + brand + "%", limit * 2);
            for (Product product : products) {
                Double price = getActivePrice(product);
                if (intent.hasPriceRange() && !matchesPrice(intent, price)) {
                    continue;
                }
                collected.add(new SupportProductInfo(
                        product.getProdId(),
                        product.getProdName(),
                        product.getProdBrand() != null ? product.getProdBrand().getBrandName() : brand,
                        price,
                        product.getProdDescription()
                ));
                if (collected.size() >= limit) {
                    return collected;
                }
            }
        }
        System.out.println("[EmbeddingSearch] Fallback thu được " + collected.size() + " sản phẩm.");
        return collected;
    }

    private SearchIntent detectSearchIntent(String question) {
        String normalizedQuestion = normalizeText(question);
        Map<String, String> brandLookup = getBrandLookup();
        Set<String> matchedOriginalNames = new LinkedHashSet<>();
        Set<String> matchedNormalizedNames = new LinkedHashSet<>();
        for (Map.Entry<String, String> entry : brandLookup.entrySet()) {
            if (normalizedQuestion.contains(entry.getKey())) {
                matchedNormalizedNames.add(entry.getKey());
                matchedOriginalNames.add(entry.getValue());
            }
        }
        PriceRange range = inferPriceRange(normalizedQuestion);
        return new SearchIntent(matchedOriginalNames, matchedNormalizedNames, range.min(), range.max());
    }

    private PriceRange inferPriceRange(String normalizedQuestion) {
        Double min = null;
        Double max = null;
        if (normalizedQuestion.contains("flagship") || normalizedQuestion.contains("cao cap")) {
            min = 20d;
        }
        if (normalizedQuestion.contains("can cao cap")) {
            min = 14d;
            max = 19d;
        }
        if (normalizedQuestion.contains("tam trung")) {
            min = 7d;
            max = 13d;
        }
        if (normalizedQuestion.contains("gia re")) {
            min = null;
            max = 7d;
        }

        Matcher betweenMatcher = Pattern.compile("(\\d{1,2}(?:[.,]\\d+)?)\\s*(?:-|den|toi|to)\\s*(\\d{1,2}(?:[.,]\\d+)?)")
                .matcher(normalizedQuestion);
        if (betweenMatcher.find()) {
            min = parseMillions(betweenMatcher.group(1));
            max = parseMillions(betweenMatcher.group(2));
        }

        Matcher lessMatcher = Pattern.compile("(?:duoi|<)\\s*(\\d{1,2}(?:[.,]\\d+)?)").matcher(normalizedQuestion);
        if (lessMatcher.find()) {
            max = parseMillions(lessMatcher.group(1));
        }

        Matcher greaterMatcher = Pattern.compile("(?:tren|>)\\s*(\\d{1,2}(?:[.,]\\d+)?)").matcher(normalizedQuestion);
        if (greaterMatcher.find()) {
            min = parseMillions(greaterMatcher.group(1));
        }

        if (normalizedQuestion.contains("14") && normalizedQuestion.contains("19")) {
            min = 14d;
            max = 19d;
        }

        return new PriceRange(min, max);
    }

    private double parseMillions(String raw) {
        double value = Double.parseDouble(raw.replace(',', '.'));
        if (value > 300) {
            return value / 1_000_000d;
        }
        return value;
    }

    private Map<String, String> getBrandLookup() {
        if (normalizedBrandLookup.isEmpty()) {
            refreshBrandLookup();
        }
        return normalizedBrandLookup;
    }

    private synchronized void refreshBrandLookup() {
        normalizedBrandLookup = brandRepository.findAll().stream()
                .filter(brand -> brand.getBrandName() != null)
                .collect(Collectors.toMap(
                        brand -> normalizeText(brand.getBrandName()),
                        brand -> brand.getBrandName(),
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }

    private String normalizeText(String text) {
        if (text == null) {
            return "";
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT);
        return normalized.replaceAll("\\s+", " ").trim();
    }

    private DescriptionAttributes extractAttributesFromDescription(String description) {
        if (description == null || description.isBlank()) {
            return DescriptionAttributes.EMPTY;
        }
        String battery = matchNumberWithSuffix(BATTERY_PATTERN, description, "mAh");
        String rearCamera = matchNumberWithSuffix(CAMERA_SAU_PATTERN, description, "MP");
        String frontCamera = matchNumberWithSuffix(CAMERA_TRUOC_PATTERN, description, "MP");
        if (rearCamera == null) {
            rearCamera = matchNumberWithSuffix(CAMERA_GENERIC_PATTERN, description, "MP");
        }
        String ram = matchNumberWithSuffix(RAM_PATTERN, description, "GB RAM");
        String storage = matchNumberWithSuffix(STORAGE_PATTERN, description, "GB");
        String chipset = matchFirstGroup(SNAPDRAGON_PATTERN, description);

        List<String> highlights = new ArrayList<>();
        addBatteryHighlight(battery, highlights);
        addCameraHighlight(rearCamera, highlights);
        addPerformanceHighlight(ram, chipset, highlights);

        return new DescriptionAttributes(
                battery,
                rearCamera,
                frontCamera,
                ram,
                storage,
                chipset,
                highlights
        );
    }

    private void addBatteryHighlight(String battery, List<String> highlights) {
        if (battery == null) {
            return;
        }
        Integer capacity = extractLeadingNumber(battery);
        if (capacity != null && capacity >= 5000) {
            highlights.add("Pin trâu " + capacity + "mAh, dùng cả ngày dài.");
        }
    }

    private void addCameraHighlight(String camera, List<String> highlights) {
        if (camera == null) {
            return;
        }
        Integer resolution = extractLeadingNumber(camera);
        if (resolution != null && resolution >= 50) {
            highlights.add("Camera " + resolution + "MP chụp ảnh sắc nét, phù hợp chụp đêm.");
        }
    }

    private void addPerformanceHighlight(String ram, String chipset, List<String> highlights) {
        Integer ramValue = extractLeadingNumber(ram);
        if (ramValue != null && ramValue >= 12) {
            highlights.add("RAM lớn cho khả năng đa nhiệm và chơi game mượt mà.");
        }
        if (isHighPerformanceDevice(chipset)) {
            highlights.add("Chip Snapdragon 8 series mang lại hiệu năng flagship.");
        }
    }

    private Integer extractLeadingNumber(String text) {
        if (text == null) {
            return null;
        }
        Matcher matcher = Pattern.compile("(\\d+)").matcher(text);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return null;
    }

    private String matchNumberWithSuffix(Pattern pattern, String text, String suffix) {
        String number = matchFirstGroup(pattern, text);
        if (number == null) {
            return null;
        }
        return number + (suffix.startsWith(" ") ? suffix : " " + suffix).trim();
    }

    private String matchFirstGroup(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private record DescriptionAttributes(
            String battery,
            String rearCamera,
            String frontCamera,
            String ram,
            String storage,
            String chipset,
            List<String> highlights
    ) {
        private static final DescriptionAttributes EMPTY =
                new DescriptionAttributes(null, null, null, null, null, null, List.of());
    }

    private record PriceRange(Double min, Double max) { }

    private record SearchIntent(Set<String> brandNames,
                                Set<String> normalizedBrandNames,
                                Double minPriceMillions,
                                Double maxPriceMillions) {
        private boolean isEmpty() {
            return (brandNames == null || brandNames.isEmpty())
                    && (minPriceMillions == null && maxPriceMillions == null);
        }

        private boolean hasPriceRange() {
            return minPriceMillions != null || maxPriceMillions != null;
        }

        private boolean hasAnyFilter() {
            return !isEmpty();
        }
    }
}

