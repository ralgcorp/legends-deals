"use client";

interface DealTweetsProps {
  dealTwitterUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DealTweets(_props: DealTweetsProps) {
  // TwitterTimeline foi removido
  return (
    <div className="w-full text-center py-4 text-gray-500">
      <p className="text-sm">Twitter timeline removido</p>
    </div>
  );
}
