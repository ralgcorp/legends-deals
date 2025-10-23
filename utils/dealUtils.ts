/**
 * Remove o número da DEAL do nome para criar o nome do arquivo
 * Exemplo: "#25 - ZKasino" -> "zkasino", "#30 - Teste Nova DEAL" -> "teste-nova-deal"
 * "#03 - DIN (Web3Go)" -> "din"
 * @param dealName Nome completo da DEAL
 * @returns Nome limpo para arquivo em minúsculas com hífens
 */
export function getFileNameFromDealName(dealName: string): string {
  // Remove padrões como "#25 - ", "#25-", "#25 ", etc.
  // Remove conteúdo entre parênteses
  return dealName
    .replace(/^#\d+\s*-\s*/, "") // Remove número da DEAL
    .replace(/\s*\([^)]*\)\s*/g, "") // Remove conteúdo entre parênteses
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // Substitui espaços por hífens
}

/**
 * Verifica se o nome da DEAL tem número
 * @param dealName Nome da DEAL
 * @returns true se tem número
 */
export function hasDealNumber(dealName: string): boolean {
  return /^#\d+\s*-\s*/.test(dealName);
}

/**
 * Extrai o número da DEAL do nome
 * @param dealName Nome da DEAL
 * @returns Número da DEAL ou null
 */
export function getDealNumber(dealName: string): string | null {
  const match = dealName.match(/^#(\d+)\s*-\s*/);
  return match ? match[1] : null;
}

/**
 * Remove o número da DEAL do nome para exibição no dropdown
 * Exemplo: "#25 - ZKasino" -> "ZKasino"
 * "#03 - DIN (Web3Go)" -> "DIN"
 * @param dealName Nome completo da DEAL
 * @returns Nome da DEAL sem número e sem conteúdo entre parênteses
 */
export function getDealDisplayName(dealName: string): string {
  // Remove padrões como "#25 - ", "#25-", "#25 ", etc.
  // Remove conteúdo entre parênteses
  return dealName
    .replace(/^#\d+\s*-\s*/, "") // Remove número da DEAL
    .replace(/\s*\([^)]*\)\s*/g, "") // Remove conteúdo entre parênteses
    .trim();
}
