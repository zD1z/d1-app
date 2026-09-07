import { describe, expect, it } from 'vitest';
import { partirBordao } from './bordao';

describe('partirBordao', () => {
  it('separa o trecho destacado do resto', () => {
    expect(partirBordao('D1 App para sua ideia', 'D1 App')).toEqual({
      antes: '',
      destaque: 'D1 App',
      depois: ' para sua ideia',
    });
  });

  it('mantém o texto antes e depois do destaque', () => {
    expect(partirBordao('quem faz o D1 App aqui', 'D1 App')).toEqual({
      antes: 'quem faz o ',
      destaque: 'D1 App',
      depois: ' aqui',
    });
  });

  // A rede de segurança do arquivo de conteúdo: `bordaoDestaque` precisa
  // existir dentro de `bordao`, e quando não existe o texto não pode sumir.
  it('devolve o bordão inteiro quando o destaque não está nele', () => {
    expect(partirBordao('D1 App para sua ideia', 'Outra coisa')).toEqual({
      antes: 'D1 App para sua ideia',
      destaque: '',
      depois: '',
    });
  });

  it('trata destaque vazio como ausência de destaque', () => {
    expect(partirBordao('D1 App para sua ideia', '')).toEqual({
      antes: 'D1 App para sua ideia',
      destaque: '',
      depois: '',
    });
  });

  it('usa a primeira ocorrência quando o destaque se repete', () => {
    expect(partirBordao('D1 e D1', 'D1')).toEqual({
      antes: '',
      destaque: 'D1',
      depois: ' e D1',
    });
  });
});
