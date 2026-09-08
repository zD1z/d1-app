import { describe, expect, it } from 'vitest';
import { ICONES } from '../icones/icones';
import { partirBordao } from '../texto/bordao';
import { CONTEUDO, INICIO_DA_CARREIRA, anosDesde } from './perfil';

describe('CONTEUDO', () => {
  const tecnologias = CONTEUDO.tecnologias.flatMap((grupo) => grupo.itens);

  describe('oferta', () => {
    it('tem o destaque dentro do bordão', () => {
      const { bordao, bordaoDestaque } = CONTEUDO.oferta;
      expect(partirBordao(bordao, bordaoDestaque).destaque).toBe(bordaoDestaque);
    });
  });

  describe('tecnologias', () => {
    it('não tem grupo vazio', () => {
      for (const grupo of CONTEUDO.tecnologias) {
        expect(grupo.itens.length, grupo.grupo).toBeGreaterThan(0);
      }
    });

    it('não repete tecnologia entre os grupos', () => {
      const nomes = tecnologias.map((tecnologia) => tecnologia.nome);
      expect(new Set(nomes).size).toBe(nomes.length);
    });

    it('tem ícone ou sigla em cada item', () => {
      for (const tecnologia of tecnologias) {
        expect(tecnologia.icone ?? tecnologia.sigla, tecnologia.nome).toBeTruthy();
      }
    });

    it('só aponta para chaves que existem em ICONES', () => {
      for (const tecnologia of tecnologias) {
        if (tecnologia.icone) {
          expect(Object.keys(ICONES), tecnologia.nome).toContain(tecnologia.icone);
        }
      }
    });

    it('tem uma prova em cada item', () => {
      for (const tecnologia of tecnologias) {
        expect(tecnologia.prova.trim().length, tecnologia.nome).toBeGreaterThan(0);
      }
    });
  });

  describe('combinações', () => {
    const existe = (peca: string): boolean =>
      tecnologias.some(
        (tecnologia) =>
          tecnologia.nome === peca ||
          tecnologia.sigla === peca ||
          tecnologia.nome.split(' e ').includes(peca),
      );

    it('só cita peças que estão na lista de tecnologias', () => {
      for (const combinacao of CONTEUDO.combinacoes) {
        for (const peca of combinacao.pecas) {
          expect(existe(peca), `${combinacao.titulo}: ${peca}`).toBe(true);
        }
      }
    });

    it('não deixa combinação sem peça', () => {
      for (const combinacao of CONTEUDO.combinacoes) {
        expect(combinacao.pecas.length, combinacao.titulo).toBeGreaterThan(0);
      }
    });
  });

  describe('contato', () => {
    it('tem e-mail com formato utilizável em mailto:', () => {
      expect(CONTEUDO.contato.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('tem LinkedIn em https', () => {
      expect(CONTEUDO.contato.linkedin).toMatch(/^https:\/\//);
    });
  });
});

describe('números que envelhecem', () => {
  it('conta os anos a partir do ano de início, e não de um texto escrito à mão', () => {
    expect(anosDesde(2011, new Date(2026, 0, 1))).toBe(15);
    expect(anosDesde(2011, new Date(2027, 0, 1))).toBe(16);
  });

  it('publica o número derivado, junto do ano de partida', () => {
    const anos = CONTEUDO.numeros[0];

    expect(anos.valor).toBe(`${anosDesde(INICIO_DA_CARREIRA)} anos`);
    expect(anos.rotulo).toContain(String(INICIO_DA_CARREIRA));
  });
});
