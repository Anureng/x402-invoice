'use client'

import { Wallet2, TrendingUp } from 'lucide-react'

export function InvoiceHeader() {
  return (
    <header className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
              <Wallet2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-balance">Web3 Invoice</h1>
              <p className="text-sm text-muted-foreground">Multi-chain payment solution</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Live Network</span>
          </div>
        </div>
      </div>
    </header>
  )
}
