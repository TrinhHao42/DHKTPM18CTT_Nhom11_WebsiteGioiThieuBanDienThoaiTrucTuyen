package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.request.OrderItemRequest;
import iuh.fit.se.enternalrunebackend.dto.request.OrderStatusUpdateRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private DiscountRepository discountRepository;


    @Override
    public DashboardSummaryResponse getSummaryForMonth(int year, int month) {
        // Tổng số đơn hàng, đơn hoàn thành, đơn đang xử lý
        long totalOrders = orderRepository.countTotalOrders();
        long completedOrders = orderRepository.countCompletedOrders();
        long processingOrders = orderRepository.countProcessingOrders();

        // Dữ liệu tháng hiện tại
        Double revenueThisMonth = orderRepository.sumRevenueByMonth(year, month);
        Integer refundsThisMonth = orderRepository.countRefundsByMonth(year, month);

        // Dữ liệu tháng trước để so sánh
        int prevMonth = (month == 1) ? 12 : month - 1;
        int prevYear = (month == 1) ? year - 1 : year;

        Double revenuePrevMonth = orderRepository.sumRevenueByMonth(prevYear, prevMonth);
        Integer refundsPrevMonth = orderRepository.countRefundsByMonth(prevYear, prevMonth);

        // Tính % thay đổi
        double revenueChange = calcChangePercent(revenueThisMonth, revenuePrevMonth);
        double refundChange = calcChangePercent(refundsThisMonth, refundsPrevMonth);

        return new DashboardSummaryResponse(
                totalOrders,
                revenueThisMonth,
                completedOrders,
                processingOrders,
                refundChange,
                revenueChange
        );
    }

    /**
     * Tính % thay đổi giữa 2 tháng.
     * Nếu tháng trước = 0 thì:
     * - nếu tháng này > 0 → 100%
     * - nếu tháng này = 0 → 0%
     */
    private double calcChangePercent(Number current, Number previous) {
        if (current == null) current = 0;
        if (previous == null || previous.doubleValue() == 0)
            return current.doubleValue() > 0 ? 100.0 : 0.0;

        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100.0;
    }

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // 1. Validate và lấy User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + request.getUserId()));

        // 2. Validate và lấy Address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address không tồn tại với ID: " + request.getAddressId()));

        // 3. Kiểm tra xem user có quyền sử dụng địa chỉ này không (có trong danh sách addresses của user)
        boolean hasAddress = user.getAddresses().stream()
                .anyMatch(a -> a.getAddressId() == address.getAddressId());
        if (!hasAddress) {
            throw new RuntimeException("User không có quyền sử dụng địa chỉ này!");
        }

        // 4. Lấy Discount nếu có
        Discount discount = null;
        if (request.getDiscountId() != null) {
            discount = discountRepository.findById(request.getDiscountId())
                    .orElse(null);
        }

        // 5. Tạo Order
        Order order = Order.builder()
                .orderDate(LocalDate.now())
                .orderPaymentStatus(PaymentStatus.PENDING)
                .orderShippingStatus(ShippingStatus.PROCESSING)
                .orderUser(user)
                .orderShippingAddress(address)
                .discount(discount)
                .orderDetails(new ArrayList<>())
                .build();

        // 6. Tạo OrderDetails và tính tổng tiền
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest item : request.getOrderItems()) {
            // Lấy ProductVariant
            ProductVariant productVariant = productVariantRepository.findById(item.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("ProductVariant không tồn tại với ID: " + item.getProductVariantId()));

            // Lấy giá hiện tại của ProductVariant
            ProductPrice productPrice = productVariant.getProdvPrice();
            if (productPrice == null) {
                throw new RuntimeException("ProductVariant không có giá: " + item.getProductVariantId());
            }

            // Tính tổng giá cho item này
            double itemTotal = productPrice.getPpPrice() * item.getQuantity();
            totalAmount = totalAmount.add(BigDecimal.valueOf(itemTotal));

            // Tạo OrderDetail
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOdQuantity(item.getQuantity());
            orderDetail.setOdTotalPrice(itemTotal);
            orderDetail.setOdPrice(productPrice);
            orderDetail.setOdProductVariant(productVariant);
            orderDetail.setOrder(order);

            order.getOrderDetails().add(orderDetail);
        }

        // 7. Áp dụng discount nếu có
        if (discount != null) {
            // Kiểm tra discount còn hiệu lực không
            LocalDate now = LocalDate.now();
            if (now.isBefore(discount.getDiscountStartDate()) || now.isAfter(discount.getDiscountEndDate())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn hoặc chưa có hiệu lực!");
            }

            // Tính giảm giá dựa trên discountValueType
            BigDecimal discountAmount = BigDecimal.ZERO;

            // Giả sử ValueType có PERCENTAGE và FIXED_AMOUNT
            // Bạn cần điều chỉnh theo enum ValueType thực tế của bạn
            if (discount.getDiscountValueType().toString().equals("PERCENTAGE")) {
                discountAmount = totalAmount.multiply(BigDecimal.valueOf(discount.getDiscountValue() / 100.0));
                // Nếu có giới hạn giảm giá tối đa
                if (discount.getDiscountMaxAmount() > 0) {
                    BigDecimal maxDiscount = BigDecimal.valueOf(discount.getDiscountMaxAmount());
                    if (discountAmount.compareTo(maxDiscount) > 0) {
                        discountAmount = maxDiscount;
                    }
                }
            } else {
                // Fixed amount
                discountAmount = BigDecimal.valueOf(discount.getDiscountValue());
            }

            totalAmount = totalAmount.subtract(discountAmount);

            // Đảm bảo tổng tiền không âm
            if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
                totalAmount = BigDecimal.ZERO;
            }
        }

        // 8. Set tổng tiền cho order
        order.setOrderTotalAmount(totalAmount);

        // 9. Lưu order (cascade sẽ lưu OrderDetails)
        Order savedOrder = orderRepository.save(order);

        return savedOrder;
    }

    @Override
    public PaymentStatus getOrderPaymentStatus(int orderId) {
        return orderRepository.getOrderPaymentStatus(orderId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findOrdersByCustomerId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUserIdPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orderPage = orderRepository.findOrdersByCustomerIdWithDetails(userId, pageable);
        
        return orderPage.map(this::convertToOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        return convertToOrderResponse(order);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        // Map Address
        AddressResponse addressInfo = new AddressResponse(
            order.getOrderShippingAddress().getAddressId(),
            order.getOrderShippingAddress().getStreetName(),
            order.getOrderShippingAddress().getWardName(),
            order.getOrderShippingAddress().getCityName(),
            order.getOrderShippingAddress().getCountryName()
        );

        // Map User
        OrderResponse.UserInfo userInfo = new OrderResponse.UserInfo(
            order.getOrderUser().getUserId(),
            order.getOrderUser().getName(),
            order.getOrderUser().getEmail()
        );

        // Map OrderDetails with ProductVariant
        List<OrderResponse.OrderDetailInfo> orderDetailInfos = order.getOrderDetails().stream()
            .map(detail -> {
                ProductVariant variant = detail.getOdProductVariant();
                // Get image URL
                String imageUrl = null;
                if (variant.getProdvImg() != null && variant.getProdvImg().getImageData() != null) {
                    imageUrl = variant.getProdvImg().getImageData();
                }
                
                // Map ProductVariant info
                OrderResponse.ProductVariantInfo variantInfo = new OrderResponse.ProductVariantInfo(
                    variant.getProdvId(),
                    variant.getProdvName(),
                    variant.getProdvModel(),
                    variant.getProdvVersion(),
                    variant.getProdvColor(),
                    imageUrl,
                    variant.getProdvProduct() != null ? variant.getProdvProduct().getProdId() : 0,
                    variant.getProdvProduct() != null ? variant.getProdvProduct().getProdName() : ""
                );

                // Get price
                double price = 0;
                if (detail.getOdPrice() != null) {
                    price = detail.getOdPrice().getPpPrice();
                }

                return new OrderResponse.OrderDetailInfo(
                    detail.getOdId(),
                    detail.getOdQuantity(),
                    detail.getOdTotalPrice(),
                    variantInfo,
                    price
                );
            })
            .collect(Collectors.toList());

        return OrderResponse.builder()
            .orderId(order.getOrderId())
            .orderDate(order.getOrderDate())
            .orderTotalAmount(order.getOrderTotalAmount())
            .orderPaymentStatus(order.getOrderPaymentStatus())
            .orderShippingStatus(order.getOrderShippingStatus())
            .orderShippingAddress(addressInfo)
            .orderUser(userInfo)
            .orderDetails(orderDetailInfos)
            .build();
    }
    @Override
    @Transactional(readOnly = true)
    public Page<OrderListResponse> getOrderList(
            String keyword,
            PaymentStatus paymentStatus,
            ShippingStatus shippingStatus,
            Pageable pageable
    ) {
        Page<Order> ordersPage = orderRepository.searchOrders(keyword, paymentStatus, shippingStatus, pageable);
        List<OrderListResponse> dtoList = ordersPage.getContent().stream().map(order -> {
            int totalProduct = order.getOrderDetails()
                    .stream()
                    .mapToInt(OrderDetail::getOdQuantity)
                    .sum();
            return new OrderListResponse(
                    order.getOrderId(),
                    order.getOrderUser().getName(),
                    order.getOrderUser().getEmail(),
                    totalProduct,
                    order.getOrderTotalAmount(),
                    order.getOrderPaymentStatus(),
                    order.getOrderShippingStatus(),
                    order.getOrderDate()
            );
        }).toList();
        return new PageImpl<>(dtoList, pageable, ordersPage.getTotalElements());
    }
    @Override
    @Transactional(readOnly = true)
    public OrderStatisticsResponse getOrderStatistics() {

        long totalOrders = orderRepository.count();

        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        long completedOrders = orderRepository.countByOrderShippingStatus(ShippingStatus.DELIVERED);

        long processingOrders = orderRepository.countByOrderShippingStatus(ShippingStatus.PROCESSING);

        return new OrderStatisticsResponse(
                totalOrders,
                totalRevenue,
                completedOrders,
                processingOrders
        );
    }
    @Override
    @Transactional
    public OrderListResponse updateOrderStatus(int orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (request.getPaymentStatus() != null) {
            order.setOrderPaymentStatus(request.getPaymentStatus());
        }
        if (request.getShippingStatus() != null) {
            order.setOrderShippingStatus(request.getShippingStatus());
        }
        orderRepository.save(order);
        int totalProduct = order.getOrderDetails()
                .stream()
                .mapToInt(OrderDetail::getOdQuantity)
                .sum();
        return new OrderListResponse(
                order.getOrderId(),
                order.getOrderUser().getName(),
                order.getOrderUser().getEmail(),
                totalProduct,
                order.getOrderTotalAmount(),
                order.getOrderPaymentStatus(),
                order.getOrderShippingStatus(),
                order.getOrderDate()
        );
    }
    @Override
    public void deleteById(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getOrderShippingStatus() == ShippingStatus.DELIVERED ||
                order.getOrderPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Cannot delete completed or paid order");
        }
        orderRepository.delete(order);
    }
    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderDetailResponse.ProductDetail> products = order.getOrderDetails().stream()
                .map(od -> {
                    ProductVariant pv = od.getOdProductVariant();
                    return new OrderDetailResponse.ProductDetail(
                            pv.getProdvId(),
                            pv.getProdvName(),
                            pv.getProdvModel(),
                            pv.getProdvVersion(),
                            pv.getProdvColor(),
                            pv.getProdvPrice() != null ? pv.getProdvPrice().getPpPrice() : 0.0,
                            pv.getProdvImg() != null ? pv.getProdvImg().getImageData() : null,
                            od.getOdQuantity()
                    );
                }).toList();

        return new OrderDetailResponse(
                order.getOrderId(),
                order.getOrderUser().getName(),
                order.getOrderUser().getEmail(),
                order.getOrderPaymentStatus(),
                order.getOrderShippingStatus(),
                order.getOrderDate(),
                order.getOrderTotalAmount(),
                products
        );
    }
}
