# 🚀 Quick Start - Token Distribution Dashboard

## Início Rápido (3 passos)

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Iniciar o servidor

```bash
npm run dev
```

### 3️⃣ Acessar o dashboard

Abra no navegador: **http://localhost:3000**

---

## 📊 Testar com Dados de Exemplo

O projeto já vem com dados de exemplo. Experimente pesquisar por:

- `0xba12bb8a91995c2a18a0de0083764d1d2fc9c22b` (3 deals)
- `0xdc42f272a3bb0e10d3d2fba2f750694d6ff25bbf` (2 deals)
- `0x28f25009d5a1e96763ac1201a5a9a6f4fac16f63` (2 deals)

---

## ➕ Adicionar Seus Dados

### Exportar do Google Sheets

1. Abra sua planilha
2. Selecione uma aba (deal)
3. Vá em **Arquivo** → **Fazer download** → **CSV (.csv, planilha atual)**

### Converter para JSON

```bash
npm run convert "Nome do Deal" caminho/para/arquivo.csv
```

**Exemplo:**

```bash
npm run convert "Star Labs" ~/Downloads/planilha.csv
```

O arquivo será criado automaticamente em `data/nome-do-deal.json`

---

## 📁 Estrutura de Dados

Cada arquivo JSON em `data/` deve ter este formato:

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

---

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm start

# Converter CSV para JSON
npm run convert "Deal Name" file.csv

# Verificar erros de código
npm run lint
```

---

## 📖 Documentação Completa

- **README.md** - Documentação completa do projeto
- **COMO-EXPORTAR-DADOS.md** - Guia detalhado de exportação

---

## ❓ Problemas?

### O servidor não inicia

- Verifique se a porta 3000 está livre
- Execute: `npm install` novamente

### Não encontra resultados

- Verifique se há arquivos `.json` na pasta `data/`
- Confirme que o endereço está correto (case-insensitive)
- O endereço deve começar com `0x`

### Erro ao converter CSV

- Verifique o caminho do arquivo
- Certifique-se que o CSV tem as colunas corretas
- Execute: `node scripts/convert-csv-to-json.js` para ver o uso

---

## 💡 Dicas

✅ Os arquivos JSON são lidos automaticamente - basta adicionar na pasta `data/`  
✅ A busca é case-insensitive (maiúsculas/minúsculas não importam)  
✅ Você pode editar os arquivos JSON manualmente se necessário  
✅ O dashboard atualiza automaticamente quando você reinicia o servidor

---

**Pronto para começar! 🎉**
