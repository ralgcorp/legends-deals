"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DealSelector from "../../components/DealSelector";
import DealEditForm from "../../components/DealEditForm";
import AddressesTable from "../../components/AddressesTable";
import Footer from "../../components/Footer";

// Interfaces
interface Address {
  address: string;
  totalTokens: string;
  distributedTokens: string;
  remainingTokens: string;
}

interface DealData {
  dealName: string;
  dealNetwork: string;
  FDV: string;
  dealRound: string;
  dealVC: string;
  vesting: string;
  dealTGE: string;
  dealPrice: string;
  dealFee: string;
  dealToken: string;
  dealStatus: string;
  addresses: Address[];
}

export default function EditPage() {
  const {
    isConnected,
    address,
    disconnectWallet,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

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

          if (!data.autorizada) {
            setSaveMessage({
              type: "error",
              text: "Você não tem autorização para acessar a edição",
            });
          }
        } catch (error) {
          console.error("Erro ao verificar autorização:", error);
          setSaveMessage({
            type: "error",
            text: "Erro ao verificar autorização",
          });
        }
      }
    };

    verificarAutorizacao();
  }, [address]);

  // Redirecionar para login se não estiver conectado
  useEffect(() => {
    if (!authLoading && !isConnected) {
      router.push("/login");
    }
  }, [isConnected, authLoading, router]);

  const handleDealSelect = async (dealName: string) => {
    setSelectedDeal(dealName);
    setIsLoading(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/deals/${dealName}`);
      if (response.ok) {
        const data = await response.json();
        setDealData(data);
      } else {
        console.error("Erro ao carregar dados da DEAL");
      }
    } catch (error) {
      console.error("Erro ao carregar dados da DEAL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealDataChange = (updatedData: DealData) => {
    setDealData(updatedData);
  };

  const handleAddressesChange = (updatedAddresses: Address[]) => {
    setDealData((prev: DealData | null) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
  };

  const handleSave = async () => {
    if (!selectedDeal || !dealData) return;

    setSaveMessage(null);

    try {
      const response = await fetch(`/api/deals/${selectedDeal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealData),
      });

      if (response.ok) {
        setSaveMessage({ type: "success", text: "Dados salvos com sucesso!" });
      } else {
        setSaveMessage({ type: "error", text: "Erro ao salvar os dados" });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Erro ao salvar os dados" });
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

  // Mostrar loading enquanto verifica autorização
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autorização...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se não autorizado
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-4">
              Sua carteira não está autorizada para acessar a edição.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/panel")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Ir para Painel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header com botão de logout */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editor de DEALs - Legends
              </h1>
              <p className="text-sm text-gray-600">
                Carteira:{" "}
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Voltar
              </button>
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

      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Mensagem de sucesso/erro */}
        {saveMessage && (
          <div className="mb-6">
            <div
              className={`border rounded-lg p-4 ${
                saveMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex">
                <div className="shrink-0">
                  {saveMessage.type === "success" ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
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
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{saveMessage.text}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seletor de DEAL */}
        <div className="mb-8">
          <DealSelector onDealSelect={handleDealSelect} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando dados da DEAL...</p>
          </div>
        )}

        {/* Formulário e tabela */}
        {!isLoading && selectedDeal && dealData && (
          <>
            {/* Formulário de edição da DEAL */}
            <div className="mb-8">
              <DealEditForm
                dealData={dealData}
                onDataChange={handleDealDataChange}
              />
            </div>

            {/* Tabela de endereços */}
            <div className="mb-8">
              <AddressesTable
                addresses={dealData.addresses || []}
                onAddressesChange={handleAddressesChange}
                onSaveChanges={handleSave}
                dealName={selectedDeal}
              />
            </div>
          </>
        )}

        {/* Mensagem quando nenhuma DEAL está selecionada */}
        {!isLoading && !selectedDeal && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Como proceder com a edição
            </h3>
            <div className="max-w-4xl mx-auto text-left text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Coluna 1 */}
                <div className="flex flex-col space-y-4 h-full">
                  <div className="bg-blue-50 p-4 rounded-lg flex-1 flex flex-col">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      1. Selecionar uma DEAL
                    </h4>
                    <p className="text-blue-800 flex-1">
                      Use o dropdown no topo da página para selecionar a DEAL
                      que deseja editar. Você também pode criar uma nova DEAL
                      clicando em &quot;Adicionar DEAL&quot;.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg flex-1 flex flex-col">
                    <h4 className="font-semibold text-green-900 mb-2">
                      2. Editar informações da DEAL
                    </h4>
                    <p className="text-green-800 flex-1">
                      Após selecionar uma DEAL, você poderá editar todas as
                      informações principais como nome, rede, preço, vesting,
                      etc. no formulário que aparecerá.
                    </p>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="flex flex-col space-y-4 h-full">
                  <div className="bg-purple-50 p-4 rounded-lg flex-1 flex flex-col">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      3. Gerenciar endereços
                    </h4>
                    <p className="text-purple-800 flex-1">
                      Na tabela de endereços, você pode adicionar novos
                      endereços, editar valores de tokens clicando nas células,
                      e usar a funcionalidade de distribuição para calcular
                      porcentagens automaticamente.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg flex-1 flex flex-col">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      4. Exportar e salvar
                    </h4>
                    <p className="text-orange-800 flex-1">
                      Use o botão &quot;Exportar CSV&quot; para baixar os dados
                      da tabela. Clique em &quot;Salvar Alterações&quot; para
                      salvar todas as modificações no sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
