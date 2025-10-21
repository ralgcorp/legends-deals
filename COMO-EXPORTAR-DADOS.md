# Como Exportar Dados do Google Sheets

Este guia mostra como exportar dados da sua planilha Google Sheets para usar no Token Distribution Dashboard.

## 📋 Passo a Passo

### 1. Abra a Planilha Google Sheets

Acesse sua planilha: https://docs.google.com/spreadsheets/d/1lJdjJUY4hDXZudJ116EdJS5LXP6MUJmJ/edit?gid=1645293821#gid=1645293821

### 2. Selecione a Aba (Deal) Desejada

Clique na aba inferior que você deseja exportar (ex: "Star Labs", "Example Deal 1", etc.)

### 3. Exporte como CSV

1. Vá no menu **Arquivo** → **Fazer download** → **Valores separados por vírgula (.csv, planilha atual)**
2. O arquivo será baixado para sua pasta de Downloads

### 4. Converta CSV para JSON

Abra o terminal na pasta do projeto e execute:

```bash
node scripts/convert-csv-to-json.js "Nome do Deal" caminho/para/arquivo.csv
```

**Exemplo:**

```bash
# Se o arquivo está na pasta Downloads
node scripts/convert-csv-to-json.js "Star Labs" ~/Downloads/Distribuição\ Deals\ Racc\ -\ Star\ Labs.csv

# Ou movendo o arquivo para a pasta do projeto primeiro
mv ~/Downloads/arquivo.csv ./
node scripts/convert-csv-to-json.js "Star Labs" ./arquivo.csv
```

### 5. Verificar o Resultado

O script criará automaticamente um arquivo JSON na pasta `data/` com o formato correto:

```
✅ Conversão concluída com sucesso!
📁 Arquivo criado: data/star-labs.json
📊 Total de endereços: 29
💰 Total de tokens: 353,695
```

### 6. Testar no Dashboard

1. Acesse http://localhost:3000
2. Digite um endereço de carteira EVM
3. Clique em "Pesquisar"
4. Veja os resultados consolidados de todos os deals

## 🔄 Atualização de Dados

Para atualizar os dados de um deal existente:

1. Delete o arquivo JSON antigo da pasta `data/`
2. Exporte novamente o CSV da planilha atualizada
3. Execute o script de conversão novamente

O dashboard lerá automaticamente os novos dados.

## 📝 Formato da Planilha

A planilha deve ter as seguintes colunas:

- **EVM receive address** - Endereço da carteira
- **Total tokens** - Total de tokens alocados
- **Distributed tokens** - Tokens já distribuídos
- **Remaining tokens** - Tokens restantes

Se os nomes das colunas forem diferentes, o script tentará encontrá-las automaticamente procurando por palavras-chave.

## ❓ Problemas Comuns

### Script não encontra as colunas

**Erro:** `❌ Colunas necessárias não encontradas no CSV`

**Solução:** Verifique se a planilha tem colunas com "address" e "total tokens" no nome. Ajuste os cabeçalhos se necessário.

### Nenhum endereço válido encontrado

**Erro:** `❌ Nenhum endereço válido encontrado no CSV`

**Solução:** Verifique se os endereços começam com "0x" e têm pelo menos 40 caracteres. Endereços inválidos são ignorados automaticamente.

### Arquivo CSV não encontrado

**Erro:** `❌ Arquivo não encontrado: arquivo.csv`

**Solução:** Verifique o caminho do arquivo. Use o caminho completo ou mova o arquivo para a pasta do projeto.

## 💡 Dicas

- Mantenha os arquivos CSV originais como backup
- Use nomes descritivos para os deals
- Exporte uma aba por vez
- Execute o script sempre que houver atualizações na planilha
- Os arquivos JSON podem ser editados manualmente se necessário

## 🤝 Precisa de Ajuda?

Se encontrar problemas, verifique:

1. Node.js está instalado (`node --version`)
2. Você está na pasta do projeto
3. A pasta `scripts/` existe
4. O arquivo CSV foi exportado corretamente
