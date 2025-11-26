import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = 1;

        if (id == 1) {
            return NextResponse.json({
                network: "solana",
                amount: "1000000000",
                symbol: "MDS",
                decimal: 9,
                address: "Dria68ScNfmRrvL7K1nx5cEkND6V6V5yUGkFr7gcyai",
                description: "Paying 1 sol"
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