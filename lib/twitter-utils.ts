/**
 * Extrai o username do Twitter de uma URL
 * @param twitterUrl - URL do Twitter (ex: https://x.com/username ou https://twitter.com/username)
 * @returns username ou null se não conseguir extrair
 */
export function extractTwitterUsername(twitterUrl: string): string | null {
  if (!twitterUrl) return null;

  try {
    const url = new URL(twitterUrl);
    const pathname = url.pathname;

    // Remover barras e pegar o primeiro segmento
    const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0);

    return segments[0] || null;
  } catch (error) {
    console.error("Erro ao extrair username do Twitter:", error);
    return null;
  }
}

/**
 * Valida se uma URL é do Twitter/X
 * @param url - URL para validar
 * @returns true se for uma URL válida do Twitter/X
 */
export function isValidTwitterUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "twitter.com" || urlObj.hostname === "x.com";
  } catch {
    return false;
  }
}

