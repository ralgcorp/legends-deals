"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface AuthContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já está conectado ao carregar a página
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            setAddress(accounts[0].address);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Erro ao verificar conexão:", error);
        }
      }
      setIsLoading(false);
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask não está instalado!");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      alert("Erro ao conectar com MetaMask");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const value = {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
