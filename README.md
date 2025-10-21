# Token Distribution Dashboard

Um painel moderno para consultar a distribuição de tokens por carteira EVM em diferentes deals.

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build para Produção

```bash
# Criar build de produção
npm run build

# Executar versão de produção
npm start
```

## 📊 Gerenciamento de Dados

Os dados são armazenados localmente na pasta `/data` como arquivos JSON. Cada arquivo representa um deal (uma aba da planilha).

### Estrutura dos Arquivos JSON

Cada arquivo JSON deve seguir este formato:

```json
{
  "dealName": "Nome do Deal",
  "addresses": [
    {
      "address": "0x...",
      "totalTokens": 10000,
      "distributedTokens": 5000,
      "remainingTokens": 5000
    }
  ]
}
```

### Como Exportar Dados do Google Sheets

1. **Abra sua planilha Google Sheets**

   - Acesse: https://docs.google.com/spreadsheets/d/1lJdjJUY4hDXZudJ116EdJS5LXP6MUJmJ/edit?gid=1645293821#gid=1645293821

2. **Para cada aba (deal) da planilha:**

   a. Selecione a aba desejada

   b. Vá em `Arquivo` → `Download` → `Valores separados por vírgula (.csv, planilha atual)`

   c. Converta o CSV para JSON usando uma ferramenta online ou script:

   **Opção 1: Usando um conversor online**

   - Acesse https://csvjson.com/csv2json
   - Cole os dados do CSV
   - Configure para gerar o formato correto
   - Copie o JSON gerado

   **Opção 2: Script Node.js (recomendado)**

   Crie um arquivo `convert-csv-to-json.js`:

   ```javascript
   const fs = require("fs");
   const csv = require("csv-parser");

   const dealName = process.argv[2]; // Nome do deal
   const csvFile = process.argv[3]; // Arquivo CSV

   const addresses = [];

   fs.createReadStream(csvFile)
     .pipe(csv())
     .on("data", (row) => {
       if (row["EVM receive address"]) {
         addresses.push({
           address: row["EVM receive address"],
           totalTokens: parseInt(row["Total tokens"].replace(/,/g, "")),
           distributedTokens: parseInt(
             row["Distributed tokens"].replace(/,/g, "")
           ),
           remainingTokens: parseFloat(row["Remaining tokens"]),
         });
       }
     })
     .on("end", () => {
       const deal = {
         dealName,
         addresses,
       };

       const fileName = dealName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
       fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(deal, null, 2));

       console.log(`✅ Arquivo criado: data/${fileName}.json`);
     });
   ```

   Execute:

   ```bash
   # Instale csv-parser
   npm install csv-parser

   # Converta o CSV
   node convert-csv-to-json.js "Nome do Deal" caminho/para/arquivo.csv
   ```

3. **Salve o arquivo JSON na pasta `/data`**
   - Nomeie o arquivo de forma descritiva (ex: `star-labs.json`, `example-deal-1.json`)
   - O painel lerá automaticamente todos os arquivos `.json` da pasta `/data`

## 🔍 Como Pesquisar

1. Digite o endereço da carteira EVM no campo de busca
2. Clique em "Pesquisar"
3. O painel mostrará uma tabela com todos os deals onde essa carteira está presente
4. Cada linha da tabela representa um deal diferente com suas informações:
   - **Deal**: Nome do deal
   - **Total Tokens**: Total de tokens alocados
   - **Distributed Tokens**: Tokens já distribuídos
   - **Remaining Tokens**: Tokens restantes (destacados em verde se > 0)

### Exemplo de Endereços de Teste

Usando os dados de exemplo incluídos, você pode testar com:

- `0xba12bb8a91995c2a18a0de0083764d1d2fc9c22b` (presente em 3 deals)
- `0xdc42f272a3bb0e10d3d2fba2f750694d6ff25bbf` (presente em 2 deals)
- `0x28f25009d5a1e96763ac1201a5a9a6f4fac16f63` (presente em 2 deals)

## 📁 Estrutura do Projeto

```
deals/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts       # API para buscar dados
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Página principal
├── components/
│   ├── SearchBar.tsx          # Componente de busca
│   └── ResultsTable.tsx       # Componente de tabela
├── data/
│   ├── star-labs.json         # Dados do deal Star Labs
│   ├── example-deal-1.json    # Exemplo 1
│   └── example-deal-2.json    # Exemplo 2
├── types/
│   └── index.ts               # Definições TypeScript
└── README.md
```

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Node.js File System** - Leitura de arquivos JSON

## 📝 Notas

- A busca por endereço é case-insensitive
- Os números são formatados automaticamente com separadores de milhares (formato pt-BR)
- O painel é totalmente responsivo e funciona em dispositivos móveis

## 🤝 Contribuindo

Para adicionar novos deals:

1. Exporte os dados da aba do Google Sheets
2. Converta para o formato JSON especificado
3. Salve na pasta `/data` com um nome descritivo
4. O painel detectará automaticamente o novo arquivo

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
