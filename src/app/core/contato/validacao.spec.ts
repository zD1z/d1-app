import { describe, expect, it } from 'vitest';
import {
  CONTATO_MAXIMO,
  IDEIA_MAXIMA,
  IDEIA_MINIMA,
  erroDaIdeia,
  erroDoContato,
  pareceEmail,
  pareceTelefone,
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

  it('aceita WhatsApp com máscara', () => {
    expect(erroDoContato('(11) 98888-7777')).toBeNull();
  });

  it('cobra preenchimento quando está vazio', () => {
    expect(erroDoContato('')).toContain('responder');
  });

  it('recusa texto que não é e-mail nem telefone', () => {
    expect(erroDoContato('me acha no LinkedIn')).toContain('Não reconheci');
  });

  it('recusa contato longo demais', () => {
    expect(erroDoContato('a'.repeat(CONTATO_MAXIMO + 1))).toContain('longo');
  });
});

describe('pareceEmail e pareceTelefone', () => {
  it.each(['a@b.com', 'nome.sobrenome@empresa.com.br'])('%s parece e-mail', (valor) => {
    expect(pareceEmail(valor)).toBe(true);
  });

  it.each(['a@b', 'sem-arroba.com'])('%s não parece e-mail', (valor) => {
    expect(pareceEmail(valor)).toBe(false);
  });

  it.each(['11988887777', '+55 11 98888 7777'])('%s parece telefone', (valor) => {
    expect(pareceTelefone(valor)).toBe(true);
  });

  it.each(['1234567', 'sem digito'])('%s não parece telefone', (valor) => {
    expect(pareceTelefone(valor)).toBe(false);
  });
});
