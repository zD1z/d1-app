/**
 * O bordão da home sai com um trecho em cor. Em vez de guardar HTML no arquivo
 * de conteúdo, o texto e o trecho a destacar viajam como duas strings e a
 * quebra acontece aqui.
 */
export interface PartesDoBordao {
  readonly antes: string;
  readonly destaque: string;
  readonly depois: string;
}

/**
 * Quebra `bordao` em antes / destaque / depois na primeira ocorrência de
 * `destaque`.
 *
 * Quando o destaque não existe dentro do bordão, o bordão inteiro volta como
 * `antes`: o hero desenha o texto sem cor, em vez de sumir com ele. É o caso de
 * quem editou `bordao` no perfil e esqueceu de acertar `bordaoDestaque`.
 */
export function partirBordao(bordao: string, destaque: string): PartesDoBordao {
  const corte = destaque ? bordao.indexOf(destaque) : -1;

  if (corte < 0) {
    return { antes: bordao, destaque: '', depois: '' };
  }

  return {
    antes: bordao.slice(0, corte),
    destaque,
    depois: bordao.slice(corte + destaque.length),
  };
}
