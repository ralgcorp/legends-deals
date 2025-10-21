"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsTable from "@/components/ResultsTable";
import { SearchResult } from "@/types";
import Link from "next/link";

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    setError("");
    setSearchedAddress(address);

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
      <div className="container mx-auto px-6 py-12 max-w-[1600px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Distribuição de Tokens - Legends
          </h1>
          <p className="text-lg text-gray-600">
            Consulte a distribuição de tokens pela sua carteira
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

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

      <footer className="mt-16 pb-8 text-center text-sm text-gray-500">
        <p>
          Meu estoque de cerveja deu 404 Not Found. Aceito doações para corrigir
          este bug: 0xDb020F7AeD2159b888F31756c8da32a09334cD4B
        </p>
        <p>
          {" "}
          Todos os valores exibidos foram exportados via JSON da planilha do
          Google Sheets Distribuição Deals Racc compartilhada{" "}
        </p>
        <p>
          <Link
            className="font-semibold hover:underline"
            href="https://coinmarketcap.com/watchlist/683d0f0cff32c7050f8486d1/"
            target="_blank"
          >
            Clique aqui
          </Link>{" "}
          para acessar uma whitelist com os projetos existentes no Coinmarketcap
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
