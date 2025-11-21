'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/contexts/wallet-context'

const CHAINS = [
  { name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: 'from-purple-500 to-purple-600', id: 'polygon' },
  { name: 'Base', symbol: 'BASE', icon: '◎', color: 'from-blue-400 to-blue-500', id: 'base' },
  { name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: 'from-red-600 to-orange-600', id: 'avalanche' },
  { name: 'Solana', symbol: 'SOL', icon: '◎', color: 'from-green-400 to-teal-500', id: 'solana' },
]

export function PaymentMethods() {
  const { selectedNetwork } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentChain, setCurrentChain] = useState(CHAINS[0])

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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Payment of $5,000 initiated on ${currentChain.name}!`)
    } finally {
      setIsProcessing(false)
    }
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
              <span className="text-3xl font-semibold tracking-tight">$5,000.00</span>
              <span className="text-sm text-muted-foreground">USD</span>
           </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Network Fee</span>
             <span>~$0.01</span>
          </div>
          <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Total</span>
             <span className="font-medium">$5,000.01</span>
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
