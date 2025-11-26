import { NextResponse } from "next/server";
import { X402PaymentHandler } from '@payai/x402-solana/server';

const x402 = new X402PaymentHandler({
    network: 'solana',
    treasuryAddress: "uKQ77M8ee7Jq2TKoZSyUUWDbxv9Eva8rv8DZn2DVLXm",
    facilitatorUrl: 'https://facilitator.payai.network',
});

export async function POST(request) {
    try {
        const { userWallet, amount, asset, description } = await request.json();

        if (!userWallet || !amount) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // 1. Extract payment header
        const paymentHeader = x402.extractPayment(request.headers);

        // 2. Create payment requirements using x402 RouteConfig format
        const paymentRequirements = await x402.createPaymentRequirements({
            price: {
                amount: amount.toString(),
                asset: {
                    address: asset.address,
                }
            },
            network: 'solana',
            config: {
                description: description,
                resource: `http://localhost:3000/api/payment/solana`,
                // resource: `${process.env.NEXTAUTH_URL}/api/payment/solana`,
            }
        });

        if (!paymentHeader) {
            // Return 402 with payment requirements
            const response = x402.create402Response(paymentRequirements);
            return NextResponse.json(response.body, { status: response.status });
        }

        // 3. Verify payment
        const verified = await x402.verifyPayment(paymentHeader, paymentRequirements);
        if (!verified) {
            return NextResponse.json({ error: 'Invalid payment' }, { status: 402 });
        }

        await x402.settlePayment(paymentHeader, paymentRequirements);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}