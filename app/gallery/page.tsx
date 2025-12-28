"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DealCard from "../../components/DealCard";
import Footer from "../../components/Footer";

interface DealData {
  dealName: string;
  dealToken: string;
  dealNetwork: string;
  dealPrice: string;
  dealStatus: string;
  dealTwitter: string;
  dealSite?: string;
  coingeckoId?: string;
}

export default function Gallery() {
  const {
    isConnected,
    address,
    disconnectWallet,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [deals, setDeals] = useState<DealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Redirecionar para login se não estiver conectado
  useEffect(() => {
    if (!authLoading && !isConnected) {
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

  // Carregar DEALs
  useEffect(() => {
    const loadDeals = async () => {
      try {
        const response = await fetch("/api/deals");
        if (response.ok) {
          const data = await response.json();
          const dealNames = data.deals;

          // Carregar dados completos de cada DEAL
          const dealsData: DealData[] = [];
          for (const dealName of dealNames) {
            try {
              const dealResponse = await fetch(`/api/deals/${dealName}`);
              if (dealResponse.ok) {
                const dealData = await dealResponse.json();
                // Só incluir DEALs que têm dealTwitter
                if (dealData.dealTwitter) {
                  dealsData.push({
                    dealName: dealData.dealName,
                    dealToken: dealData.dealToken,
                    dealNetwork: dealData.dealNetwork,
                    dealPrice: dealData.dealPrice,
                    dealStatus: dealData.dealStatus,
                    dealTwitter: dealData.dealTwitter,
                    dealSite: dealData.dealSite,
                    coingeckoId: dealData.coingeckoId,
                  });
                }
              }
            } catch (error) {
              console.error(`Erro ao carregar DEAL ${dealName}:`, error);
            }
          }

          console.log("Deals loaded:", dealsData);
          setDeals(dealsData);
        }
      } catch (error) {
        console.error("Erro ao carregar DEALs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected && isAuthorized) {
      loadDeals();
    }
  }, [isConnected, isAuthorized]);

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autorização...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não autorizado
  if (!isConnected || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar a galeria.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Galeria de DEALs
              </h1>
              <p className="text-gray-600">
                Visualize as DEALs e seus últimos posts do Twitter
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Desconectar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-6 py-12 max-w-[1600px]">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando galeria...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nenhuma DEAL encontrada
            </h2>
            <p className="text-gray-600">
              Não há DEALs com informações do Twitter disponíveis.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {deals.length} DEAL{deals.length !== 1 ? "s" : ""} Disponíveis
              </h2>
              <p className="text-gray-600">
                Explore as informações e últimos posts do Twitter de cada DEAL
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {deals.map((deal, index) => (
                <DealCard key={`${deal.dealName}-${index}`} deal={deal} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
