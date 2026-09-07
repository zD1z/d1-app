import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { Contato } from './contato';

/**
 * O site é estático: o botão de contato é um `mailto:`, e o assunto vai
 * pré-preenchido. O endereço é montado no componente, então o teste lê o `href`
 * renderizado em vez de espiar o membro protegido.
 */
describe('Contato', () => {
  let botao: HTMLAnchorElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(Contato);
    await fixture.whenStable();

    botao = fixture.nativeElement.querySelector('.contato__acoes a');
  });

  it('aponta para o e-mail do conteúdo', () => {
    expect(botao.getAttribute('href')).toContain(`mailto:${CONTEUDO.contato.email}`);
  });

  it('leva o assunto codificado na URL', () => {
    expect(botao.getAttribute('href')).toBe(
      `mailto:${CONTEUDO.contato.email}?subject=Tenho%20uma%20ideia`,
    );
  });

  it('mostra o endereço como rótulo do botão', () => {
    expect(botao.textContent?.trim()).toBe(CONTEUDO.contato.email);
  });
});
