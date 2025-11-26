import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = 1;

        const returnedValue = {
            network: "solana",
            treasuryAddress: "FmxZrCG5D4MSBySHx4Yffb4nFte8Tei5YTRKwxxw3yuX",
            amount: "10000000000",
            description: "Subscription payment",
            // asset: {
            //     address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            //     decimals: 6
            // },
            asset: {
                address: "Dria68ScNfmRrvL7K1nx5cEkND6V6V5yUGkFr7gcyai",
                decimals: 9
            },
            server_callback_api: "https://mywebsite.com/api/paymentCallback",
            callback_url: "https://mywebsite.com/paymentSuccess",
        }

        if (id == 1) {
            return NextResponse.json({
                network: returnedValue.network,
                amount: returnedValue.amount,
                symbol: "MDS",
                decimal: returnedValue.asset.decimals,
                address: returnedValue.asset.address,
                description: returnedValue.description,
                treasuryAddress: returnedValue.treasuryAddress,
                server_callback_api: returnedValue.server_callback_api,
                callback_url: returnedValue.callback_url,
            }, { status: 200 });
        } else if (id == 2) {
            return NextResponse.json({
                network: "base",
                amount: "1000000",
                symbol: "USDC",
                decimal: 6,
                address: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
                description: "Paying 1 USDC"
            }, { status: 200 });
        }
        return NextResponse.json({ success: false }, { status: 400 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}