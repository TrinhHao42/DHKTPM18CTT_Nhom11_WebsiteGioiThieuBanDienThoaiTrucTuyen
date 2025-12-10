import { CreateOrderResponse } from "@/services/checkoutService";

export const createSepayCheckout = async (order: CreateOrderResponse) => {
  if (!order) {
    throw new Error("Order data is required to create Sepay checkout.");
  }

  console.log('🔄 SepayClient: Creating checkout for order:', order);

  try {
    const response = await fetch('/api/payment/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: order.orderId,
        totalAmount: order.totalAmount,
      }),
    });

    console.log('📥 SepayClient: Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ SepayClient: Error response:', error);
      throw new Error(error.error || 'Failed to create checkout');
    }

    const data = await response.json();
    console.log('✅ SepayClient: Success response:', data);
    return {
      checkoutFormfields: data.checkoutFormfields,
      checkoutURL: data.checkoutURL,
    };
  } catch (error: any) {
    console.error('❌ SepayClient: Error calling SePay API:', error);
    throw error;
  }
};