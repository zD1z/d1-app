import { describe, expect, it } from 'vitest';
import { CONFIGURACAO_DE_CONTATO, formularioEstaLigado } from './contato';

describe('formularioEstaLigado', () => {
  it('liga quando os dois endereços existem', () => {
    expect(
      formularioEstaLigado({ endpoint: 'https://exemplo.on.aws/', chaveDoTurnstile: '0x4A' }),
    ).toBe(true);
  });

  it.each([
    ['sem endpoint', { endpoint: '', chaveDoTurnstile: '0x4A' }],
    ['sem chave', { endpoint: 'https://exemplo.on.aws/', chaveDoTurnstile: '' }],
    ['só espaço', { endpoint: '   ', chaveDoTurnstile: '   ' }],
  ])('desliga %s', (_caso, configuracao) => {
    expect(formularioEstaLigado(configuracao)).toBe(false);
  });

  it('lê a configuração do arquivo quando ninguém passa nada', () => {
    expect(formularioEstaLigado()).toBe(formularioEstaLigado(CONFIGURACAO_DE_CONTATO));
  });
});
