/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script para converter arquivos CSV exportados do Google Sheets para JSON
 *
 * Uso:
 * node scripts/convert-csv-to-json.js "Nome do Deal" caminho/para/arquivo.csv
 *
 * Exemplo:
 * node scripts/convert-csv-to-json.js "Star Labs" star-labs.csv
 */

const fs = require("fs");
const path = require("path");

// Verificar argumentos
if (process.argv.length < 4) {
  console.error("❌ Uso incorreto!");
  console.error(
    'Uso: node scripts/convert-csv-to-json.js "Nome do Deal" caminho/para/arquivo.csv'
  );
  console.error(
    'Exemplo: node scripts/convert-csv-to-json.js "Star Labs" star-labs.csv'
  );
  process.exit(1);
}

const dealName = process.argv[2];
const csvFilePath = process.argv[3];

// Verificar se o arquivo CSV existe
if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ Arquivo não encontrado: ${csvFilePath}`);
  process.exit(1);
}

// Ler o arquivo CSV
const csvContent = fs.readFileSync(csvFilePath, "utf-8");
const lines = csvContent.split("\n").filter((line) => line.trim());

if (lines.length < 2) {
  console.error("❌ Arquivo CSV vazio ou inválido");
  process.exit(1);
}

// Parsear o cabeçalho
const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

// Encontrar os índices das colunas
const addressIndex = headers.findIndex((h) =>
  h.toLowerCase().includes("address")
);
const totalIndex = headers.findIndex((h) =>
  h.toLowerCase().includes("total tokens")
);
const distributedIndex = headers.findIndex((h) =>
  h.toLowerCase().includes("distributed")
);
const remainingIndex = headers.findIndex((h) =>
  h.toLowerCase().includes("remaining")
);

if (addressIndex === -1 || totalIndex === -1) {
  console.error("❌ Colunas necessárias não encontradas no CSV");
  console.error(
    "Colunas esperadas: endereço, total tokens, distributed tokens, remaining tokens"
  );
  process.exit(1);
}

// Processar as linhas de dados
const addresses = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Parse CSV respeitando aspas
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  // Pegar os valores
  const address = values[addressIndex]?.replace(/^"|"$/g, "").trim();
  const totalTokens = values[totalIndex]?.replace(/[^0-9.]/g, "");
  const distributedTokens = values[distributedIndex]?.replace(/[^0-9.]/g, "");
  const remainingTokens = values[remainingIndex]?.replace(/[^0-9.]/g, "");

  // Validar endereço EVM
  if (address && address.startsWith("0x") && address.length >= 40) {
    addresses.push({
      address: address.toLowerCase(),
      totalTokens: totalTokens ? parseFloat(totalTokens) : 0,
      distributedTokens: distributedTokens ? parseFloat(distributedTokens) : 0,
      remainingTokens: remainingTokens ? parseFloat(remainingTokens) : 0,
    });
  }
}

if (addresses.length === 0) {
  console.error("❌ Nenhum endereço válido encontrado no CSV");
  process.exit(1);
}

// Criar objeto do deal
const deal = {
  dealName,
  addresses,
};

// Criar nome do arquivo
const fileName = dealName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// Garantir que a pasta data existe
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Salvar o arquivo JSON
const outputPath = path.join(dataDir, `${fileName}.json`);
fs.writeFileSync(outputPath, JSON.stringify(deal, null, 2));

console.log("✅ Conversão concluída com sucesso!");
console.log(`📁 Arquivo criado: data/${fileName}.json`);
console.log(`📊 Total de endereços: ${addresses.length}`);
console.log(
  `💰 Total de tokens: ${addresses
    .reduce((sum, a) => sum + a.totalTokens, 0)
    .toLocaleString("pt-BR")}`
);
