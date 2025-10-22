"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultsTable from "@/components/ResultsTable";
import { SearchResult } from "@/types";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const address = searchParams.get("address");
    if (address) {
      setSearchedAddress(address);
      handleSearch(address);
    } else {
      // Se não há endereço, redirecionar para login
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?address=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar dados");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resultados da Pesquisa
              </h1>
              <p className="text-sm text-gray-600">
                Endereço:{" "}
                {searchedAddress
                  ? `${searchedAddress.slice(0, 6)}...${searchedAddress.slice(
                      -4
                    )}`
                  : ""}
              </p>
            </div>
            <Link
              href="/login"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar
            </Link>
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

      <footer className="mt-8 pb-8 text-center text-sm text-gray-500">
        <p>
          {" "}
          Os valores exibidos foram exportados da planilha Distribuição Deals
          Racc compartilhada{" "}
        </p>
        <p>
          {" "}
          Os dados de Performance estão sendo obtidos através da API da
          CoinGecko{" "}
        </p>
      </footer>
    </div>
  );
}
