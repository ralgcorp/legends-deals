"use client";

import { useEffect, useRef, useState } from "react";

interface TwitterTimelineProps {
  username: string;
  height?: number;
  theme?: "light" | "dark";
  tweetLimit?: number;
}

export default function TwitterTimeline({
  username,
  height = 400,
  theme = "light",
  tweetLimit = 3,
}: TwitterTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Carregar o script do Twitter Widgets se ainda não foi carregado
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.head.appendChild(script);

      script.onload = () => {
        // Aguardar o script carregar e então criar o timeline
        if (window.twttr && window.twttr.widgets) {
          createTimeline();
        }
      };
    } else {
      createTimeline();
    }

    function createTimeline() {
      if (containerRef.current && window.twttr && window.twttr.widgets) {
        // Limpar conteúdo anterior
        containerRef.current.innerHTML = "";

        // Criar o link do timeline
        const timelineLink = document.createElement("a");
        timelineLink.className = "twitter-timeline";
        timelineLink.href = `https://twitter.com/${username}?ref_src=twsrc%5Etfw`;
        timelineLink.textContent = `Tweets by ${username}`;

        // Adicionar atributos de configuração
        timelineLink.setAttribute("data-height", height.toString());
        timelineLink.setAttribute("data-theme", theme);
        timelineLink.setAttribute("data-tweet-limit", tweetLimit.toString());
        timelineLink.setAttribute("data-chrome", "nofooter noborders");

        containerRef.current.appendChild(timelineLink);

        // Carregar o widget com callback
        window.twttr.widgets
          .load(containerRef.current)
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setIsLoading(false);
          });
      }
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [username, height, theme, tweetLimit]);

  // Componente de Skeleton
  const SkeletonLoader = () => (
    <div className="w-full bg-gray-100 rounded-lg p-4 space-y-3 animate-pulse">
      {/* Header do tweet */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      {/* Conteúdo do tweet */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      {/* Ações do tweet */}
      <div className="flex space-x-6 pt-2">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </div>

      {/* Segundo tweet */}
      <div className="border-t pt-3 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Terceiro tweet */}
      <div className="border-t pt-3 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );

  // Estado de erro
  if (hasError) {
    return (
      <div className="w-full bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">
          <svg
            className="w-8 h-8 mx-auto mb-2"
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
        </div>
        <p className="text-sm text-gray-600">Erro ao carregar tweets</p>
        <p className="text-xs text-gray-500 mt-1">@{username}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        minHeight: `${height}px`,
        maxHeight: `${height}px`,
      }}
    >
      {isLoading && <SkeletonLoader />}
      <div
        ref={containerRef}
        className={`w-full ${isLoading ? "hidden" : "block"}`}
        style={{
          minHeight: `${height}px`,
          maxHeight: `${height}px`,
        }}
      />
    </div>
  );
}

// Declaração global para o TypeScript
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>;
      };
    };
  }
}
