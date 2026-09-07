import { describe, expect, it } from 'vitest';
import { ICONES } from '../icones/icones';
import { partirBordao } from '../texto/bordao';
import { CONTEUDO } from './perfil';

/**
 * O conteúdo é escrito à mão e nada nele é validado pelo compilador além do
 * formato. Estes testes cobrem os acordos que o tipo não expressa: referências
 * entre blocos, e campos que só fazem sentido em par.
 */
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

    // Sem ícone o cartão desenha um monograma, e sem sigla o monograma sai
    // vazio. Um dos dois campos é obrigatório na prática.
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

    // O que separa lista de prova. Sem a frase, o cartão vira só um logotipo.
    it('tem uma prova em cada item', () => {
      for (const tecnologia of tecnologias) {
        expect(tecnologia.prova.trim().length, tecnologia.nome).toBeGreaterThan(0);
      }
    });
  });

  describe('combinações', () => {
    /**
     * As peças são texto livre, e é aqui que a inconsistência apareceria em
     * silêncio. Uma peça vale quando bate com o nome da tecnologia, com a sua
     * sigla, ou com um dos lados de um nome composto por " e " (".NET e C#"
     * cobre ".NET").
     */
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
