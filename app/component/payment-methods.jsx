"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { createX402Client } from "@payai/x402-solana/client";
import { useAppKitProvider } from "@reown/appkit/react";
import { Connection, PublicKey } from "@solana/web3.js";
// import {
//   decodeXPaymentResponse,
//   wrapFetchWithPayment,
// } from "@payai/x402-fetch";
// import { createWalletClient, custom } from "viem";
// import { base, baseSepolia } from "viem/chains";

const CHAINS = [
  {
    name: "Polygon",
    symbol: "MATIC",
    icon: "⬡",
    color: "from-purple-500 to-purple-600",
    id: "polygon",
  },
  {
    name: "Base",
    symbol: "BASE",
    icon: "◎",
    color: "from-blue-400 to-blue-500",
    id: "base",
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    icon: "▲",
    color: "from-red-600 to-orange-600",
    id: "avalanche",
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="Solana" className="w-6 h-6 rounded-full" />,
    color: "from-green-400 to-teal-500",
    id: "solana",
  },
];

export function PaymentMethods({ payID }) {
  const { selectedNetwork, payDetails, isConnected } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [currentChain, setCurrentChain] = useState(CHAINS[0]);
  const solanaWallet = useAppKitProvider("solana").walletProvider;
  const { walletProvider } = useAppKitProvider("eip155");

  useEffect(() => {
    if (selectedNetwork) {
      const chain = CHAINS.find(
        (c) => c.id.toLowerCase() === selectedNetwork.toLowerCase()
      );
      if (chain) {
        setCurrentChain(chain);
      }
    }
  }, [selectedNetwork]);

  useEffect(() => {
    const fetchSymbol = async () => {
      if (payDetails?.address) {
        try {
          const response = await fetch(
            "https://mainnet.helius-rpc.com/?api-key=59d15393-1c14-4115-b919-76b0ba1b6361",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: "get-asset",
                method: "getAsset",
                params: { id: payDetails.address },
              }),
            }
          );
          const { result } = await response.json();
          console.log(result);
          if (result?.content?.metadata?.symbol) {
            setTokenSymbol(result.content.metadata.symbol);
          }
        } catch (e) {
          console.error("Failed to fetch symbol", e);
        }
      }
    };
    fetchSymbol();
  }, [payDetails?.address]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (currentChain.name === "Solana") {
        if (!solanaWallet.publicKey) return;
        setErrorMessage(null);
        const amount = Number(payDetails?.amount);
        const userWallet = solanaWallet.publicKey;

        // Check balance
        const connection = new Connection(
          "https://mainnet.helius-rpc.com/?api-key=59d15393-1c14-4115-b919-76b0ba1b6361"
        );
        const userPublicKey = new PublicKey(userWallet.toString());
        const requiredAmount = BigInt(payDetails?.amount || 0);
        let hasBalance = false;

        if (payDetails?.address) {
          const mintPublicKey = new PublicKey(payDetails.address);
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            userPublicKey,
            { mint: mintPublicKey }
          );
          if (tokenAccounts.value.length > 0) {
            const balanceRaw = BigInt(
              tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount
            );
            if (balanceRaw >= requiredAmount) hasBalance = true;
          }
        } else {
          const balanceLamports = await connection.getBalance(userPublicKey);
          if (BigInt(balanceLamports) >= requiredAmount) hasBalance = true;
        }

        if (!hasBalance) {
          setErrorMessage("Insufficient balance");
          setIsProcessing(false);
          return;
        }

        // Create x402 client
        const client = createX402Client({
          wallet: solanaWallet,
          network: "solana",
          rpcUrl:
            "https://mainnet.helius-rpc.com/?api-key=59d15393-1c14-4115-b919-76b0ba1b6361",
          maxPaymentAmount: BigInt(1_000_000_000_000_000),
        });

        // Make a paid request - automatically handles 402 payments
        const response = await client.fetch("/api/payment/solana", {
          method: "POST",
          body: JSON.stringify({
            userWallet: userWallet.toString(),
            amount: amount,
            asset: {
              address: payDetails?.address,
              decimal: payDetails?.decimal,
            },
            description: payDetails?.description,
            payID: payID,
            server_callback_api: payDetails?.server_callback_api
          }),
        });

        await response.json();
        setShowSuccess(true);
        // } else if (currentChain.name === 'Base') {
        //   const evmWallet = walletProvider;
        //   if (!evmWallet.selectedAddress) return;

        //   const walletClient = createWalletClient({
        //     chain: baseSepolia,
        //     transport: custom(evmWallet),
        //     account: evmWallet.selectedAddress
        //   })

        //   const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient, BigInt(1 * 10 ** 15));

        //   const response = await fetchWithPayment("/api/payment/base", {
        //     method: "POST", body: JSON.stringify({
        //       userWallet: evmWallet.selectedAddress,
        //       amount: Number(payDetails?.amount),
        //       asset: {
        //         address: payDetails?.address,
        //         decimal: payDetails?.decimal,
        //       },
        //       description: payDetails?.description,
        //       network: 'base-sepolia',
        //     })
        //   });
        //   console.log(response);

        //   const body = await response.json();
        //   console.log(body);

        //   const paymentResponse = decodeXPaymentResponse(response.headers.get("x-payment-response"));
        //   console.log(paymentResponse);
        //   setShowSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  function fixDecimal() {
    if (!payDetails) return "0.00";
    const amount = Number(payDetails?.amount);
    const decimal = Number(payDetails?.decimal);
    return parseFloat(amount / Math.pow(10, decimal)).toFixed(4);
  }

  const params = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (showSuccess && payDetails?.callback_url) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const redirectTimer = setTimeout(() => {
        window.location.href = `${payDetails.callback_url}?pay_id=${params.payID}`;
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [showSuccess, payDetails, params.payID]);

  return (
    <>
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Payment Network
            </span>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-lg">{currentChain.icon}</span>
              <span className="text-sm font-medium">{currentChain.name}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-white/10 bg-black/20 space-y-1">
            <p className="text-xs text-muted-foreground">Amount to Pay</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight">
                {fixDecimal()}
              </span>
              <span className="text-sm text-muted-foreground">
                {tokenSymbol}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span>$0.00</span>
              {/* <span>~$0.01</span> */}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">
                {fixDecimal()} {tokenSymbol}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || !isConnected}
            className={`w-full h-12 bg-white text-black hover:bg-gray-200 font-medium transition-colors rounded-lg ${!isConnected ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Payment Successful!
              </h2>
              <p className="text-sm text-muted-foreground">
                Your transaction has been confirmed. Redirecting to merchant in{" "}
                {countdown} seconds...
              </p>
              <div className="w-full bg-white/10 rounded-full h-1 mt-4 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
