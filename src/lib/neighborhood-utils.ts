/**
 * Normalizes neighborhood names based on specific rules:
 * - Santa Rita de Cassia -> Morro da Formiga
 * - Fonseca -> Popular Nova
 * - centro -> Centro
 * - popular nova -> Popular Nova
 */
export function normalizeBairro(bairro: string): string {
  if (!bairro) return 'Não Informado';
  
  const trimmed = bairro.trim();
  const lower = trimmed.toLowerCase();
  
  // Specific mappings
  if (lower === 'santa rita de cassia' || lower === 'santa rita') {
    return 'Morro da Formiga';
  }
  
  if (lower === 'fonseca') {
    return 'Popular Nova';
  }
  
  if (lower === 'popular nova') {
    return 'Popular Nova';
  }
  
  if (lower === 'centro') {
    return 'Centro';
  }
  
  // Default: Title Case if it's all lowercase or all uppercase
  if (trimmed === lower || trimmed === trimmed.toUpperCase()) {
    return trimmed.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return trimmed;
}
