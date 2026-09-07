import { afterEach, describe, expect, it } from 'vitest';
import { folgaDoCabecalho } from './folga-do-cabecalho';

describe('folgaDoCabecalho', () => {
  const raiz = document.documentElement;

  afterEach(() => {
    raiz.style.removeProperty('--altura-do-cabecalho');
  });

  it('lê a altura do token do CSS', () => {
    raiz.style.setProperty('--altura-do-cabecalho', '96px');
    expect(folgaDoCabecalho()).toBe(96);
  });

  it('acompanha o token quando ele muda', () => {
    raiz.style.setProperty('--altura-do-cabecalho', '120px');
    expect(folgaDoCabecalho()).toBe(120);
  });

  // Sem o token não existe segundo lugar de onde tirar o número, e a âncora
  // volta ao comportamento de antes do offset: alvo em y=0, sob o cabeçalho.
  it('devolve zero quando o token não existe', () => {
    expect(folgaDoCabecalho()).toBe(0);
  });
});
