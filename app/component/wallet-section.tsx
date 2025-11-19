"use client";

import { useState } from "react";
import { Wallet, Copy, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Wallet Connection</h2>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>

        {isConnected && walletAddress && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-xs text-muted-foreground mb-2">
                Wallet Address
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm break-all text-primary">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
                </p>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {/* <p className="text-xs text-muted-foreground mt-2">
                Full: {walletAddress}
              </p> */}
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-semibold text-primary">2.5 ETH</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground">Network</p>
                <p className="font-semibold text-primary">
                  {selectedNetwork.charAt(0).toUpperCase() +
                    selectedNetwork.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {!isConnected ? (
            <Button
              onClick={() => connectWallet("base")}
              className="w-full border-border/50"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={disconnectWalletMain}
              variant="outline"
              className="w-full border-border/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>

        {/* <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🔒 Your wallet connection is secure. We never store your private keys.
          </p>
        </div> */}
      </div>
    </Card>
  );
}
