"use client";

import { SearchResult } from "@/types";

interface ResultsTableProps {
  results: SearchResult[];
  searchedAddress?: string;
}

export default function ResultsTable({
  results,
  searchedAddress,
}: ResultsTableProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR");
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const calculateTimeSinceTGE = (
    tgeDate: string
  ): { months: number; days: number } => {
    // Parse date in DD/MM/YYYY format
    const parts = tgeDate.split("/");
    if (parts.length !== 3) return { months: 0, days: 0 };

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2]);

    const tge = new Date(year, month, day);
    const now = new Date();

    // Calculate total difference in milliseconds
    const diffMs = now.getTime() - tge.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Calculate months and remaining days
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    return { months, days };
  };

  if (!searchedAddress) {
    return (
      <div className="w-full mx-auto text-center py-12">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pesquise uma carteira
        </h3>
        <p className="text-gray-500">
          Digite um endereço de carteira EVM acima para ver os tokens
          distribuídos
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full mx-auto text-center py-12">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-gray-500">
          A carteira{" "}
          <span className="font-mono text-sm">{searchedAddress}</span> não foi
          encontrada em nenhum deal
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Resultados para:{" "}
          <span className="font-mono text-sm font-medium text-gray-900">
            {searchedAddress}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Investimento Total:{" "}
          <span className="font-semibold text-lg text-green-600">
            $
            {formatCurrency(
              results.reduce((sum, result) => sum + (result.aporte || 0), 0)
            )}
          </span>
        </p>
      </div>
      <div className="shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Deal
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rede
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FDV
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Round
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vesting
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                TGE
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Preço
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Taxa
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Tokens
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aporte
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Alocação
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Distribuição
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Restante
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => {
              const distributedPercentage = calculatePercentage(
                result.distributedTokens,
                result.totalTokens
              );
              const remainingPercentage = calculatePercentage(
                result.remainingTokens,
                result.totalTokens
              );

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.dealName}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700">
                    {result.dealNetwork || "-"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700 font-medium">
                    {result.FDV || "-"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700">
                    {result.dealRound || result.dealVC ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        {result.dealRound && (
                          <span
                            className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              result.dealRound.toUpperCase() === "SEED"
                                ? "bg-blue-100 text-blue-800"
                                : result.dealRound.toUpperCase() ===
                                    "STRATEGIC" ||
                                  result.dealRound.toUpperCase() === "INVESTORS"
                                ? "bg-green-100 text-green-800"
                                : result.dealRound.toUpperCase() ===
                                    "PRIVATE" ||
                                  result.dealRound.toUpperCase() ===
                                    "PRIVATE 2" ||
                                  result.dealRound.toUpperCase() ===
                                    "INVESTOR" ||
                                  result.dealRound.toUpperCase() === "ROUND 2"
                                ? "bg-yellow-100 text-yellow-800"
                                : result.dealRound.toUpperCase() === "TGE" ||
                                  result.dealRound.toUpperCase() === "COMMUNITY"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {result.dealRound}
                          </span>
                        )}
                        {result.dealVC && (
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {result.dealVC}
                          </span>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 max-w-xs">
                    <div className="line-clamp-2" title={result.vesting}>
                      {result.vesting || "-"}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-700">
                    {result.dealTGE ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{result.dealTGE}</span>
                        <span className="text-[10px] text-gray-500">
                          {(() => {
                            const { months, days } = calculateTimeSinceTGE(
                              result.dealTGE
                            );
                            if (months === 0 && days === 0) return "Hoje";
                            const parts = [];
                            if (months > 0)
                              parts.push(
                                `${months} ${months === 1 ? "mês" : "meses"}`
                              );
                            if (days > 0)
                              parts.push(
                                `${days} ${days === 1 ? "dia" : "dias"}`
                              );
                            return parts.join(" e ");
                          })()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Awaiting
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {result.dealPrice ? `$${result.dealPrice}` : "-"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {result.dealFee ? (
                      (() => {
                        const feeMatch = result.dealFee.match(/(\d+)/);
                        const feeValue = feeMatch ? parseFloat(feeMatch[1]) : 0;

                        let colorClass = "bg-gray-100 text-gray-800";
                        if (feeValue === 20) {
                          colorClass = "bg-red-100 text-red-800";
                        } else if (feeValue >= 15 && feeValue < 20) {
                          colorClass = "bg-yellow-100 text-yellow-800";
                        } else if (feeValue >= 10 && feeValue < 15) {
                          colorClass = "bg-green-100 text-green-800";
                        } else if (
                          feeValue === 0 ||
                          result.dealFee.toLowerCase().includes("n/a")
                        ) {
                          colorClass = "bg-blue-100 text-blue-800";
                        }

                        return (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                          >
                            {result.dealFee}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right font-mono">
                    {result.dealToken ? (
                      <div className="flex flex-col gap-0.5 items-end">
                        <span>{formatNumber(result.totalTokens)}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">
                          {result.dealToken}
                        </span>
                      </div>
                    ) : (
                      formatNumber(result.totalTokens)
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {result.aporte && result.aporte > 0 ? (
                      <span className="font-semibold text-green-600">
                        ${formatCurrency(result.aporte)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {result.allocation && result.allocation > 0 ? (
                      <span className="font-semibold text-indigo-600">
                        ${formatCurrency(result.allocation)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {result.dealStatus?.toLowerCase() === "phishing" ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          PHISHING
                        </span>
                      </div>
                    ) : result.dealStatus?.toLowerCase() === "scam" ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          SCAM
                        </span>
                      </div>
                    ) : result.distributedTokens === 0 ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Awaiting TGE
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm">
                            {formatNumber(result.distributedTokens)}
                          </span>
                          <span className="text-xs font-medium text-blue-600">
                            {distributedPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${distributedPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {result.dealStatus?.toLowerCase() === "scam" ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          RUGPULL
                        </span>
                      </div>
                    ) : result.remainingTokens === 0 ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-green-600 font-medium font-mono text-sm">
                            {formatNumber(result.remainingTokens)}
                          </span>
                          <span className="text-xs font-medium text-green-600">
                            {remainingPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${remainingPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-sm">
                    {result.dealStatus?.toLowerCase() === "phishing" ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-yellow-600">
                          -100.00%
                        </span>
                        <span className="text-[10px] text-yellow-600 font-semibold">
                          PHISHING
                        </span>
                      </div>
                    ) : result.dealStatus?.toLowerCase() === "scam" ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-red-600">
                          -100.00%
                        </span>
                        <span className="text-[10px] text-red-500 font-semibold">
                          SCAM
                        </span>
                      </div>
                    ) : result.currentPrice && result.dealPrice ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-bold text-sm ${
                            result.performance && result.performance > 0
                              ? "text-green-600"
                              : result.performance && result.performance < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {result.performance && result.performance > 0
                            ? "+"
                            : ""}
                          {result.performance?.toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          ${result.currentPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-right">
        {results.length} deal{results.length !== 1 ? "s" : ""} encontrado
        {results.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
