"use client";

import { useState, useEffect } from "react";

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

interface DealSelectorProps {
  onDealSelect: (dealName: string) => void;
  onNewDeal?: (dealData: DealData) => void;
}

export default function DealSelector({
  onDealSelect,
  onNewDeal,
}: DealSelectorProps) {
  const [deals, setDeals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewDealForm, setShowNewDealForm] = useState(false);
  const [newDealName, setNewDealName] = useState("");
  const [newDealData, setNewDealData] = useState<DealData>({
    dealName: "",
    dealNetwork: "",
    FDV: "",
    dealRound: "",
    dealVC: "",
    vesting: "",
    dealTGE: "",
    dealPrice: "",
    dealFee: "",
    dealToken: "",
    dealStatus: "",
    addresses: [],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string>("");

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const response = await fetch("/api/deals");
        if (response.ok) {
          const data = await response.json();
          setDeals(data.deals || []);
        }
      } catch (error) {
        console.error("Erro ao carregar lista de DEALs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  const handleSelect = (dealName: string) => {
    if (dealName) {
      onDealSelect(dealName);
    }
  };

  const handleNewDealNameChange = (name: string) => {
    setNewDealName(name);
    setNewDealData((prev) => ({
      ...prev,
      dealName: name,
    }));
  };

  const handleNewDealFieldChange = (field: string, value: string) => {
    setNewDealData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateNewDeal = async () => {
    if (!newDealName.trim()) {
      alert("Por favor, insira um nome para a DEAL");
      return;
    }

    if (deals.includes(newDealName)) {
      alert("Já existe uma DEAL com este nome");
      return;
    }

    // Validar nome da DEAL
    const trimmedName = newDealName.trim();
    if (!trimmedName) {
      alert("O nome da DEAL não pode estar vazio");
      return;
    }

    if (trimmedName.length > 50) {
      alert("O nome da DEAL não pode ter mais de 50 caracteres");
      return;
    }

    // Validar caracteres problemáticos
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(trimmedName)) {
      alert(
        'O nome da DEAL não pode conter caracteres especiais: < > : " / \\ | ? *'
      );
      return;
    }

    if (trimmedName.startsWith(".") || trimmedName.endsWith(".")) {
      alert("O nome da DEAL não pode começar ou terminar com ponto");
      return;
    }

    console.log("Criando nova DEAL:", newDealName);
    console.log("Dados da DEAL:", newDealData);

    try {
      const encodedDealName = encodeURIComponent(newDealName);
      const response = await fetch(`/api/deals/${encodedDealName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDealData),
      });

      if (response.ok) {
        // Atualizar lista de DEALs
        setDeals((prev) => [...prev, newDealName].sort());

        // Limpar formulário
        setNewDealName("");
        setNewDealData({
          dealName: "",
          dealNetwork: "",
          FDV: "",
          dealRound: "",
          dealVC: "",
          vesting: "",
          dealTGE: "",
          dealPrice: "",
          dealFee: "",
          dealToken: "",
          dealStatus: "",
          addresses: [],
        });
        setShowNewDealForm(false);

        // Selecionar a nova DEAL
        onDealSelect(newDealName);

        if (onNewDeal) {
          onNewDeal(newDealData);
        }
      } else {
        const errorData = await response.json();
        console.error("Erro ao criar DEAL:", errorData);
        alert(
          `Erro ao criar a DEAL: ${errorData.error || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro ao criar DEAL:", error);
      alert(
        `Erro ao criar a DEAL: ${
          error instanceof Error ? error.message : "Erro de conexão"
        }`
      );
    }
  };

  const handleCancelNewDeal = () => {
    setShowNewDealForm(false);
    setNewDealName("");
    setNewDealData({
      dealName: "",
      dealNetwork: "",
      FDV: "",
      dealRound: "",
      dealVC: "",
      vesting: "",
      dealTGE: "",
      dealPrice: "",
      dealFee: "",
      dealToken: "",
      dealStatus: "",
      addresses: [],
    });
  };

  const handleDeleteDeal = (dealName: string) => {
    setDealToDelete(dealName);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      const encodedDealName = encodeURIComponent(dealToDelete);
      const response = await fetch(`/api/deals/${encodedDealName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remover da lista de deals
        setDeals((prev) => prev.filter((deal) => deal !== dealToDelete));
        setShowDeleteConfirm(false);
        setDealToDelete("");
        alert("DEAL deletada com sucesso!");
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao deletar DEAL: ${errorData.error || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro ao deletar DEAL:", error);
      alert(
        `Erro ao deletar DEAL: ${
          error instanceof Error ? error.message : "Erro de conexão"
        }`
      );
    }
  };

  const cancelDeleteDeal = () => {
    setShowDeleteConfirm(false);
    setDealToDelete("");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando DEALs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-md">
          <select
            id="deal-select"
            onChange={(e) => handleSelect(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma DEAL...
            </option>
            {deals.map((deal) => (
              <option key={deal} value={deal}>
                {deal}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowNewDealForm(!showNewDealForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Adicionar DEAL
          </button>

          <button
            onClick={() => {
              const selectElement = document.getElementById(
                "deal-select"
              ) as HTMLSelectElement;
              const selectedDeal = selectElement?.value;
              if (selectedDeal) {
                handleDeleteDeal(selectedDeal);
              } else {
                alert("Selecione uma DEAL para deletar");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Apagar DEAL
          </button>
        </div>
      </div>

      {showNewDealForm && (
        <div className="pt-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">
            Criar Nova DEAL
          </h3>

          {/* Nome da DEAL */}
          <div className="mb-4">
            <label
              htmlFor="new-deal-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome da DEAL
            </label>
            <input
              type="text"
              id="new-deal-name"
              value={newDealName}
              onChange={(e) => handleNewDealNameChange(e.target.value)}
              placeholder="Ex: #26 - Nova DEAL"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Campos da DEAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="new-deal-network"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rede
              </label>
              <input
                type="text"
                id="new-deal-network"
                value={newDealData.dealNetwork}
                onChange={(e) =>
                  handleNewDealFieldChange("dealNetwork", e.target.value)
                }
                placeholder="Ex: Ethereum, BSC, Polygon, Arbitrum"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-fdv"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                FDV
              </label>
              <input
                type="text"
                id="new-deal-fdv"
                value={newDealData.FDV}
                onChange={(e) =>
                  handleNewDealFieldChange("FDV", e.target.value)
                }
                placeholder="Ex: $50M, $100M, $500M"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-round"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Round
              </label>
              <input
                type="text"
                id="new-deal-round"
                value={newDealData.dealRound}
                onChange={(e) =>
                  handleNewDealFieldChange("dealRound", e.target.value)
                }
                placeholder="Ex: Private, Seed, Series A, Public"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-vc"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                VC
              </label>
              <input
                type="text"
                id="new-deal-vc"
                value={newDealData.dealVC}
                onChange={(e) =>
                  handleNewDealFieldChange("dealVC", e.target.value)
                }
                placeholder="Ex: Binance Labs, a16z, Paradigm"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-tge"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                TGE
              </label>
              <input
                type="text"
                id="new-deal-tge"
                value={newDealData.dealTGE}
                onChange={(e) =>
                  handleNewDealFieldChange("dealTGE", e.target.value)
                }
                placeholder="DD/MM/YYYY"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preço
              </label>
              <input
                type="number"
                step="0.000001"
                id="new-deal-price"
                value={newDealData.dealPrice}
                onChange={(e) =>
                  handleNewDealFieldChange("dealPrice", e.target.value)
                }
                placeholder="Ex: 0.05, 0.1, 0.25"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-fee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Taxa
              </label>
              <input
                type="text"
                id="new-deal-fee"
                value={newDealData.dealFee}
                onChange={(e) =>
                  handleNewDealFieldChange("dealFee", e.target.value)
                }
                placeholder="Ex: 5%, 10%, 15%"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-token"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Token
              </label>
              <input
                type="text"
                id="new-deal-token"
                value={newDealData.dealToken}
                onChange={(e) =>
                  handleNewDealFieldChange("dealToken", e.target.value)
                }
                placeholder="Ex: ETH, BTC, USDC, TOKEN"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="new-deal-status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="new-deal-status"
                value={newDealData.dealStatus}
                onChange={(e) =>
                  handleNewDealFieldChange("dealStatus", e.target.value)
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              >
                <option value="">Selecione...</option>
                <option value="active">Ativo</option>
                <option value="completed">Completo</option>
                <option value="phishing">Phishing</option>
                <option value="scam">Scam</option>
                <option value="paused">Pausado</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="new-deal-vesting"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vesting
            </label>
            <textarea
              id="new-deal-vesting"
              value={newDealData.vesting}
              onChange={(e) =>
                handleNewDealFieldChange("vesting", e.target.value)
              }
              rows={3}
              placeholder="Ex: 10% TGE, 6M cliff e 18M"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCreateNewDeal}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Criar DEAL
            </button>
            <button
              onClick={handleCancelNewDeal}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Popup de confirmação de deleção */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Exclusão
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar a DEAL{" "}
                <strong>&quot;{dealToDelete}&quot;</strong>?
                <br />
                <span className="text-red-600 font-medium">
                  Esta ação não pode ser desfeita!
                </span>
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDeleteDeal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteDeal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
