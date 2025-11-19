'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Send } from 'lucide-react'

const CHAINS = [
  { name: 'Ethereum', symbol: 'ETH', icon: '⟠', color: 'from-blue-500 to-blue-600' },
  { name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: 'from-purple-500 to-purple-600' },
  { name: 'Arbitrum', symbol: 'ARB', icon: '◊', color: 'from-cyan-400 to-cyan-500' },
  { name: 'Base', symbol: 'BASE', icon: '◎', color: 'from-blue-400 to-blue-500' },
  { name: 'Optimism', symbol: 'OP', icon: '◈', color: 'from-red-400 to-red-500' },
  { name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: 'from-red-600 to-orange-600' },
]

export function PaymentMethods() {
  const [selectedChain, setSelectedChain] = useState<string>('Ethereum')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Payment of $5,000 initiated on ${selectedChain}!`)
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedChainData = CHAINS.find(c => c.name === selectedChain)

  return (
    <div className="space-y-4">
      {/* <Card className="border border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Select Chain</h3>
          </div>

          <div className="space-y-2">
            {CHAINS.map((chain) => (
              <button
                key={chain.name}
                onClick={() => setSelectedChain(chain.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedChain === chain.name
                    ? 'border-primary bg-primary/20'
                    : 'border-border/50 bg-secondary/30 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${chain.color} flex items-center justify-center text-lg font-bold text-white`}>
                      {chain.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{chain.name}</p>
                      <p className="text-xs text-muted-foreground">{chain.symbol}</p>
                    </div>
                  </div>
                  {selectedChain === chain.name && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card> */}

      <Card className="border border-border/50 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Selected Network</p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedChainData?.color} flex items-center justify-center text-2xl`}>
                {selectedChainData?.icon}
              </div>
              <div>
                <p className="font-bold text-lg">{selectedChain}</p>
                <p className="text-xs text-muted-foreground">Low fees • Fast settlement</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-primary/30">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">$5,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Gas Fee</span>
              <span className="font-semibold">$2.50</span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
          >
            <Send className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing Payment...' : 'Pay with ' + selectedChain}
          </Button>
        </div>
      </Card>
    </div>
  )
}
