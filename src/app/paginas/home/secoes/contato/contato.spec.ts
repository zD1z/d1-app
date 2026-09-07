import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { Contato } from './contato';

/**
 * A seção tem dois estados, decididos por `core/config/contato.ts`: com o
 * endpoint configurado, a ação principal é o botão que abre o formulário e o
 * `mailto:` fica como alternativa; sem ele, o `mailto:` volta a ser a ação
 * principal.
 *
 * Os testes daqui valem nos dois, de propósito. Amarrar a um deles faria a
 * suíte quebrar quando o formulário fosse ligado ou desligado, que é
 * configuração e não defeito.
 */
describe('Contato', () => {
  let raiz: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(Contato);
    await fixture.whenStable();

    raiz = fixture.nativeElement;
  });

  it('sempre oferece o e-mail como caminho de contato', () => {
    const email = raiz.querySelector('a[href^="mailto:"]');
    expect(email?.getAttribute('href')).toContain(`mailto:${CONTEUDO.contato.email}`);
  });

  // O site é estático: o `mailto:` não tem backend nenhum por trás, e o assunto
  // pré-preenchido é o que dá alguma forma à mensagem que chega.
  it('leva o assunto codificado na URL do e-mail', () => {
    const email = raiz.querySelector('a[href^="mailto:"]');
    expect(email?.getAttribute('href')).toBe(
      `mailto:${CONTEUDO.contato.email}?subject=Tenho%20uma%20ideia`,
    );
  });

  it('mostra o endereço na tela, e não só no link', () => {
    expect(raiz.textContent).toContain(CONTEUDO.contato.email);
  });

  it('tem uma chamada principal na caixa', () => {
    expect(raiz.querySelector('.contato__caixa .botao--primario')).not.toBeNull();
  });
});
