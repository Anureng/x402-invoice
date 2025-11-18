'use client'

import { Shield, Lock, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/40 backdrop-blur-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Secure</p>
              <p className="text-sm text-muted-foreground">Protected by blockchain technology</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Private</p>
              <p className="text-sm text-muted-foreground">Your keys, your funds</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Global</p>
              <p className="text-sm text-muted-foreground">Multi-chain support</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2025 Web3 Invoice. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
