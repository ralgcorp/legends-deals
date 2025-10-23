"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";

interface CarteiraData {
  carteirasAutorizadas: string[];
}

export default function PanelPage() {
  const { address, isConnected, disconnectWallet } = useAuth();
  const router = useRouter();
  const [carteiras, setCarteiras] = useState<string[]>([]);
  const [novaCarteira, setNovaCarteira] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Verificar se a carteira está autorizada
  useEffect(() => {
    const verificarAutorizacao = async () => {
      if (address) {
        try {
          const response = await fetch("/api/verificar-carteira", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carteira: address }),
          });

          const data = await response.json();
          setIsAuthorized(data.autorizada);

          if (!data.autorizada) {
            setMessage({
              type: "error",
              text: "Você não tem autorização para acessar este painel",
            });
          }
        } catch {
          console.error("Erro ao verificar autorização");
          setMessage({
            type: "error",
            text: "Erro ao verificar autorização",
          });
        }
      }
    };

    verificarAutorizacao();
  }, [address]);

  // Carregar carteiras autorizadas
  const carregarCarteiras = async () => {
    try {
      const response = await fetch("/api/carteiras");
      const data: CarteiraData = await response.json();
      setCarteiras(data.carteirasAutorizadas);
    } catch {
      console.error("Erro ao carregar carteiras");
      setMessage({
        type: "error",
        text: "Erro ao carregar carteiras",
      });
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      carregarCarteiras();
    }
  }, [isAuthorized]);

  // Redirecionar para login se não estiver conectado
  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  const handleAdicionarCarteira = async () => {
    if (!novaCarteira.trim()) {
      setMessage({
        type: "error",
        text: "Por favor, insira um endereço de carteira",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/carteiras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carteira: novaCarteira }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Carteira adicionada com sucesso!",
        });
        setNovaCarteira("");
        carregarCarteiras();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erro ao adicionar carteira",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Erro ao adicionar carteira",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverCarteira = async (carteira: string) => {
    if (carteira.toLowerCase() === address?.toLowerCase()) {
      setMessage({
        type: "error",
        text: "Você não pode remover sua própria carteira",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/carteiras", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carteira }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Carteira removida com sucesso!",
        });
        carregarCarteiras();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erro ao remover carteira",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Erro ao remover carteira",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    router.push("/login");
  };

  // Mostrar loading enquanto verifica autorização
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verificando autorização...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se não autorizado
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-4">
              Sua carteira não está autorizada para acessar este painel.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel de Administração
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie as carteiras autorizadas para edição
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Voltar
              </button>
              <button
                onClick={() => router.push("/edit")}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Distribuição
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Adicionar Nova Carteira */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Adicionar Nova Carteira
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={novaCarteira}
              onChange={(e) => setNovaCarteira(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAdicionarCarteira}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Lista de Carteiras */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Carteiras Autorizadas ({carteiras.length})
          </h2>
          {carteiras.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma carteira autorizada encontrada
            </p>
          ) : (
            <div className="space-y-3">
              {carteiras.map((carteira, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-mono text-sm text-gray-900">
                      {carteira}
                    </span>
                    {carteira.toLowerCase() === address?.toLowerCase() && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Você
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoverCarteira(carteira)}
                    disabled={
                      isLoading ||
                      carteira.toLowerCase() === address?.toLowerCase()
                    }
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
