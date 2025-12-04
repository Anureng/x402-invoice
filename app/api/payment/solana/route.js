import { NextResponse } from "next/server";
import { X402PaymentHandler } from '@payai/x402-solana/server';

export async function POST(request) {
    try {
        const { userWallet, amount, asset, description, payID, server_callback_api } = await request.json();

        if (!userWallet || !amount) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        const res = await fetch(`https://www.x402fi.tech/api/payment/${payID}`);
        const gotData = await res.json();

        const x402 = new X402PaymentHandler({
            network: 'solana',
            treasuryAddress: gotData.treasuryAddress,
            facilitatorUrl: 'https://facilitator.payai.network',
        });
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
                resource: `https://www.x402fi.tech/api/payment/solana`,
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

        const response = await fetch(`https://www.x402fi.tech/api/createInvoice`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentId: payID,
                status: 'paid',
            }),
        });

        await response.json();

        try {
            await fetch(server_callback_api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payID: payID,
                    status: 'paid',
                }),
            });
        } catch (error) {
            console.error("User API Failed:", error);
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