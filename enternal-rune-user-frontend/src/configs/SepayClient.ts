import { CreateOrderResponse } from "@/services/checkoutService";

export const createSepayCheckout = async (order: CreateOrderResponse) => {
  if (!order) {
    throw new Error("Order data is required to create Sepay checkout.");
  }

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout');
    }

    const data = await response.json();
    return {
      checkoutFormfields: data.checkoutFormfields,
      checkoutURL: data.checkoutURL,
    };
  } catch (error: any) {
    console.error('Error calling SePay API:', error);
    throw error;
  }
};