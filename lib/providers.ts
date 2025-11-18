// lib/providers.ts
"use client"

import { http, createConfig } from "wagmi";
import { mainnet, polygon, arbitrum, base, sepolia } from "viem/chains";
import { createAppKit } from "@coinbase/onchainkit"


export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http()
  },
});

export const appKit = createAppKit({
  appName: "MyDapp",
  appLogoUrl: "/logo.png",
  wagmiConfig,
  chains: [mainnet, polygon, arbitrum, base, sepolia],
  theme: "dark",
  enableCoinbaseWallet: true,
});
