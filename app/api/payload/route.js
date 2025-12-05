import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("pay_id");

        const res = await fetch(`https://www.x402fi.tech/api/payment/${id}`);
        const returnedValue = await res.json();

        if (returnedValue.status !== "pending") {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        if (returnedValue.network != "solana") {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        return NextResponse.json({
            network: returnedValue.network,
            amount: returnedValue.amount,
            decimal: returnedValue.assetDecimals,
            address: returnedValue.assetAddress,
            description: returnedValue.description,
            treasuryAddress: returnedValue.treasuryAddress,
            server_callback_api: returnedValue.serverCallbackApi,
            callback_url: returnedValue.callbackUrl,
        }, { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}