"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ResultsTable from "@/components/ResultsTable";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface SearchResult {
  dealName: string;
  dealNetwork?: string;
  FDV?: string;
  dealRound?: string;
  dealVC?: string;
  dealToken?: string;
  totalTokens: number;
  distributedTokens: number;
  remainingTokens: number;
  aporte?: number;
  currentPrice?: number;
  performance?: number;
  vesting?: string;
  dealTGE?: string;
  dealPrice?: string;
  dealFee?: string;
  allocation?: number;
  dealStatus?: string;
}

export default function Home() {
  const {
    isConnected,
    address,
    disconnectWallet,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Redirecionar para login se não estiver conectado
  useEffect(() => {
    console.log(
      "Redirect useEffect - authLoading:",
      authLoading,
      "isConnected:",
      isConnected
    );
    if (!authLoading && !isConnected) {
      console.log("Redirecting to login page");
      router.push("/login");
    }
  }, [isConnected, authLoading, router]);

  // Verificar se a carteira está autorizada
  useEffect(() => {
    const verificarAutorizacao = async () => {
      if (address) {
        try {
          const response = await fetch("/api/verificar-carteira", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carteira: address }),
          });

          const data = await response.json();
          setIsAuthorized(data.autorizada);
        } catch {
          console.error("Erro ao verificar autorização");
          setIsAuthorized(false);
        }
      }
    };

    verificarAutorizacao();
  }, [address]);

  // Buscar dados automaticamente quando conectar
  useEffect(() => {
    console.log(
      "Page useEffect - isConnected:",
      isConnected,
      "address:",
      address
    );
    if (isConnected && address) {
      console.log("Page useEffect - Calling handleSearch for:", address);
      handleSearch(address);
    }
  }, [isConnected, address]);

  const handleSearch = async (address: string) => {
    console.log("handleSearch called with address:", address);
    setIsLoading(true);
    setError("");
    setSearchedAddress(address);

    try {
      console.log("Making API call to search endpoint");
      const response = await fetch(
        `/api/search?address=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      console.log("Search API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar dados");
      }

      setResults(data.results || []);
      console.log("Results set:", data.results?.length || 0, "deals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    router.push("/login");
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver conectado, não renderizar nada (será redirecionado)
  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header com botão de logout */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Distribuição de Tokens - Legends
              </h1>
              <p className="text-sm text-gray-600">
                Carteira:{" "}
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
              </p>
            </div>
            <div className="flex gap-3">
              {isAuthorized && (
                <>
                  <button
                    onClick={() => router.push("/panel")}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Admin
                  </button>
                  <button
                    onClick={() => router.push("/gallery")}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Galeria
                  </button>
                  <button
                    onClick={() => router.push("/edit")}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Distribuição
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Desconectar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-[1600px]">
        {error && (
          <div className="w-full mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="w-full mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Buscando dados...</p>
          </div>
        ) : (
          <ResultsTable results={results} searchedAddress={searchedAddress} />
        )}
      </div>

      <Footer />
    </div>
  );
}
