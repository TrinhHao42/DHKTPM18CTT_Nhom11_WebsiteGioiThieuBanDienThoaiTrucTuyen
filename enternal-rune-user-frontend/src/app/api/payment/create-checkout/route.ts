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

        console.log('🔄 API: Received checkout request:', { orderId, totalAmount });

        if (!orderId || !totalAmount) {
            console.error('❌ API: Missing required fields');
            return NextResponse.json(
                { error: 'Missing required fields: orderId and totalAmount' },
                { status: 400 }
            );
        }

        console.log('🔄 API: Creating Sepay checkout form...');
        // Create checkout form fields
        const checkoutFormfields = sepayClient.checkout.initOneTimePaymentFields({
            payment_method: 'BANK_TRANSFER',
            operation: 'PURCHASE',
            order_invoice_number: `ORD${orderId.toString()}`,
            order_amount: totalAmount,
            currency: 'VND',
            order_description: `Thanh toan don hang ORD${orderId}`,
        });

        const checkoutURL = sepayClient.checkout.initCheckoutUrl();

        console.log('✅ API: Checkout created successfully:', { checkoutURL, fieldsCount: Object.keys(checkoutFormfields).length });

        return NextResponse.json({
            success: true,
            checkoutFormfields,
            checkoutURL,
        });
    } catch (error: any) {
        console.error('❌ API: Error creating SePay checkout:', error);
        console.error('❌ API: Error details:', error.message, error.stack);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
