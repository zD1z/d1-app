import { describe, expect, it } from 'vitest';
import { CONTEUDO } from '../conteudo/perfil';
import { ICONES } from '../icones/icones';
import {
  CONTRASTE_DO_ICONE,
  CONTRASTE_DO_MONOGRAMA,
  SUPERFICIE_NO_CLARO,
  SUPERFICIE_NO_ESCURO,
  corLegivel,
  coresLegiveis,
  razaoDeContraste,
} from './contraste';

describe('razaoDeContraste', () => {
  it('dá 21 entre preto e branco, em qualquer ordem', () => {
    expect(razaoDeContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(razaoDeContraste('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
  });

  it('dá 1 entre cores iguais', () => {
    expect(razaoDeContraste('#7952B3', '#7952B3')).toBeCloseTo(1, 5);
  });
});

describe('corLegivel', () => {
  it('devolve a cor intacta quando ela já passa', () => {
    expect(corLegivel('#FF9900', SUPERFICIE_NO_ESCURO, CONTRASTE_DO_ICONE)).toBe('#FF9900');
  });

  it('clareia no fundo escuro e escurece no fundo claro', () => {
    const noEscuro = corLegivel('#512BD4', SUPERFICIE_NO_ESCURO, CONTRASTE_DO_ICONE);
    const noClaro = corLegivel('#06B6D4', SUPERFICIE_NO_CLARO, CONTRASTE_DO_ICONE);

    expect(noEscuro).not.toBe('#512BD4');
    expect(noClaro).not.toBe('#06B6D4');
    expect(razaoDeContraste(noEscuro, '#FFFFFF')).toBeLessThan(
      razaoDeContraste('#512BD4', '#FFFFFF'),
    );
    expect(razaoDeContraste(noClaro, '#000000')).toBeLessThan(
      razaoDeContraste('#06B6D4', '#000000'),
    );
  });

  it('chega ao contraste até com preto no fundo escuro', () => {
    const cor = corLegivel('#000000', SUPERFICIE_NO_ESCURO, CONTRASTE_DO_MONOGRAMA);
    expect(razaoDeContraste(cor, SUPERFICIE_NO_ESCURO)).toBeGreaterThanOrEqual(
      CONTRASTE_DO_MONOGRAMA,
    );
  });
});

describe('cores de marca do site', () => {
  const temas = [SUPERFICIE_NO_ESCURO, SUPERFICIE_NO_CLARO] as const;

  it('deixa todo ícone legível nos dois temas', () => {
    for (const { titulo, cor } of Object.values(ICONES)) {
      if (!cor) continue;
      const { escuro, claro } = coresLegiveis(cor, CONTRASTE_DO_ICONE);

      expect(razaoDeContraste(escuro, temas[0]), `${titulo} no escuro`).toBeGreaterThanOrEqual(
        CONTRASTE_DO_ICONE,
      );
      expect(razaoDeContraste(claro, temas[1]), `${titulo} no claro`).toBeGreaterThanOrEqual(
        CONTRASTE_DO_ICONE,
      );
    }
  });

  it('deixa todo monograma legível nos dois temas', () => {
    const monogramas = CONTEUDO.tecnologias
      .flatMap((grupo) => grupo.itens)
      .filter((item) => item.cor);

    for (const { nome, cor } of monogramas) {
      const { escuro, claro } = coresLegiveis(cor!, CONTRASTE_DO_MONOGRAMA);

      expect(razaoDeContraste(escuro, temas[0]), `${nome} no escuro`).toBeGreaterThanOrEqual(
        CONTRASTE_DO_MONOGRAMA,
      );
      expect(razaoDeContraste(claro, temas[1]), `${nome} no claro`).toBeGreaterThanOrEqual(
        CONTRASTE_DO_MONOGRAMA,
      );
    }
  });
});
