import { NextRequest, NextResponse } from 'next/server';
import { SePayPgClient } from 'sepay-pg-node';

const sepayClient = new SePayPgClient({
    env: "sandbox",
    merchant_id: process.env.MERCHANT_ID!,
    secret_key: process.env.PAYMENT_GATEWAY_API_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, totalAmount } = body;

        if (!orderId || !totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields: orderId and totalAmount' },
                { status: 400 }
            );
        }

        // Create checkout form fields
        const checkoutFormfields = sepayClient.checkout.initOneTimePaymentFields({
            payment_method: 'BANK_TRANSFER',
            operation: 'PURCHASE',
            order_invoice_number: orderId.toString(),
            order_amount: totalAmount,
            currency: 'VND',
            order_description: `Thanh toan don hang ORD${orderId}`,
        });

        const checkoutURL = sepayClient.checkout.initCheckoutUrl();

        return NextResponse.json({
            success: true,
            checkoutFormfields,
            checkoutURL,
        });
    } catch (error: any) {
        console.error('Error creating SePay checkout:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
