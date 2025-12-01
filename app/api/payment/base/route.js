import { NextResponse } from "next/server";
// import { verify, settle } from "@payai/x402/verify";
// import { decodeXPaymentResponse } from "@payai/x402/shared";

function extractPayment(headers) {
    if (headers) {
        return headers.get("X-PAYMENT") || headers.get("x-payment");
    }
    const xPayment = headers["X-PAYMENT"] || headers["x-payment"];
    return Array.isArray(xPayment) ? xPayment[0] || null : xPayment || null;
}

function create402Response(requirements) {
    return {
        status: 402,
        body: {
            x402Version: 1,
            accepts: [requirements],
            error: "Payment required"
        }
    };
}

export async function POST(request) {
    try {
        const { userWallet, amount, asset, description, network } = await request.json();

        if (!userWallet || !amount) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        async function verifyPayment(paymentHeader, paymentRequirements, x402Version) {
            try {
                const paymentPayload = JSON.parse(
                    Buffer.from(paymentHeader, "base64").toString("utf8")
                );
                const verifyPayload = {
                    x402Version,
                    paymentPayload,
                    paymentRequirements
                };

                const response = await fetch(`https://api.cdp.coinbase.com/platform/v2/x402/verify`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 967e6c68-18a1-4219-878d-b05a7680821b",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(verifyPayload)
                });
                // const response = await fetch(`https://facilitator.payai.network/verify`, {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify(verifyPayload)
                // });
                if (!response.ok) {
                    return false;
                }
                const facilitatorResponse = await response.json();
                console.log(facilitatorResponse);
                return facilitatorResponse.isValid === true;
            } catch (error) {
                console.error("Payment verification failed:", error);
                return false;
            }
        }

        async function settlePayment(paymentHeader, paymentRequirements, x402Version) {
            try {
                const paymentPayload = JSON.parse(
                    Buffer.from(paymentHeader, "base64").toString("utf8")
                );
                const settlePayload = {
                    x402Version,
                    paymentPayload,
                    paymentRequirements
                };
                const response = await fetch(`https://api.cdp.coinbase.com/platform/v2/x402/settle`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 967e6c68-18a1-4219-878d-b05a7680821b",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(settlePayload)
                });
                if (!response.ok) {
                    return false;
                }
                const facilitatorResponse = await response.json();
                return facilitatorResponse.success === true;
            } catch (error) {
                console.error("Payment settlement failed:", error);
                return false;
            }
        }

        // 1. Extract payment header
        const paymentHeader = extractPayment(request.headers);

        const paymentRequirements = {
            scheme: "exact",
            network: network,
            maxAmountRequired: amount.toString(),
            resource: `http://localhost:3000/api/payment/base`,
            description: description,
            mimeType: "application/json",
            payTo: "0xd2ec9380728f85383b7af3a731f181607bd2d6ab",
            maxTimeoutSeconds: 300,
            asset: asset.address,
            outputSchema: {},
        };

        if (!paymentHeader) {
            // Return 402 with payment requirements
            const response = create402Response(paymentRequirements);
            return NextResponse.json(response.body, { status: response.status });
        }

        // 3. Verify payment
        const verified = await verifyPayment(paymentHeader, paymentRequirements, 1);
        if (!verified) {
            return NextResponse.json({ error: 'Invalid payment' }, { status: 401 });
        }

        console.log("Payment verified, and business logic!!!");

        await settlePayment(paymentHeader, paymentRequirements, 1);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}