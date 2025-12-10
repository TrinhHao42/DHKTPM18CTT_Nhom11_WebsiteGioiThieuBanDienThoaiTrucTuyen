'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCheckout } from '@/context/CheckoutContext'
import { useAuth } from '@/context/AuthContext'
import { useCartActions } from '@/context/CartContext'
import { createOrder, CreateOrderResponse } from '@/services/checkoutService'
import PersonalDetails from '@/components/Payment/PersonalDetails'
import CheckoutPayment from '@/components/Payment/CheckoutPayment'
import Complete from '@/components/Payment/Complete'
import OrderSummary from '@/components/Payment/OrderSummary'
import ProgressStepper from '@/components/Payment/ProgressStepper'
import { useToast } from '@/hooks/useToast'
import { createSepayCheckout } from '@/configs/SepayClient'


const Payment = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const { checkoutItems } = useCheckout();
    const { user } = useAuth();
    const { removeCartItem } = useCartActions();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<CreateOrderResponse | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    // Get query params
    const orderId = searchParams?.get('orderId');
    const fromOrder = searchParams?.get('fromOrder');
    const orderDataParam = searchParams?.get('orderData');

    // Form data states
    const [personalData, setPersonalData] = useState({
        fullName: '',
        email: '',
        street: '',
        city: '',
        district: '',
        ward: ''
    });

    // Check if coming from order management with order data
    useEffect(() => {
        console.log('🔍 Payment page loaded - checkoutItems:', checkoutItems)
        console.log('🔍 fromOrder:', fromOrder, 'orderId:', orderId)
        
        if (fromOrder === 'true' && orderId && orderDataParam) {
            try {
                // Decode and parse order data from URL
                const decodedOrderData = JSON.parse(decodeURIComponent(orderDataParam));

                // Transform to CreateOrderResponse format expected by QRPayment
                const orderResponse: CreateOrderResponse = {
                    success: true,
                    message: 'Order retrieved successfully',
                    orderId: decodedOrderData.orderId,
                    orderDate: decodedOrderData.orderDate,
                    totalAmount: decodedOrderData.totalAmount,
                    paymentStatus: decodedOrderData.paymentStatus,
                    shippingStatus: decodedOrderData.shippingStatus
                };

                setCreatedOrder(orderResponse);
                setCurrentStep(2);
                setShowPayment(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to parse order data:', error);
                // Redirect back to Order Management on parse error
                router.push('/OrderManagementScreen');
            }
        } else if (checkoutItems.length === 0 && fromOrder !== 'true') {
            // No items and not from order - redirect to cart
            console.warn('⚠️ No checkout items found, redirecting to cart...')
            router.push('/CartScreen');
        } else {
            // Normal flow from cart
            console.log('✅ Normal checkout flow with items:', checkoutItems.length)
            setIsLoading(false);
        }
    }, [orderId, fromOrder, orderDataParam, checkoutItems, router]);

    // Convert checkout items to order items format
    const orderItems = checkoutItems.map((item) => ({
        id: item.cartItemId,
        name: item.productVariantResponse.variantName,
        image: item.productVariantResponse.imageUrl || '/placeholder.png',
        quantity: item.quantity,
        price: item.productVariantResponse.price
    }));

    const steps = [
        { number: 1, name: 'Đặt hàng', key: 'checkout' },
        { number: 2, name: 'Thanh toán', key: 'payment' },
        { number: 3, name: 'Hoàn tất', key: 'complete' }
    ];

    const handlePersonalDataChange = (field: string, value: string) => {
        setPersonalData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            setShowPayment(true);
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePayment = async () => {
        if (!user) {
            toast.warning('Vui lòng đăng nhập để đặt hàng!');
            router.push('/LoginScreen');
            return;
        }

        // Kiểm tra user có địa chỉ không
        if (!user.userAddress || user.userAddress.length === 0) {
            toast.warning('Vui lòng thêm địa chỉ giao hàng!');
            return;
        }

        // Lấy addressId từ personalData hoặc địa chỉ đầu tiên
        const addressId = parseInt(user.userAddress[0].addressId);

        try {
            setIsCreatingOrder(true);

            // Chuẩn bị request data
            const orderRequest = {
                userId: user.userId,
                addressId: addressId,
                orderItems: checkoutItems.map(item => ({
                    productVariantId: item.productVariantResponse.variantId,
                    quantity: item.quantity
                })),
                discountId: null // Có thể thêm logic chọn discount sau
            };

            // Gọi API tạo order
            const response = await createOrder(orderRequest);

            if (response.success) {
                setCreatedOrder(response);
                toast.success("Đặt hàng thành công!");
                console.log('✅ Order created successfully:', response);

                try {
                    for (const item of checkoutItems) {
                        await removeCartItem(item.cartItemId);
                    }
                } catch (cartError) {
                    console.error('❌ Lỗi khi xóa giỏ hàng:', cartError);
                }

                // 👉 CHÈN SEPAY TẠI ĐÂY
                try {
                    console.log('🔄 Calling createSepayCheckout with response:', response);
                    const { checkoutFormfields, checkoutURL } = await createSepayCheckout(response);
                    console.log('✅ Sepay checkout created:', { checkoutFormfields, checkoutURL });

                    // Tạo form để submit sang SePay
                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = checkoutURL;
                    form.target = '_blank';

                    Object.entries(checkoutFormfields).forEach(([key, value]) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = value as string;
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    console.log('📤 Submitting form to:', checkoutURL);
                    console.log('📋 Form fields:', checkoutFormfields);
                    
                    form.submit();
                    
                    console.log('✅ Form submitted successfully');
                    
                    // Clean up form after a delay
                    setTimeout(() => {
                        if (form.parentNode) {
                            document.body.removeChild(form);
                        }
                    }, 1000);

                    setShowPayment(true);
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    toast.success('Đã mở trang thanh toán trong tab mới. Nếu không thấy, vui lòng cho phép popup!');
                } catch (sepayError: any) {
                    console.error('❌ Lỗi khi tạo SePay checkout:', sepayError);
                    console.error('❌ Error details:', sepayError.message, sepayError.stack);
                    toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại!');
                }
            } else {
                alert('Không thể tạo đơn hàng: ' + response.message);
            }
        } catch (error: any) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            alert(error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateTotal = () => {
        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        return subtotal + tax;
    };

    const isStepValid = () => {
        if (currentStep === 1) {
            return personalData.fullName && personalData.email && personalData.street &&
                personalData.city && personalData.district && personalData.ward;
        }
        return true;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProgressStepper currentStep={currentStep} steps={steps} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        {currentStep === 1 && !showPayment && (
                            <PersonalDetails
                                formData={personalData}
                                onInputChange={handlePersonalDataChange}
                            />
                        )}

                        {currentStep === 2 && showPayment && createdOrder && (
                            <CheckoutPayment
                                order={createdOrder}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        )}

                        {currentStep === 3 && (
                            <Complete
                                orderNumber="ER2025001234"
                                estimatedDelivery="25-27 Tháng 10, 2025"
                            />
                        )}


                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            {currentStep < 3 && !showPayment && (
                                <button
                                    onClick={currentStep === 1 ? handlePayment : handleNextStep}
                                    disabled={!isStepValid() || isCreatingOrder}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                                >
                                    {currentStep === 1 && (isCreatingOrder ? "Đang Thanh toán..." : "Thanh toán")}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    {!showPayment && currentStep < 3 && (
                        <div className="lg:w-96">
                            <OrderSummary items={orderItems} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Payment
