export default function Footer() {
  return (
    <footer className="mt-8 pb-8 text-center text-sm text-gray-500">
      <p className="text-sm text-gray-500 mb-4">
        Os dados de distribuições das DEALs #02 - Gunzilla (node), #06 - Runes
        Terminal, #09 - Aethir (node), #11 - Partísia, <br /> #12 - GPU.net
        (node), #23 - Matrix One #24 - MetaXseed (node), #25 - ZKasino, não
        encontram-se na planilha
      </p>
      <p>
        {" "}
        Os valores exibidos foram exportados da planilha Distribuição Deals Racc
        compartilhada{" "}
      </p>
      <p>
        {" "}
        Os dados de Performance estão sendo obtidos através da API da CoinGecko{" "}
      </p>
    </footer>
  );
}
