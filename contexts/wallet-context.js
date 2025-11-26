"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAppKit, useAppKitState, useAppKitAccount, useDisconnect, useAppKitNetwork } from "@reown/appkit/react";
import { base, polygon, avalanche, baseSepolia } from "@reown/appkit/networks";
// import { useAppKitProvider } from "@reown/appkit/react";

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { loading } = useAppKitState();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork()
  const [selectedNetwork, setSelectedNetwork] = useState("base");
  const [payDetails, setPayDetails] = useState(null);

  useEffect(() => {
    setIsConnecting(loading)
  }, [loading])



  useEffect(() => {
    async function switchNetworkMain(network) {
      if (network === "base") await switchNetwork(baseSepolia);
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
    payDetails,
    setPayDetails,
    setSelectedNetwork,
    connectWallet: async () => {
      setIsConnecting(true)
      try {
        if (selectedNetwork === "solana") {
          await open({ namespace: "solana" });
        } else {
          await open({ namespace: "eip155" });
        }
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
