import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { Contato } from './contato';

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
