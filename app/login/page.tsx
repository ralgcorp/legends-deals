"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const { connectWallet, isLoading, isConnected } = useAuth();
  const router = useRouter();
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      // Redirecionar para página de resultados com o endereço
      router.push(`/results?address=${encodeURIComponent(searchAddress)}`);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Racc Ventures
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Conecte sua carteira MetaMask para acessar a distribuição de tokens
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <div className="space-y-6">
            {/* Barra de Pesquisa */}
            <div className="pb-2">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Pesquise por Carteira
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Digite um endereço EVM para consultar os deals
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchAddress.trim()}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSearching ? "..." : "Buscar"}
                  </button>
                </div>
              </form>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Conectar Carteira
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Clique no botão abaixo para conectar sua carteira MetaMask
              </p>
            </div>

            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Conectando...
                </>
              ) : (
                <>
                  <Image
                    src="/metamask.svg"
                    alt="MetaMask"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  Conectar com MetaMask
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Não tem MetaMask?{" "}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Instale aqui
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao conectar sua carteira, você concorda com nossos{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
