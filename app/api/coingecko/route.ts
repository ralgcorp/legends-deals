import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "IDs parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        cache: "no-store", // Sempre buscar preços atualizados
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from CoinGecko");
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices from CoinGecko" },
      { status: 500 }
    );
  }
}
