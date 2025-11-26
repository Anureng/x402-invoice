'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/contexts/wallet-context'
import { createX402Client } from '@payai/x402-solana/client';
import { useAppKitProvider } from '@reown/appkit/react';
import { decodeXPaymentResponse, wrapFetchWithPayment } from "@payai/x402-fetch";
import { createWalletClient, custom } from 'viem'
import { base, baseSepolia } from 'viem/chains'

const CHAINS = [
  { name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: 'from-purple-500 to-purple-600', id: 'polygon' },
  { name: 'Base', symbol: 'BASE', icon: '◎', color: 'from-blue-400 to-blue-500', id: 'base' },
  { name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: 'from-red-600 to-orange-600', id: 'avalanche' },
  { name: 'Solana', symbol: 'SOL', icon: '◎', color: 'from-green-400 to-teal-500', id: 'solana' },
]

export function PaymentMethods() {
  const { selectedNetwork, payDetails } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentChain, setCurrentChain] = useState(CHAINS[0])
  const solanaWallet = useAppKitProvider('solana').walletProvider
  const { walletProvider } = useAppKitProvider("eip155")

  useEffect(() => {
    if (selectedNetwork) {
      const chain = CHAINS.find(c => c.id.toLowerCase() === selectedNetwork.toLowerCase())
      if (chain) {
        setCurrentChain(chain)
      }
    }
  }, [selectedNetwork])

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      if (currentChain.name === 'Solana') {
        if (!solanaWallet.publicKey) return;
        const amount = Number(payDetails?.amount);
        const userWallet = solanaWallet.publicKey;

        // Create x402 client
        const client = createX402Client({
          wallet: solanaWallet,
          network: 'solana',
          rpcUrl: "https://mainnet.helius-rpc.com/?api-key=59d15393-1c14-4115-b919-76b0ba1b6361",
          maxPaymentAmount: BigInt(1_000_000_000_000_000),
        });

        // Make a paid request - automatically handles 402 payments
        const response = await client.fetch('/api/payment/solana', {
          method: 'POST',
          body: JSON.stringify({
            userWallet: userWallet.toString(),
            amount: amount,
            asset: {
              address: payDetails?.address,
              decimal: payDetails?.decimal,
            },
            description: payDetails?.description,
          }),
        });

        const result = await response.json();
      } else if (currentChain.name === 'Base') {
        const evmWallet = walletProvider;
        if (!evmWallet.selectedAddress) return;

        const walletClient = createWalletClient({
          chain: baseSepolia,
          transport: custom(evmWallet),
          account: evmWallet.selectedAddress
        })

        const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient, BigInt(1 * 10 ** 15));

        const response = await fetchWithPayment("/api/payment/base", {
          method: "POST", body: JSON.stringify({
            userWallet: evmWallet.selectedAddress,
            amount: Number(payDetails?.amount),
            asset: {
              address: payDetails?.address,
              decimal: payDetails?.decimal,
            },
            description: payDetails?.description,
            network: 'base-sepolia',
          })
        });
        console.log(response);

        const body = await response.json();
        console.log(body);

        const paymentResponse = decodeXPaymentResponse(response.headers.get("x-payment-response"));
        console.log(paymentResponse);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  function fixDecimal() {
    if (!payDetails) return '0.00';
    const amount = Number(payDetails?.amount);
    const decimal = Number(payDetails?.decimal);
    return parseFloat(amount / Math.pow(10, decimal)).toFixed(4);
  }

  return (
    <div className="space-y-6 pt-6 border-t border-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment Network</span>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-lg">{currentChain.icon}</span>
            <span className="text-sm font-medium">{currentChain.name}</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-black/20 space-y-1">
          <p className="text-xs text-muted-foreground">Amount to Pay</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight">{fixDecimal()}</span>
            <span className="text-sm text-muted-foreground">{payDetails?.symbol}</span>
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
            <span className="font-medium">{fixDecimal()} {payDetails?.symbol}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-12 bg-white text-black hover:bg-gray-200 font-medium transition-colors rounded-lg"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  )
}
