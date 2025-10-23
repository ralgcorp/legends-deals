"use client";

import { useState } from "react";

interface Address {
  address: string;
  totalTokens: string;
  distributedTokens: string;
  remainingTokens: string;
  distribution?: string;
}

interface AddressesTableProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
  onSaveChanges?: () => void;
  dealName?: string;
}

export default function AddressesTable({
  addresses,
  onAddressesChange,
  onSaveChanges,
  dealName,
}: AddressesTableProps) {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [distributionPercentage, setDistributionPercentage] = useState("");
  const [showDistributionColumn, setShowDistributionColumn] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSaveWithSuccess = () => {
    if (onSaveChanges) {
      onSaveChanges();
      setShowSuccessPopup(true);
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  };

  const handleCellClick = (
    rowIndex: number,
    field: string,
    currentValue: string | number
  ) => {
    setEditingCell({ row: rowIndex, field });
    setEditValue(currentValue?.toString() || "");
  };

  const handleCellSave = () => {
    if (editingCell) {
      const updatedAddresses = [...addresses];
      const { row, field } = editingCell;

      // Manter valor como string para preservar formato original
      const value: string = editValue;

      updatedAddresses[row] = {
        ...updatedAddresses[row],
        [field]: value,
      };

      onAddressesChange(updatedAddresses);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellSave();
    } else if (e.key === "Escape") {
      handleCellCancel();
    }
  };

  const addNewAddress = () => {
    const newAddress: Address = {
      address: "",
      totalTokens: "0",
      distributedTokens: "0",
      remainingTokens: "0",
    };
    onAddressesChange([...addresses, newAddress]);
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    onAddressesChange(updatedAddresses);
  };

  const handleAddDistribution = () => {
    const percentage = parseFloat(distributionPercentage);
    if (isNaN(percentage) || percentage <= 0) {
      alert("Por favor, insira uma porcentagem válida maior que 0");
      return;
    }

    const updatedAddresses = addresses.map((address) => {
      const totalTokens = parseFloat(address.totalTokens.replace(/,/g, ""));
      const distributionValue = (totalTokens * percentage) / 100;
      return {
        ...address,
        distribution: distributionValue.toFixed(2),
      };
    });

    onAddressesChange(updatedAddresses);
    setShowDistributionColumn(true);
    setDistributionPercentage("");
  };

  const handleSaveDistribution = () => {
    const updatedAddresses = addresses.map((address) => {
      const distributedTokens = parseFloat(
        address.distributedTokens.replace(/,/g, "")
      );
      const distribution = parseFloat(address.distribution || "0");
      const remainingTokens = parseFloat(
        address.remainingTokens.replace(/,/g, "")
      );

      const newDistributedTokens = distributedTokens + distribution;
      const newRemainingTokens = remainingTokens - distribution;

      return {
        ...address,
        distributedTokens: newDistributedTokens.toFixed(2),
        remainingTokens: newRemainingTokens.toFixed(2),
        distribution: undefined, // Remove a coluna de distribuição
      };
    });

    onAddressesChange(updatedAddresses);
    setShowDistributionColumn(false);
  };

  const handleExportCSV = () => {
    // Cabeçalhos do CSV
    const headers = [
      "Endereço",
      "Total Tokens",
      "Tokens Distribuídos",
      "Tokens Restantes",
    ];

    // Se a coluna de distribuição estiver visível, adiciona ela
    if (showDistributionColumn) {
      headers.splice(3, 0, "Distribuição");
    }

    // Dados das linhas
    const csvData = addresses.map((address) => {
      const row = [
        address.address,
        address.totalTokens,
        address.distributedTokens,
        address.remainingTokens,
      ];

      // Se a coluna de distribuição estiver visível, adiciona ela
      if (showDistributionColumn) {
        row.splice(3, 0, address.distribution || "0");
      }

      return row;
    });

    // Combinar cabeçalhos e dados
    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Criar e baixar o arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Usar o nome da DEAL como nome do arquivo, ou um nome padrão se não houver
    const fileName = dealName
      ? `${dealName}.csv`
      : `enderecos_deal_${new Date().toISOString().split("T")[0]}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Endereços da DEAL
          </h2>
          <div className="flex gap-3">
            <button
              onClick={addNewAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
              Adicionar Endereço
            </button>
            {onSaveChanges && (
              <button
                onClick={handleSaveWithSuccess}
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Salvar Alterações
              </button>
            )}
          </div>
        </div>
        <div className="text-center py-8">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum endereço encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Clique no botão acima para adicionar o primeiro endereço
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Endereços da DEAL ({addresses.length})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={addNewAddress}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
            Adicionar Endereço
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar CSV
          </button>
          {onSaveChanges && (
            <button
              onClick={handleSaveWithSuccess}
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Salvar Alterações
            </button>
          )}
        </div>
      </div>

      {/* Seção de Distribuição */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-900 mb-3">
          Distribuição de Tokens
        </h3>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentagem de Distribuição (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={distributionPercentage}
              onChange={(e) => setDistributionPercentage(e.target.value)}
              placeholder="Ex: 10"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddDistribution}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Adicionar Distribuição
          </button>
          {showDistributionColumn && (
            <button
              onClick={handleSaveDistribution}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Salvar Distribuição
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Tokens
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens Distribuídos
              </th>
              {showDistributionColumn && (
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distribuição (
                  {addresses
                    .reduce((total, address) => {
                      const distribution = parseFloat(
                        address.distribution || "0"
                      );
                      return total + distribution;
                    }, 0)
                    .toFixed(2)}
                  )
                </th>
              )}
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens Restantes
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {addresses.map((address, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap">
                  {editingCell?.row === index &&
                  editingCell?.field === "address" ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="text-sm font-mono text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      onClick={() =>
                        handleCellClick(index, "address", address.address)
                      }
                    >
                      {address.address || "Clique para editar"}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-right">
                  {editingCell?.row === index &&
                  editingCell?.field === "totalTokens" ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-right font-mono"
                      onClick={() =>
                        handleCellClick(
                          index,
                          "totalTokens",
                          address.totalTokens
                        )
                      }
                    >
                      {address.totalTokens || "0"}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-right">
                  {editingCell?.row === index &&
                  editingCell?.field === "distributedTokens" ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-right font-mono"
                      onClick={() =>
                        handleCellClick(
                          index,
                          "distributedTokens",
                          address.distributedTokens
                        )
                      }
                    >
                      {address.distributedTokens || "0"}
                    </div>
                  )}
                </td>
                {showDistributionColumn && (
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    {editingCell?.row === index &&
                    editingCell?.field === "distribution" ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        className="w-full px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="text-sm text-purple-600 font-mono font-semibold cursor-pointer hover:bg-purple-50 px-2 py-1 rounded"
                        onClick={() =>
                          handleCellClick(
                            index,
                            "distribution",
                            address.distribution || "0"
                          )
                        }
                      >
                        {address.distribution || "0"}
                      </div>
                    )}
                  </td>
                )}
                <td className="px-3 py-3 whitespace-nowrap text-right">
                  {editingCell?.row === index &&
                  editingCell?.field === "remainingTokens" ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-right font-mono"
                      onClick={() =>
                        handleCellClick(
                          index,
                          "remainingTokens",
                          address.remainingTokens
                        )
                      }
                    >
                      {address.remainingTokens || "0"}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-center">
                  <button
                    onClick={() => removeAddress(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded p-1"
                    title="Remover endereço"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup de sucesso */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sucesso!
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                As alterações foram salvas com sucesso!
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
