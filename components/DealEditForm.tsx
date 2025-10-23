"use client";

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

interface DealEditFormProps {
  dealData: DealData;
  onDataChange: (updatedData: DealData) => void;
}

export default function DealEditForm({
  dealData,
  onDataChange,
}: DealEditFormProps) {
  const handleFieldChange = (field: string, value: string) => {
    const updatedData = {
      ...dealData,
      [field]: value,
    };
    onDataChange(updatedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Informações da DEAL
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nome da DEAL */}
        <div>
          <label
            htmlFor="dealName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nome da DEAL
          </label>
          <input
            type="text"
            id="dealName"
            value={dealData.dealName || ""}
            onChange={(e) => handleFieldChange("dealName", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Rede */}
        <div>
          <label
            htmlFor="dealNetwork"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rede
          </label>
          <input
            type="text"
            id="dealNetwork"
            value={dealData.dealNetwork || ""}
            onChange={(e) => handleFieldChange("dealNetwork", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* FDV */}
        <div>
          <label
            htmlFor="FDV"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            FDV
          </label>
          <input
            type="text"
            id="FDV"
            value={dealData.FDV || ""}
            onChange={(e) => handleFieldChange("FDV", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Round */}
        <div>
          <label
            htmlFor="dealRound"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Round
          </label>
          <input
            type="text"
            id="dealRound"
            value={dealData.dealRound || ""}
            onChange={(e) => handleFieldChange("dealRound", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* VC */}
        <div>
          <label
            htmlFor="dealVC"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            VC
          </label>
          <input
            type="text"
            id="dealVC"
            value={dealData.dealVC || ""}
            onChange={(e) => handleFieldChange("dealVC", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Vesting */}
        <div>
          <label
            htmlFor="vesting"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vesting
          </label>
          <textarea
            id="vesting"
            value={dealData.vesting || ""}
            onChange={(e) => handleFieldChange("vesting", e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* TGE */}
        <div>
          <label
            htmlFor="dealTGE"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            TGE
          </label>
          <input
            type="text"
            id="dealTGE"
            value={dealData.dealTGE || ""}
            onChange={(e) => handleFieldChange("dealTGE", e.target.value)}
            placeholder="DD/MM/YYYY"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Preço */}
        <div>
          <label
            htmlFor="dealPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Preço
          </label>
          <input
            type="number"
            step="0.000001"
            id="dealPrice"
            value={dealData.dealPrice || ""}
            onChange={(e) => handleFieldChange("dealPrice", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Taxa */}
        <div>
          <label
            htmlFor="dealFee"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Taxa
          </label>
          <input
            type="text"
            id="dealFee"
            value={dealData.dealFee || ""}
            onChange={(e) => handleFieldChange("dealFee", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Token */}
        <div>
          <label
            htmlFor="dealToken"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Token
          </label>
          <input
            type="text"
            id="dealToken"
            value={dealData.dealToken || ""}
            onChange={(e) => handleFieldChange("dealToken", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="dealStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="dealStatus"
            value={dealData.dealStatus || ""}
            onChange={(e) => handleFieldChange("dealStatus", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selecione...</option>
            <option value="active">Distribuindo</option>
            <option value="completed">Completo</option>
            <option value="phishing">Phishing</option>
            <option value="scam">Scam</option>
            <option value="paused">Pausado</option>
          </select>
        </div>
      </div>
    </div>
  );
}
