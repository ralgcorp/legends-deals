import DealTweets from "./DealTweets";

interface DealCardProps {
  deal: {
    dealName: string;
    dealToken: string;
    dealNetwork: string;
    dealPrice: string;
    dealStatus: string;
    dealTwitter: string;
    dealSite?: string;
    coingeckoId?: string;
  };
}

export default function DealCard({ deal }: DealCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "distributing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "awaiting tge":
        return "bg-yellow-100 text-yellow-800";
      case "phishing":
        return "bg-red-100 text-red-800";
      case "scam":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header da DEAL */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {deal.dealName}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              deal.dealStatus
            )}`}
          >
            {deal.dealStatus}
          </span>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {deal.dealToken.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Token</p>
            <p className="font-semibold text-gray-900 text-sm">
              {deal.dealToken}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500">Rede</p>
            <p className="font-semibold text-gray-900">{deal.dealNetwork}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Preço</p>
            <p className="font-semibold text-gray-900">${deal.dealPrice}</p>
          </div>
        </div>

        {deal.dealSite && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">Website</p>
            <a
              href={deal.dealSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate block"
            >
              {deal.dealSite.replace("https://", "")}
            </a>
          </div>
        )}

        {deal.dealTwitter && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">Twitter</p>
            <a
              href={deal.dealTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate block"
            >
              {deal.dealTwitter.replace("https://x.com/", "@")}
            </a>
          </div>
        )}
      </div>

      {/* Tweets */}
      <div className="bg-gray-50 p-4 flex-1">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Últimos Posts
        </h4>
        <div className="h-64">
          <DealTweets dealTwitterUrl={deal.dealTwitter} />
        </div>
      </div>
    </div>
  );
}
