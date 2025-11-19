"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAppKit, useAppKitState, useAppKitAccount, useDisconnect, useAppKitNetwork } from "@reown/appkit/react";
import { base, polygon, avalanche } from "@reown/appkit/networks";
// import { useAppKitProvider } from "@reown/appkit/react";

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("base");
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { loading } = useAppKitState();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork()

  useEffect(() => {
    setIsConnecting(loading)
  }, [loading])

  useEffect(() => {
    async function switchNetworkMain(network) {
      if (network === "base") await switchNetwork(base);
      if (network === "polygon") await switchNetwork(polygon);
      if (network === "avalanche") await switchNetwork(avalanche);
    }
    if (address && isConnected && selectedNetwork) {
      // open({ view: "Networks" })
      setWalletAddress(address)
      switchNetworkMain(selectedNetwork)
    }
  }, [address, isConnected, selectedNetwork])

  const value = {
    isConnected,
    walletAddress,
    isConnecting,
    selectedNetwork,
    connectWallet: async (adapter) => {
      setIsConnecting(true)
      try {
        if (adapter === "solana") {
          await open({ namespace: "solana" });
        } else {
          await open({ namespace: "eip155" });
        }
        setSelectedNetwork(adapter)
        // await open({ view: "Connect" })
      } catch (error) {
        console.error("Error connecting wallet:", error)
        setIsConnecting(false)
      }
    },
    disconnectWallet: async () => {
      try {
        await disconnect()
        setWalletAddress("")
      } catch (error) {
        console.error("Error disconnecting wallet:", error)
      }
    },
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
