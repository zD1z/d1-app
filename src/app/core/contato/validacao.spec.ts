import { describe, expect, it } from 'vitest';
import {
  CONTATO_MAXIMO,
  IDEIA_MAXIMA,
  IDEIA_MINIMA,
  erroDaIdeia,
  erroDoContato,
  pareceCelularComDdd,
  pareceEmail,
} from './validacao';

const IDEIA_BOA = 'Preciso de um sistema para controlar as entregas da minha loja.';

describe('erroDaIdeia', () => {
  it('aceita uma ideia com tamanho de gente', () => {
    expect(erroDaIdeia(IDEIA_BOA)).toBeNull();
  });

  it('cobra texto quando o campo está vazio', () => {
    expect(erroDaIdeia('   ')).toContain('Escreva');
  });

  it('cobra mais texto quando a ideia é curta', () => {
    expect(erroDaIdeia('quero um site')).toContain(String(IDEIA_MINIMA));
  });

  it('recusa acima do limite', () => {
    expect(erroDaIdeia('a'.repeat(IDEIA_MAXIMA + 1))).toContain(String(IDEIA_MAXIMA));
  });

  // O mesmo aparo que o endpoint faz. Se divergisse, o site aprovaria texto que
  // o servidor recusa, e a pessoa levaria erro sem entender por quê.
  it('conta o tamanho já sem o espaço das pontas', () => {
    expect(erroDaIdeia(`   ${IDEIA_BOA}   `)).toBeNull();
  });
});

describe('erroDoContato', () => {
  it('aceita e-mail', () => {
    expect(erroDoContato('pessoa@exemplo.com.br')).toBeNull();
  });

  it('aceita celular com máscara', () => {
    expect(erroDoContato('(11) 98888-7777')).toBeNull();
  });

  it('cobra preenchimento quando está vazio', () => {
    expect(erroDoContato('')).toContain('responder');
  });

  it('recusa contato longo demais', () => {
    expect(erroDoContato('a'.repeat(CONTATO_MAXIMO + 1))).toContain('longo');
  });

  it('recusa texto que não é e-mail nem celular', () => {
    expect(erroDoContato('me acha no LinkedIn')).toBe(
      'Escreva um e-mail válido ou um celular com DDD.',
    );
  });

  // Cada erro tem a sua frase. Quem digitou e-mail torto não precisa ouvir
  // falar de DDD, e quem esqueceu o DDD não precisa ouvir falar de arroba.
  it('fala de e-mail quando tem arroba', () => {
    expect(erroDoContato('pessoa@empresa')).toContain('e-mail');
  });

  it('fala de dígito faltando quando o celular está curto', () => {
    expect(erroDoContato('98888-7777')).toContain('Faltou dígito');
  });

  it('fala do DDD quando o DDD não existe', () => {
    expect(erroDoContato('(20) 98888-7777')).toContain('DDD não existe');
  });

  it('fala do nono dígito quando o número não começa com 9', () => {
    expect(erroDoContato('(11) 38888-7777')).toContain('começa com 9');
  });
});

describe('pareceEmail', () => {
  it.each(['a@b.com', 'nome.sobrenome@empresa.com.br', 'pessoa+marca@dominio.io'])(
    '%s parece e-mail',
    (valor) => {
      expect(pareceEmail(valor)).toBe(true);
    },
  );

  it.each(['a@b', 'sem-arroba.com', 'pessoa@empresa.c', 'pessoa@@empresa.com', 'pessoa@-x.com'])(
    '%s não parece e-mail',
    (valor) => {
      expect(pareceEmail(valor)).toBe(false);
    },
  );
});

describe('pareceCelularComDdd', () => {
  it.each(['11988887777', '(11) 98888-7777', '+55 11 98888 7777', '55 41 99999-0000'])(
    '%s parece celular com DDD',
    (valor) => {
      expect(pareceCelularComDdd(valor)).toBe(true);
    },
  );

  it.each([
    '988887777', // sem DDD
    '1138887777', // fixo de oito dígitos
    '11388887777', // onze dígitos, mas sem o nove
    '(20) 98888-7777', // DDD que não existe
    '551198888777', // doze dígitos, nem com país nem sem
    'sem digito',
  ])('%s não parece celular com DDD', (valor) => {
    expect(pareceCelularComDdd(valor)).toBe(false);
  });
});
