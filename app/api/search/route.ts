import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Address {
  address: string;
  totalTokens: string | number;
  distributedTokens: string | number;
  remainingTokens: string | number;
}

interface Deal {
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
  currentPrice?: number;
  coingeckoId?: string;
}

interface SearchResult {
  dealName: string;
  dealNetwork?: string;
  FDV?: string;
  dealRound?: string;
  dealVC?: string;
  dealToken?: string;
  totalTokens: number;
  distributedTokens: number;
  remainingTokens: number;
  dealPrice?: string;
  currentPrice?: string;
  dealFee?: string;
  allocation?: number;
  aporte?: number;
  performance?: number;
  coingeckoId?: string;
  vesting?: string;
  dealTGE?: string;
  dealStatus?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const dataDir = path.join(process.cwd(), "data");

    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json(
        { error: "Data directory not found" },
        { status: 500 }
      );
    }

    // Read all JSON files from data directory
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    const results: SearchResult[] = [];

    // Search through each deal file
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const deal: Deal = JSON.parse(fileContent);

      // Search for the address in this deal (case-insensitive)
      const foundAddress = deal.addresses.find(
        (addr: Address) =>
          addr.address &&
          typeof addr.address === "string" &&
          addr.address.toLowerCase() === address.toLowerCase()
      );

      if (foundAddress) {
        // Helper function to convert string or number to number
        const parseTokenValue = (value: string | number): number => {
          if (typeof value === "number") return value;
          // Remove commas and convert to number
          return parseFloat(value.replace(/,/g, "")) || 0;
        };

        const totalTokens = parseTokenValue(foundAddress.totalTokens);
        const dealPrice = deal.dealPrice ? parseFloat(deal.dealPrice) : 0;
        const allocation = dealPrice > 0 ? totalTokens * dealPrice : 0;

        // Calculate aporte (valor com taxa)
        // allocation é o valor sem taxa, aporte é o valor real pago
        let aporte = 0;
        if (allocation > 0 && deal.dealFee) {
          const feeMatch = deal.dealFee.match(/(\d+)/);
          if (feeMatch) {
            const feePercentage = parseFloat(feeMatch[1]);
            // aporte = allocation / (1 - (fee/100))
            aporte = allocation / (1 - feePercentage / 100);
          }
        }

        results.push({
          dealName: deal.dealName,
          dealToken: deal.dealToken,
          totalTokens,
          distributedTokens: parseTokenValue(foundAddress.distributedTokens),
          remainingTokens: parseTokenValue(foundAddress.remainingTokens),
          dealPrice: deal.dealPrice,
          currentPrice: deal.currentPrice?.toString(),
          dealFee: deal.dealFee,
          dealNetwork: deal.dealNetwork,
          FDV: deal.FDV,
          dealRound: deal.dealRound,
          dealVC: deal.dealVC,
          vesting: deal.vesting,
          dealTGE: deal.dealTGE,
          dealStatus: deal.dealStatus,
          aporte,
          allocation,
          performance: 0,
          coingeckoId: deal.coingeckoId,
        });
      }
    }

    // Fetch current prices from CoinGecko for tokens that have coingeckoId
    const coingeckoIds = results
      .filter((r) => r.coingeckoId)
      .map((r) => r.coingeckoId)
      .filter((id, index, self) => self.indexOf(id) === index) as string[]; // unique IDs

    if (coingeckoIds.length > 0) {
      try {
        const pricesResponse = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds.join(
            ","
          )}&vs_currencies=usd`
        );

        if (pricesResponse.ok) {
          const prices = await pricesResponse.json();

          // Update results with current prices and calculate performance
          results.forEach((result) => {
            if (
              result.coingeckoId &&
              prices[result.coingeckoId] &&
              prices[result.coingeckoId].usd
            ) {
              const currentPrice = prices[result.coingeckoId].usd;
              result.currentPrice = currentPrice.toString();

              // Calculate performance
              if (result.dealPrice) {
                const dealPrice = parseFloat(result.dealPrice);
                if (dealPrice > 0) {
                  result.performance =
                    ((currentPrice - dealPrice) / dealPrice) * 100;
                }
              }
            }
          });
        }
      } catch (error) {
        console.error("Error fetching prices from CoinGecko:", error);
        // Continue without prices if CoinGecko fails
      }
    }

    return NextResponse.json({
      address,
      results,
      totalDeals: results.length,
    });
  } catch (error) {
    console.error("Error searching for address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
