"use client"

import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, base, polygon, avalanche } from "@reown/appkit/networks";
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { WalletProvider } from "@/contexts/wallet-context";

// 0. Create the Ethers adapter
export const ethersAdapter = new EthersAdapter()

// 1. Create Solana adapter
const solanaWeb3JsAdapter = new SolanaAdapter()

const projectId = "44d8c51958a817e23d358e23ebdb41ec";

if (!projectId) {
    throw new Error('Project ID is not defined')
}

const metadata = {
    name: "x402fi",
    description: "One Api solution for x402 finance.",
    url: "https://www.x402fi.tech",
    icons: ["https://www.x402fi.tech/android-chrome-512x512.png"],
};

createAppKit({
    adapters: [ethersAdapter, solanaWeb3JsAdapter],
    projectId,
    networks: [solana, base, polygon, avalanche],
    metadata,
    features: {
        analytics: true,
    },
});

export function AppKit({ children }) {
    return (
        <WalletProvider>
            {children}
        </WalletProvider>
    );
}