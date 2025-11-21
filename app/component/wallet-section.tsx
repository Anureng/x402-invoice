"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";

export function WalletSection() {
  const [copied, setCopied] = useState(false);
  const {
    isConnected,
    walletAddress,
    selectedNetwork,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const disconnectWalletMain = () => {
    disconnectWallet();
    setCopied(false);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Wallet</h2>
        {isConnected && (
           <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white">{selectedNetwork}</span>
        )}
      </div>

      {!isConnected ? (
        <Button
          onClick={() => connectWallet("base")}
          className="w-full h-12 bg-white text-black hover:bg-gray-200 font-medium transition-colors rounded-lg"
        >
          Connect Wallet
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-white/10 bg-black/20 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                <div>
                  <p className="text-sm font-medium">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
             </div>
             <Button
              onClick={disconnectWalletMain}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
