"use client";

import TwitterTimeline from "./TwitterTimeline";
import { extractTwitterUsername, isValidTwitterUrl } from "@/lib/twitter-utils";

interface DealTweetsProps {
  dealTwitterUrl: string;
}

export default function DealTweets({ dealTwitterUrl }: DealTweetsProps) {
  // Extrair username da URL do Twitter
  const username = extractTwitterUsername(dealTwitterUrl);

  // Se não conseguir extrair o username ou URL inválida, mostrar mensagem
  if (!username || !isValidTwitterUrl(dealTwitterUrl)) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p className="text-sm">URL do Twitter inválida</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <TwitterTimeline
        username={username}
        height={300}
        theme="light"
        tweetLimit={3}
      />
    </div>
  );
}
