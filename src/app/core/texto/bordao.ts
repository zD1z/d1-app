export interface PartesDoBordao {
  readonly antes: string;
  readonly destaque: string;
  readonly depois: string;
}

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
