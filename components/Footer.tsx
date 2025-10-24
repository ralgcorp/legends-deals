export default function Footer() {
  return (
    <footer className="mt-12 pb-8 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Informações sobre dados ausentes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Dados Ausentes
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              As seguintes DEALs não possuem dados de distribuição na planilha:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
              <p>• #02 - Gunzilla (node)</p>
              <p>• #06 - Runes Terminal</p>
              <p>• #09 - Aethir (node)</p>
              <p>• #11 - Partísia</p>
              <p>• #12 - GPU.net (node)</p>
              <p>• #23 - Matrix One</p>
              <p>• #24 - MetaXseed (node)</p>
              <p>• #25 - ZKasino</p>
            </div>
          </div>

          {/* Fonte dos dados */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Fonte dos Dados
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Distribuições:</span> Planilha
                &quot;Distribuição Deals Racc&quot; compartilhada
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Performance:</span> API da
                CoinGecko
              </p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Sobre o Sistema
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dashboard para consulta e gerenciamento de distribuições de tokens
              em diferentes deals de investimento Racc Ventures - Legends.
            </p>
            <p className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-gray-500">
              © 2025 Racc Ventures. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Desenvolvido por CriptomanBR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
