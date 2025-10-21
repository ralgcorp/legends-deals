export interface Address {
  address: string;
  totalTokens: number | string;
  distributedTokens: number | string;
  remainingTokens: number | string;
}

export interface Deal {
  dealName: string;
  dealToken?: string;
  dealPrice?: string;
  currentPrice?: string;
  coingeckoId?: string;
  dealFee?: string;
  dealNetwork?: string;
  FDV?: string;
  dealRound?: string;
  dealVC?: string;
  vesting?: string;
  dealTGE?: string;
  dealStatus?: string;
  addresses: Address[];
}

export interface SearchResult {
  dealName: string;
  dealToken?: string;
  totalTokens: number;
  distributedTokens: number;
  remainingTokens: number;
  dealPrice?: string;
  currentPrice?: string;
  coingeckoId?: string;
  dealFee?: string;
  dealNetwork?: string;
  FDV?: string;
  dealRound?: string;
  dealVC?: string;
  vesting?: string;
  dealTGE?: string;
  dealStatus?: string;
  aporte?: number;
  allocation?: number;
  performance?: number;
}
