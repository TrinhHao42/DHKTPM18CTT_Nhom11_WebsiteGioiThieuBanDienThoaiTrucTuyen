'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckout } from '@/context/CheckoutContext'
import PersonalDetails from './components/PersonalDetails'
import QRPayment from './components/QRPayment'
import Complete from './components/Complete'
import OrderSummary from './components/OrderSummary'
import ProgressStepper from './components/ProgressStepper'

const Payment = () => {
    const router = useRouter();
    const { checkoutItems } = useCheckout();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showQRPayment, setShowQRPayment] = useState(false);

    // Form data states
    const [personalData, setPersonalData] = useState({
        fullName: '',
        email: '',
        street: '',
        city: '',
        district: '',
        ward: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    // Redirect to cart if no items selected
    useEffect(() => {
        if (checkoutItems.length === 0) {
            router.push('/CartScreen');
        } else {
            setIsLoading(false);
        }
    }, [checkoutItems, router]);

    // Convert checkout items to order items format
    const orderItems = checkoutItems.map((item) => ({
        id: item.ciId,
        name: item.ciProductVariant.prodvName,
        image: item.ciProductVariant.prodvImage.imgData,
        quantity: item.ciQuantity,
        price: item.ciProductVariant.prodvPrice.ppPrice
    }));

    const steps = [
        { number: 1, name: 'Đặt hàng', key: 'checkout' },
        { number: 2, name: 'Thanh toán', key: 'payment' },
        { number: 3, name: 'Hoàn tất', key: 'complete' }
    ];

    const handlePersonalDataChange = (field: string, value: string) => {
        setPersonalData(prev => ({ ...prev, [field]: value }));
    };

    const handleCardDataChange = (field: string, value: string) => {
        setCardData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            // After personal details, show QR payment directly
            setShowQRPayment(true);
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousStep = () => {
        if (showQRPayment) {
            setShowQRPayment(false);
            setCurrentStep(1);
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePayment = () => {
        // This is now only called from step 1
        setShowQRPayment(true);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSuccess = () => {
        // Payment successful, move to complete step
        setShowQRPayment(false);
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
                        {currentStep === 1 && !showQRPayment && (
                            <PersonalDetails
                                formData={personalData}
                                onInputChange={handlePersonalDataChange}
                            />
                        )}

                        {currentStep === 2 && showQRPayment && (
                            <QRPayment
                                totalAmount={calculateTotal()}
                                orderDescription={`Đơn hàng ${orderItems.length} sản phẩm`}
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
                            {currentStep < 3 && !showQRPayment && (
                                <button
                                    onClick={currentStep === 1 ? handlePayment : handleNextStep}
                                    disabled={!isStepValid()}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                                >
                                    {currentStep === 1 && "Đặt hàng"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    {!showQRPayment && currentStep < 3 && (
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
